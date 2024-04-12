import { createUnsupportedStatWidget } from "../window/createUnsupportedStatWidget";
import { Statistic } from "./Statistic";

export class UnsupportedStatistic<T, U> extends Statistic<T, U> {
    constructor(...statisticParams: ConstructorParameters<typeof Statistic<T, U>>) {
        super(...statisticParams);
    }

    override get widget() {
        return createUnsupportedStatWidget({
            title: this.statName,
            minimumApiVersion: this.minimumApiVersion,
        });
    }
}
