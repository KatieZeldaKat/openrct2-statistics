import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "timePassed";
const STATISTIC_TITLE = "Time Spent in";

type TimeSpendStat = number;

// A tad unwieldy, but we need to create a function that will be called whenever the statistic is updated
// This function will be called every second, and will add 1 (for one second) to the existing time value
const subscribeToTimePassing = (
  // Create a callback function inside the main subscription function
  // This callback function will be called in partnership with the accumulator function to update the stat value
  updatedValueCallback: (addedTime: TimeSpendStat) => void
) => {
  // The hook in this case is time-based, so we want to call the callback function every second
  context.setInterval(() => {
    // In other widgets, we would probably use the value from this hook, but in this case we're just adding 1
    updatedValueCallback(1);
  }, 1000);
};

// each time the hook is called, we want to add to the existing time value
// in this case, we know that the newVal will always be 1 since we're putting a static value in the updatedValueCallback
// so we could replce the newVal with 1
function accumulateSeconds(newVal: TimeSpendStat, existingVal: TimeSpendStat) {
  return existingVal + newVal;
}

export const timeSpentStatistic = () => {
  const key = STATISTIC_KEY;
  const title = STATISTIC_TITLE;

  const statistic = new Statistic({
    key,
    title,
    resetValue: 0,
    formatDisplay,
    subscriber: subscribeToTimePassing,
    accumulator: accumulateSeconds,
  });

  // LEGACY SUPPORT FOR TRACKING TIME IN-GAME
  const legacyGameTimeKey = "openrct2-statistics.time.gameTime";
  if (
    // unfortunately there's no way to get rid of a key,
    // so needing to check if it exists and if it has a value every time
    context.sharedStorage.get(legacyGameTimeKey) != null
  ) {
    // To prevent a conflict when importing the shared storage, wait a second beforehand
    context.setTimeout(() => {
      let legacyTime = context.sharedStorage.get(legacyGameTimeKey) as number;
      if (legacyTime >= 0) {
        statistic.gameStatStore.set(legacyTime + 1);
        // Prevent legacy value from being imported more than once
        context.sharedStorage.set(legacyGameTimeKey, undefined);
      }
    }, 1000);
  }
  // LEGACY SUPPORT FOR TRACKING TIME IN PARKS
  context.subscribe("map.changed", () => {
    const legacyParkTimeKey = "openrct2-statistics.time.parkTime";
    if (
      context.mode == "normal" &&
      // unfortunately there's no way to get rid of a key,
      // check if the legacy key exists and has a value
      context.getParkStorage().get(legacyParkTimeKey) != null
    ) {
      // To prevent a conflict when importing the park storage, wait a second beforehand
      context.setTimeout(() => {
        let legacyTime = context
          .getParkStorage()
          .get(legacyParkTimeKey) as number;
        if (legacyTime >= 0) {
          statistic.parkStatStore.set(legacyTime + 1);
          // Prevent legacy value from being imported more than once
          context.getParkStorage().set(legacyParkTimeKey, undefined);
        }
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
  let minutes = Math.floor(
    (totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
  );
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
