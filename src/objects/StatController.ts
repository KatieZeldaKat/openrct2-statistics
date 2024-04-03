import { Statistic } from "./Statistic";
import { UnsupportedStatistic } from "./UnsupportedStatistic";

/**
 * Represents a controller for managing statistics.
 */
export class StatController {
    private statistics: Statistic<any, any>[] = [];

    /**
     * Gets an array of widgets associated with the statistics.
     */
    get widgets() {
        return this.statistics.map((stat) => stat.widget);
    }

    /**
     * Adds a statistic to the controller.
     * @param stat The statistic to add.
     * @returns The updated StatController instance.
     */
    add(stat: Statistic<any, any>) {
        // If the statistic requires api methods which aren't available
        // on the user's OpenRCT2 version,
        // replace it with an unsupported statistic widget.
        if (context.apiVersion < stat.minimumApiVersion) {
            this.statistics.push(new UnsupportedStatistic(stat));
        } else {
            this.statistics.push(stat);
        }
        return this;
    }

    /**
     * Resets the game statistics by setting their values to the reset value.
     */
    resetGameStatistics() {
        this.statistics.forEach((stat) => {
            stat.gameStatStore.set(stat.resetValue);
        });
    }

    /**
     * Resets the park statistics by setting their values to the reset value.
     */
    resetParkStatistics() {
        this.statistics.forEach((stat) => {
            stat.parkStatStore.set(stat.resetValue);
        });
    }
}
