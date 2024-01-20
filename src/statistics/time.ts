// @ts-ignore
import * as info from "../info.js";
import { store } from "openrct2-flexui";
import { areStatisticsPaused } from "../window/windowPause";

const GAME_TIME_KEY = `${info.name}.time.gameTime`;
const PARK_TIME_KEY = `${info.name}.time.parkTime`;

// Time is stored in seconds
export const timeData = {
    gameTime: store(context.sharedStorage.get(GAME_TIME_KEY, 0)),
    parkTime: store(context.mode == "normal" ? context.getParkStorage().get(PARK_TIME_KEY, 0) : 0),
}

let secondIntervalHandle: number;


export function initialize()
{
    timeData.gameTime.subscribe(newTime => context.sharedStorage.set(GAME_TIME_KEY, newTime));
    timeData.parkTime.subscribe(newTime => context.getParkStorage().set(PARK_TIME_KEY, newTime));
    areStatisticsPaused.subscribe(toggleInterval);
    context.subscribe("map.changed", resetParkTime);

    if (!areStatisticsPaused.get())
    {
        toggleInterval(false);
    }
}


function addSecondToTime()
{
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


function toggleInterval(isPaused: boolean)
{
    if (isPaused)
    {
        context.clearInterval(secondIntervalHandle);
    }
    else
    {
        secondIntervalHandle = context.setInterval(addSecondToTime, 1000);
    }
}
