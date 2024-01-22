import * as events from "../helpers/events";
import * as time from "../statistics/time";
import { getElementVisibility } from "../helpers/flexHelper";
import { WidgetCreator, FlexiblePosition, Parsed,
         groupbox, horizontal, label, store} from "openrct2-flexui";


export function getTimeWidget(): WidgetCreator<FlexiblePosition>
{
    return groupbox({
        text: "Time Spent In",
        content: [
            getGameTimeWidget(),
            getParkTimeWidget(),
        ],
    });
}


function getGameTimeWidget(): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>
{
    let gameTime = store(formatTime(time.timeData.gameTime.get()));
    time.timeData.gameTime.subscribe(newTime => gameTime.set(formatTime(newTime)));

    return horizontal([
        label({ text: "OpenRCT2 -" }),
        label({ text: gameTime }),
    ]);
}


function getParkTimeWidget(): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>
{
    const parkNameFormat = (name: string) => `"${name}" -`;
    let parkName = store(parkNameFormat(events.parkName.get()));
    events.parkName.subscribe(newName => parkName.set(parkNameFormat(newName)));

    let parkTime = store(formatTime(time.timeData.parkTime.get()));
    time.timeData.parkTime.subscribe(newTime => parkTime.set(formatTime(newTime)));

    let isVisible = store(getElementVisibility(events.isInPark.get()));
    events.isInPark.subscribe(inPark => isVisible.set(getElementVisibility(inPark)));

    return horizontal([
        label({ text: parkName, visibility: isVisible }),
        label({ text: parkTime, visibility: isVisible }),
    ]);
}


function formatTime(totalSeconds: number): string
{
    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 3600;

    let result = "";
    let hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
    let minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    let seconds = totalSeconds % SECONDS_IN_MINUTE;

    if (hours > 0)
    {
        result += `${hours}h `;
    }
    if (hours > 0 || minutes > 0)
    {
        result += `${ minutes < 10 ? '0' + minutes : minutes }m `;
    }
    result += `${ seconds < 10 ? '0' + seconds : seconds }s`;

    return result;
}
