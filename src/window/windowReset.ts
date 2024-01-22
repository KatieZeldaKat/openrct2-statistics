import * as events from "../helpers/events";
import * as time from "../statistics/time";
import { openWarningWindow } from "./windowWarning";
import { getElementVisibility } from "../helpers/flexHelper";
import { WidgetCreator, FlexiblePosition,
         groupbox, store, horizontal, button, label } from "openrct2-flexui";


export function getResetWidget(): WidgetCreator<FlexiblePosition>
{
    const parkNameFormat = (name: string) => `Reset Statistics for "${name}"`;
    let parkName = store(parkNameFormat(events.parkName.get()));
    events.parkName.subscribe(newName => parkName.set(parkNameFormat(newName)));

    let isParkWidgetVisible = store(getElementVisibility(events.isInPark.get()));
    events.isInPark.subscribe(inPark => isParkWidgetVisible.set(getElementVisibility(inPark)));

    return groupbox({
        text: "Reset Statistics",
        content: [
            horizontal([
                button({
                    image: "reload",
                    width: "25px",
                    height: "25px",
                    onClick: resetGenericStatistics,
                }),
                label({ text: "Reset OpenRCT2 Statistics", padding: "6px" }),
            ]),
            horizontal([
                button({
                    image: "reload",
                    width: "25px",
                    height: "25px",
                    visibility: isParkWidgetVisible,
                    onClick: resetParkStatistics,
                }),
                label({ text: parkName, padding: "6px", visibility: isParkWidgetVisible }),
            ]),
        ],
    });
}


function resetGenericStatistics()
{
    openWarningWindow("reset cumulative statistics?", time.resetGenericTime);
}


function resetParkStatistics()
{
    openWarningWindow("reset park statistics?", time.resetParkTime);
}
