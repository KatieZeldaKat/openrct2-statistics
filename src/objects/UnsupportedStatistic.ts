import { createUnsupportedStatWidget } from "../window/createUnsupportedStatWidget";
import { Statistic } from "./Statistic";

export class UnsupportedStatistic extends Statistic<any, any> {
    constructor(statistic: Statistic<any, any>) {
        super(
            statistic.statKey,
            statistic.statName,
            statistic.resetValue,
            statistic.minimumApiVersion,
            () => {},
            () => {},
            () => "",
        );
    }

    override get widget() {
        return createUnsupportedStatWidget({
            title: this.statName,
            minimumApiVersion: this.minimumApiVersion,
        });
    }
}
