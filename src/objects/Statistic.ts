// @ts-ignore
import * as info from "../info.js";
import { createStatWidget } from "../window/createStatWidget.js";
import { areStatisticsPaused } from "./../window/windowPause";
import { WritableStore, store } from "openrct2-flexui";

export class Statistic<T, U> {
  statKey!: string;

  statName!: string;

  statValueStore!: WritableStore<T>;

  gameStatStore!: WritableStore<U>;

  parkStatStore!: WritableStore<U>;

  isPaused = false;

  resetValue!: U;

  accumulator: (oldValue: T, newValue: U) => U;

  formatDisplay!: (value: U) => string;

  get widget() {
    return createStatWidget({
      title: this.statName,
      gameStatStore: this.gameStatStore,
      parkStatStore: this.parkStatStore,
      processStat: this.formatDisplay,
    });
  }

  constructor(props: {
    key: string;
    title: string;
    statStore: WritableStore<T>;
    resetValue: U;
    formatDisplay: (value: U) => string;
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

    areStatisticsPaused.subscribe((isPaused) => (this.isPaused = isPaused));

    if (context.mode == "normal") {
      context.subscribe("map.changed", this.resetParkStat);
    }
  }

  initialize() {
    this.initializeGameStatStore();
    this.initializeParkStatStore();

    this.statValueStore.subscribe((newValue) => {
      if (this.isPaused) {
        return;
      }
      const oldValue = this.gameStatStore.get();
      const newGameStoreValue = this.accumulator(newValue, oldValue);
      this.gameStatStore.set(newGameStoreValue);

      const parkOldValue = this.parkStatStore.get();
      const newParkStoreValue = this.accumulator(newValue, parkOldValue);
      this.parkStatStore.set(newParkStoreValue);
    });
  }

  pauseCalculations() {
    console.log(`disposing of subscription for ${this.statName}`);
    this.isPaused = true;
  }

  startCalculations() {
    this.isPaused;
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

  initializeGameStatStore() {
    const gameStatKey = `${info.name}.${this.statKey}.gameValue`;
    this.gameStatStore = store(
      context.sharedStorage.get(gameStatKey, this.resetValue)
    );
    this.gameStatStore.subscribe((newValue) => {
      context.sharedStorage.set(gameStatKey, newValue);
    });
  }

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
