// @ts-ignore
import * as info from "../info.js";
import { createStatWidget } from "../window/createStatWidget";
import { areStatisticsPaused } from "./../window/windowPause";
import { WritableStore, store } from "openrct2-flexui";

export class Statistic<T, U> {
    /** The save/load key. */
    statKey!: string;

    /** The display name on the widget. */
    statName!: string;

    /** The store that holds the value of the game stat. */
    gameStatStore!: WritableStore<U>;

    /** The store that holds the value of the park stat. */
    parkStatStore!: WritableStore<U>;

    /** The value when resetting the stat. */
    resetValue!: U;

    /** The function that allows subscribing to updates of the statistic value. */
    subscriber!: (updateStat: (newValue: T) => void) => void;

    /** The function that accumulates the new value into the existing value. */
    accumulator: (newValue: T, existingValues: U) => U;

    /** The function that formats the value for display. */
    formatDisplay!: (value: U) => string;

    /** The widget that displays the stat. */
    get widget() {
        return createStatWidget({
            title: this.statName,
            gameStatStore: this.gameStatStore,
            parkStatStore: this.parkStatStore,
            formatDisplay: this.formatDisplay,
        });
    }

    constructor(
        /** The save/load key. */
        key: string,

        /** The display name on the widget. */
        title: string,

        /** The value when resetting the stat; should be an empty-ish value (0, "", [], etc.) */
        resetValue: U,

        /**
         * The function that allows subscribing to updates of the statistic value.
         * @param updateStat - A callback function to be called when the statistic value is updated.
         *                     It takes a single parameter: the new value of the statistic.
         */
        subscriber: (updateStat: (newValue: T) => void) => void,

        /**
         * The function that accumulates the new value into the existing value.
         * Could concatenate by adding, spreading into a new array, etc.
         *
         * @example
         * function accumulateNewRide(newRide: RideStat, existingRides: RideStat[]) {
         *   return [...existingRides, newRide];
         * }
         */
        accumulator: (newValue: T, oldValue: U) => U,

        /** The function that formats the value for display. */
        formatDisplay: (value: U) => string,
    ) {
        this.statKey = key;
        this.statName = title;
        this.resetValue = resetValue;
        this.subscriber = subscriber;
        this.accumulator = accumulator;
        this.formatDisplay = formatDisplay;

        // Copilot says to bind the updateStat function to the class
        // so that it can be passed as a callback
        this.subscriber(this.updateStat.bind(this));

        this.initialize();
    }

    initialize() {
        this.initializeGameStatStore();
        this.initializeParkStatStore();

        // Make sure to load the park stat when the map changes
        context.subscribe("map.changed", () => {
            this.loadParkStat();
        });
    }

    updateStat(newValue: T) {
        if (areStatisticsPaused.get()) {
            return;
        }

        // Handle game stat
        const oldValue = this.gameStatStore.get();
        const newGameStoreValue = this.accumulator(newValue, oldValue);
        this.gameStatStore.set(newGameStoreValue);

        // Handle park stat
        const parkOldValue = this.parkStatStore.get();
        const newParkStoreValue = this.accumulator(newValue, parkOldValue);
        this.parkStatStore.set(newParkStoreValue);
    }

    loadParkStat() {
        if (context.mode == "normal") {
            const parkStatKey = `${info.name}.${this.statKey}.parkValue`;
            this.parkStatStore.set(context.getParkStorage().get(parkStatKey, this.resetValue));
        }
    }

    /**
     * Initializes the game stat store.
     * Stores the values across all parks and play sessions.
     */
    initializeGameStatStore() {
        const gameStatKey = `${info.name}.${this.statKey}.gameValue`;
        this.gameStatStore = store(context.sharedStorage.get(gameStatKey, this.resetValue));
        this.gameStatStore.subscribe((newValue) => {
            context.sharedStorage.set(gameStatKey, newValue);
        });
    }

    /**
     * Initializes the park stat store.
     * Stores the values for the current park, preserving them across saves and loads.
     */
    initializeParkStatStore() {
        const parkStatKey = `${info.name}.${this.statKey}.parkValue`;
        this.parkStatStore = store(
            context.mode == "normal"
                ? context.getParkStorage().get(parkStatKey, this.resetValue)
                : this.resetValue,
        );
        this.parkStatStore.subscribe((newValue) => {
            if (context.mode == "normal") {
                context.getParkStorage().set(parkStatKey, newValue);
            }
        });
    }
}
