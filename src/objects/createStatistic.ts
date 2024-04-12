import { Statistic } from "./Statistic";
import { UnsupportedStatistic } from "./UnsupportedStatistic";

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
