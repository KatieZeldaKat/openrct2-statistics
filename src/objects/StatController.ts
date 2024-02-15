import { Statistic } from "./Statistic";

export class StatController {
  statistics: Statistic<any, any>[] = [];

  get widgets() {
    return this.statistics.map((stat) => stat.widget);
  }

  add(stat: Statistic<any, any>) {
    this.statistics.push(stat);
  }

  resetGameStatistics() {
    this.statistics.forEach((stat) => {
      stat.gameStatStore.set(stat.resetValue);
    });
  }

  resetParkStatistics() {
    this.statistics.forEach((stat) => {
      stat.parkStatStore.set(stat.resetValue);
    });
  }
}
