import * as time from "../statistics/time";
import { WidgetCreator, FlexiblePosition, Parsed,
         groupbox, horizontal, label, store } from "openrct2-flexui";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

let gameTimeString = store("");
let parkTimeString = store("");


export function getTimeWidget(): WidgetCreator<FlexiblePosition>
{
    const text = "Time Spent In";
    gameTimeString.set(formatTime(time.timeData.gameTime.get()));
    parkTimeString.set(formatTime(time.timeData.parkTime.get()));

    time.timeData.gameTime.subscribe(newTime => gameTimeString.set(formatTime(newTime)));
    time.timeData.parkTime.subscribe(newTime => parkTimeString.set(formatTime(newTime)));

    if (context.mode == "normal")
    {
        return groupbox({
            text: text,
            content: [
                ...getNonParkContent(),
                getParkContent(),
            ],
        });
    }

    return groupbox({
        text: text,
        content: getNonParkContent(),
    });
}


function getParkContent(): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>
{
    return horizontal([
        label({ text: `"${park.name}" -` }),
        label({ text: parkTimeString }),
    ]);
}


function getNonParkContent(): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>[]
{
    return [
        horizontal([
            label({ text: "OpenRCT2 - " }),
            label({ text: gameTimeString }),
        ]),
    ];
}


function formatTime(seconds: number): string
{
    let result = "";
    let hours = Math.floor(seconds / SECONDS_IN_HOUR);
    let minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    seconds %= SECONDS_IN_MINUTE;

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
