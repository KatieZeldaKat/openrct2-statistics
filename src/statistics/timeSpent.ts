import { store } from "openrct2-flexui";
import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "timePassed";
const STATISTIC_TITLE = "Time Spent in";

type TimeSpendStat = number;

const timeSpentStore = store<TimeSpendStat>(0);

const subscribeToTimePassing = () => {
  context.setInterval(() => {
    // because of the ways that Stores work,
    // passing in the same value will not trigger a change event
    // so we need to pass in a new value each time, and not just 1 repeatedly
    // we're actually going to ignore the value in that store and just rely on it updating

    // console.log(`one second passed`);
    timeSpentStore.set(timeSpentStore.get() + 1);
  }, 1000);
};

// each time the hook is called, we want to add 1 to the existing time value
// the function expects that we'll do something with the new value and the existing value
// but in this case, we're just going to ignore the new value and just add 1 to the existing value
function accumulateSeconds(_newVal: TimeSpendStat, existingVal: TimeSpendStat) {
  return existingVal + 1;
}

export const timeSpentStatistic = () => {
  const key = STATISTIC_KEY;
  const title = STATISTIC_TITLE;
  const statStore = timeSpentStore;

  subscribeToTimePassing();

  return new Statistic({
    key,
    title,
    statStore,
    resetValue: 0,
    formatDisplay,
    accumulator: accumulateSeconds,
  });
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
