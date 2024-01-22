// @ts-ignore
import * as info from "../info.js";
import { WidgetCreator, FlexiblePosition,
         groupbox, store, horizontal, button, label } from "openrct2-flexui";

const STATS_PAUSED_KEY = `${info.name}.paused`;
const FLAG_OPEN_ICON = 5180;
const FLAG_CLOSED_ICON = 5179;

/**
 * If true, all statistics should refrain from being tracked.
 */
export const areStatisticsPaused = store(context.sharedStorage.get(STATS_PAUSED_KEY, false));

let buttonIcon = store(getButtonIcon());
let pausedText = store(getPausedText());


export function getPausedWidget(): WidgetCreator<FlexiblePosition>
{
    areStatisticsPaused.subscribe((_) => buttonIcon.set(getButtonIcon()));
    areStatisticsPaused.subscribe((_) => pausedText.set(getPausedText()));
    areStatisticsPaused.subscribe(paused => context.sharedStorage.set(STATS_PAUSED_KEY, paused));

    return groupbox({
        text: "Pause Statistics",
        content: [
            horizontal([
                button({
                    image: buttonIcon,
                    width: "25px",
                    height: "25px",
                    onClick: () => areStatisticsPaused.set(!areStatisticsPaused.get()),
                }),
                label({ text: pausedText, padding: "6px" }),
            ]),
        ],
    });
}


function getButtonIcon()
{
    if (areStatisticsPaused.get())
    {
        return FLAG_CLOSED_ICON;
    }

    return FLAG_OPEN_ICON;
}


function getPausedText()
{
    if (areStatisticsPaused.get())
    {
        return "{LIGHTPINK}Statistics are paused.";
    }

    return "Statistics are running.";
}
