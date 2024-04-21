// @ts-ignore
import * as info from "../info.js";
import { createStatWidget, createUnsupportedStatWidget } from "../window/createWidget.js";
import { areStatisticsPaused } from "./../window/windowPause";
import { WritableStore, store } from "openrct2-flexui";

interface BaseStatistic<T, U> {
    /** The save/load key. */
    statKey: string;

    /** The display name on the widget. */
    statName: string;

    /** The value when resetting the stat. */
    resetValue: U;

    /**
     * The required API version for the stat to be supported.
     * If the player's version is lower than this, the stat will not be supported.
     * Compare to {@link PluginMetadata.minApiVersion}, specifically for this statistic.
     * If the statistic will run on any version of OpenRCT2, set this to `0`.
     */
    minimumApiVersion: number;

    /** The function that allows subscribing to updates of the statistic value. */
    subscriber: (updateStat: (newValue: T) => void) => void;

    /** The function that accumulates the new value into the existing value. */
    accumulator: (newValue: T, existingValues: U) => U;

    /** The function that formats the value for display. */
    formatDisplay: (value: U) => string;
}

export class Statistic<T, U> implements BaseStatistic<T, U> {
    statKey: string;
    statName: string;

    gameStatStore!: WritableStore<U>;
    parkStatStore!: WritableStore<U>;

    resetValue: U;
    minimumApiVersion: number;

    subscriber: (updateStat: (newValue: T) => void) => void;
    accumulator: (newValue: T, existingValues: U) => U;
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

    /**
     * Don't use this constructor directly; use `create` instead.
     */
    constructor(params: BaseStatistic<T, U>) {
        this.statKey = params.statKey;
        this.statName = params.statName;
        this.resetValue = params.resetValue;
        this.minimumApiVersion = params.minimumApiVersion;
        this.subscriber = params.subscriber;
        this.accumulator = params.accumulator;
        this.formatDisplay = params.formatDisplay;
    }

    /**
     * Use to create a new statistic instead of the constructor.
     * Handles checking if the API version is supported and initializes the stat.
     */
    static create<T, U>(params: BaseStatistic<T, U>) {
        if (context.apiVersion < params.minimumApiVersion) {
            return new UnsupportedStatistic(params);
        } else {
            const stat = new Statistic(params);
            stat.initialize();
            return stat;
        }
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

/**
 * A placeholder for a statistic that is not supported by the player's current version of OpenRCT2.
 * Displays a message in the widget stating the required version.
 */
export class UnsupportedStatistic<T, U> extends Statistic<T, U> {
    constructor(statisticParams: BaseStatistic<T, U>) {
        super(statisticParams);
    }

    override get widget() {
        return createUnsupportedStatWidget({
            title: this.statName,
            minimumApiVersion: this.minimumApiVersion,
        });
    }
}
