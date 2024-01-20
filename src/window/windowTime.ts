import * as time from "../statistics/time";
import { WidgetCreator, FlexiblePosition, Parsed, ElementVisibility,
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
    const parkNameFormat = () => `"${park.name}" -`;

    let parkName = store(parkNameFormat());
    context.subscribe("map.changed", () => parkName.set(parkNameFormat()));
    context.subscribe("action.execute", e => {
        if (e.action == "parksetname")
        {
            parkName.set(parkNameFormat())
        }
    });

    let parkTime = store(formatTime(time.timeData.parkTime.get()));
    time.timeData.parkTime.subscribe(newTime => parkTime.set(formatTime(newTime)));

    let parkWidgetIsVisible = store<ElementVisibility>(getParkWidgetIsVisible());
    context.subscribe("map.changed", () => parkWidgetIsVisible.set(getParkWidgetIsVisible()));

    return horizontal([
        label({ text: parkName, visibility: parkWidgetIsVisible }),
        label({ text: parkTime, visibility: parkWidgetIsVisible }),
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
    if (minutes > 0)
    {
        result += `${ minutes < 10 ? '0' + minutes : minutes }m `;
    }
    result += `${ seconds < 10 ? '0' + seconds : seconds }s`;

    return result;
}


function getParkWidgetIsVisible(): ElementVisibility
{
    if (context.mode == "normal")
    {
        return "visible";
    }
    else
    {
        return "none";
    }
}
