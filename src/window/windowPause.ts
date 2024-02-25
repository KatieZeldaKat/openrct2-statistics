// @ts-ignore
import * as info from "../info.js";
import {
    WidgetCreator,
    FlexiblePosition,
    groupbox,
    store,
    horizontal,
    label,
    compute,
    button,
} from "openrct2-flexui";

const STATS_PAUSED_KEY = `${info.name}.paused`;
const FLAG_OPEN_ICON = 5180;
const FLAG_CLOSED_ICON = 5179;

/**
 * If true, all statistics should refrain from being tracked.
 */
export const areStatisticsPaused = store(context.sharedStorage.get(STATS_PAUSED_KEY, false));

export function getPausedWidget(): WidgetCreator<FlexiblePosition> {
    areStatisticsPaused.subscribe((paused) =>
        context.sharedStorage.set(STATS_PAUSED_KEY, paused),
    );

    return groupbox({
        text: "Pause Statistics",
        content: [
            horizontal([
                button({
                    width: "25px",
                    height: "25px",
                    image: compute(areStatisticsPaused, (paused) => getButtonIcon(paused)),
                    onClick: () => areStatisticsPaused.set(!areStatisticsPaused.get()),
                }),
                label({
                    text: compute(areStatisticsPaused, (paused) => getPausedText(paused)),
                    padding: "6px",
                }),
            ]),
        ],
    });
}

function getButtonIcon(isPaused: boolean) {
    return isPaused ? FLAG_CLOSED_ICON : FLAG_OPEN_ICON;
}

function getPausedText(isPaused: boolean) {
    return isPaused ? "{LIGHTPINK}Statistics are paused." : "Statistics are running.";
}
