// @ts-ignore
import * as info from "../info.js";
import { store } from "openrct2-flexui";
import { areStatisticsPaused } from "../window/windowPause";

const GAME_TIME_KEY = `${info.name}.time.gameTime`;
const PARK_TIME_KEY = `${info.name}.time.parkTime`;

// Time is stored in seconds
export const timeData = {
    gameTime: store(context.sharedStorage.get<number>(GAME_TIME_KEY, 0)),
    parkTime: store(context.mode == "normal" ? context.getParkStorage().get(PARK_TIME_KEY, 0) : 0),
}


export function initialize()
{
    timeData.gameTime.subscribe((newTime => context.sharedStorage.set(GAME_TIME_KEY, newTime)));
    timeData.parkTime.subscribe((newTime => context.getParkStorage().set(PARK_TIME_KEY, newTime)));

    context.setInterval(addSecondToTime, 1000);
    context.subscribe("map.changed", resetParkTime);
}


function addSecondToTime()
{
    if (areStatisticsPaused.get())
    {
        return;
    }

    let newGameTime = timeData.gameTime.get() + 1
    timeData.gameTime.set(newGameTime);

    if (context.mode == "normal")
    {
        let newParkTime = timeData.parkTime.get() + 1
        timeData.parkTime.set(newParkTime);
    }
}


function resetParkTime()
{
    if (context.mode == "normal")
    {
        timeData.parkTime.set(context.getParkStorage().get(PARK_TIME_KEY, 0));
    }
}
