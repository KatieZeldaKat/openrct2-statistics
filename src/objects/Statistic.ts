// @ts-ignore
import * as info from "../info.js";
import { createStatWidget } from "../window/createStatWidget";
import { areStatisticsPaused } from "./../window/windowPause";
import { WritableStore, store } from "openrct2-flexui";
import { UnsupportedStatistic } from "./UnsupportedStatistic.js";

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

    /** The required API version for the stat to be supported. */
    minimumApiVersion!: number;

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

        /** The required API version for the stat to be supported. */
        minimumApiVersion: number,

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
        this.minimumApiVersion = minimumApiVersion;
        this.subscriber = subscriber;
        this.accumulator = accumulator;
        this.formatDisplay = formatDisplay;
    }

    initialize() {
        // Attach subscriber to the stat updates
        this.subscriber(this.updateStat.bind(this));

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

export function createStatistic<T, U>(
    ...params: ConstructorParameters<typeof Statistic<T, U>>
) {
    // If the statistic requires api methods which aren't available
    // on the user's OpenRCT2 version,
    // replace it with an unsupported statistic widget.
    const MIN_API_VERSION_ARG_INDEX = 3;
    if (context.apiVersion < params[MIN_API_VERSION_ARG_INDEX]) {
        return new UnsupportedStatistic(...params);
    } else {
        const stat = new Statistic(...params);
        stat.initialize();
        return stat;
    }
}
