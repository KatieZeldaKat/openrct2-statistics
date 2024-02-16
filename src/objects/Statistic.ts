// @ts-ignore
import * as info from "../info.js";
import { createStatWidget } from "../window/createStatWidget";
import { areStatisticsPaused } from "./../window/windowPause";
import { WritableStore, store } from "openrct2-flexui";

export class Statistic<T, U> {
  /** The save/load key */
  statKey!: string;

  /** The display name on the widget*/
  statName!: string;

  /** The store that holds the value of the most recent stat */
  statValueStore!: WritableStore<T>;

  /** The store that holds the value of the game stat */
  gameStatStore!: WritableStore<U>;

  /** The store that holds the value of the park stat */
  parkStatStore!: WritableStore<U>;

  isPaused = false;

  /** The value when resetting the game stat. Should be an empty-ish value,
   * e.g. 0, "", [], etc.
   */
  resetValue!: U;

  /** The function that accumulates the new value into the existing value */
  accumulator: (newValue: T, existingValues: U) => U;

  /** The function that formats the value for display */
  formatDisplay!: (value: U) => string;

  /** The widget that displays the stat */
  get widget() {
    return createStatWidget({
      title: this.statName,
      gameStatStore: this.gameStatStore,
      parkStatStore: this.parkStatStore,
      processStat: this.formatDisplay,
    });
  }

  constructor(props: {
    /** The save/load key */
    key: string;

    /** The display name on the widget*/
    title: string;

    /** The store that holds the value of the most recent stat */
    statStore: WritableStore<T>;

    /** The value when resetting the game stat. Should be an empty-ish value,
     * e.g. 0, "", [], etc.
     */
    resetValue: U;

    /** The function that formats the value for display */
    formatDisplay: (value: U) => string;

    /** The function that accumulates the new value into the existing value.
     * Could concatenate by adding, or spreading into a new array, etc.
     * 
     * @example 
     * function accumulateNewRide(newRide: RideStat, existingRides: RideStat[]) {
          return [...existingRides, newRide];
        }
     */
    accumulator: (newValue: T, oldValue: U) => U;
  }) {
    const { key, title, statStore, resetValue, formatDisplay, accumulator } =
      props;

    this.statKey = key;
    this.statName = title;
    this.resetValue = resetValue;
    this.statValueStore = statStore;
    this.formatDisplay = formatDisplay;
    this.accumulator = accumulator;

    this.initialize();
  }

  initialize() {
    this.initializeGameStatStore();
    this.initializeParkStatStore();

    // Subscribe to the pause event
    areStatisticsPaused.subscribe((isPaused) => (this.isPaused = isPaused));

    if (context.mode == "normal") {
      context.subscribe("map.changed", () => {
        this.resetParkStat();
      });
    }

    // whenever the stat value changes, update the game and park stat stores
    this.statValueStore.subscribe((newValue) => {
      if (this.isPaused) {
        return;
      }
      const oldValue = this.gameStatStore.get();
      // run the new value through the accumulator function
      const newGameStoreValue = this.accumulator(newValue, oldValue);
      this.gameStatStore.set(newGameStoreValue);

      const parkOldValue = this.parkStatStore.get();
      // run the new value through the accumulator function
      const newParkStoreValue = this.accumulator(newValue, parkOldValue);
      this.parkStatStore.set(newParkStoreValue);
    });
  }

  resetGameStat() {
    this.gameStatStore.set(this.resetValue);
  }

  resetParkStat() {
    this.parkStatStore.set(this.resetValue);
  }

  toggleStatRecordingPause(isPaused: boolean) {
    this.isPaused = isPaused;
  }

  /**
   * Initializes the game stat store. Stores the values across all parks and play sessions
   */
  initializeGameStatStore() {
    const gameStatKey = `${info.name}.${this.statKey}.gameValue`;
    this.gameStatStore = store(
      context.sharedStorage.get(gameStatKey, this.resetValue)
    );
    this.gameStatStore.subscribe((newValue) => {
      context.sharedStorage.set(gameStatKey, newValue);
    });
  }

  /**
   * Initializes the park stat store.
   * Stores the values for the current park, and is preserved across saves and loads
   */
  initializeParkStatStore() {
    const parkStatKey = `${info.name}.${this.statKey}.parkValue`;
    this.parkStatStore = store(
      context.mode == "normal"
        ? context.getParkStorage().get(parkStatKey, this.resetValue)
        : this.resetValue
    );
    this.parkStatStore.subscribe((newValue) => {
      if (context.mode == "normal") {
        context.getParkStorage().set(parkStatKey, newValue);
      }
    });
  }
}
