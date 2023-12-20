// @ts-ignore
import * as info from "../info.js";

const GAME_TIME_KEY = `${info.name}.time.gameTime`;
const PARK_TIME_KEY = `${info.name}.time.parkTime`;

// Time is stored in seconds
let gameTime = 0;
let parkTime = 0;


export function initialize()
{
    gameTime = context.sharedStorage.get<number>(GAME_TIME_KEY, 0);

    context.setInterval(addSecondToTime, 1000);
    context.subscribe("map.changed", resetParkTime);
}


function addSecondToTime()
{
    gameTime++;
    context.sharedStorage.set(GAME_TIME_KEY, gameTime);

    if (context.mode == "normal")
    {
        parkTime++;
        context.getParkStorage().set(PARK_TIME_KEY, parkTime);
    }
}


function resetParkTime()
{
    if (context.mode == "normal")
    {
        parkTime = context.getParkStorage().get(PARK_TIME_KEY, 0);
    }
}
