import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "timeSpent";
const STATISTIC_TITLE = "Time Spent in";

type TimeSpentStat = number;

// A tad unwieldy, but we need to create a function that will be called whenever the statistic is
// updated. This function will be called every second, and will add 1 (for one second) to the
// existing time value.
const subscribeToTimePassing = (
    // Create a callback function inside the main subscription function which will be called
    // in partnership with the accumulator function to update the stat value
    updatedValueCallback: (addedTime: TimeSpentStat) => void,
) => {
    // The hook in this case is time-based, so we want to call the callback function every second
    context.setInterval(() => {
        // In other widgets, we would probably use the value from this hook,
        // but in this case we're just adding 1
        updatedValueCallback(1);
    }, 1000);
};

// Each time the hook is called, we want to add to the existing time value
function accumulateSeconds(newVal: TimeSpentStat, existingVal: TimeSpentStat) {
    return existingVal + newVal;
}

export const timeSpentStatistic = () => {
    const key = STATISTIC_KEY;
    const title = STATISTIC_TITLE;
    const resetValue = 0;
    const minApiVersion = 0; // This statistic is supported in all versions

    const statistic = Statistic.create({
        key,
        title,
        resetValue,
        minimumApiVersion: minApiVersion,
        subscriber: subscribeToTimePassing,
        accumulator: accumulateSeconds,
        formatDisplay,
    });

    // LEGACY SUPPORT FOR TRACKING TIME IN-GAME
    const legacyGameTimeKey = "openrct2-statistics.time.gameTime";
    if (context.sharedStorage.has(legacyGameTimeKey)) {
        // To prevent a conflict when importing the shared storage, wait a second beforehand
        context.setTimeout(() => {
            let legacyTime = context.sharedStorage.get(legacyGameTimeKey) as number;
            statistic.gameStatStore.set(legacyTime + 1);
            // Prevent legacy value from being imported more than once
            // Setting to undefined will delete the key from storage
            context.sharedStorage.set(legacyGameTimeKey, undefined);
        }, 1000);
    }

    // LEGACY SUPPORT FOR TRACKING TIME IN PARKS
    context.subscribe("map.changed", () => {
        const legacyParkTimeKey = "openrct2-statistics.time.parkTime";
        if (context.mode == "normal" && context.getParkStorage().has(legacyParkTimeKey)) {
            // To prevent a conflict when importing the park storage, wait a second beforehand
            context.setTimeout(() => {
                let legacyTime = context.getParkStorage().get(legacyParkTimeKey) as number;
                statistic.parkStatStore.set(legacyTime + 1);
                // Prevent legacy value from being imported more than once
                // Setting to undefined will delete the key from storage
                context.getParkStorage().set(legacyParkTimeKey, undefined);
            }, 1000);
        }
    });

    return statistic;
};

function formatDisplay(totalSeconds: number): string {
    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 3600;

    let result = "";
    let hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
    let minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    let seconds = totalSeconds % SECONDS_IN_MINUTE;

    if (hours > 0) {
        result += `${hours}h `;
    }
    if (hours > 0 || minutes > 0) {
        result += `${minutes < 10 ? "0" + minutes : minutes}m `;
    }
    result += `${seconds < 10 ? "0" + seconds : seconds}s`;

    return result;
}
