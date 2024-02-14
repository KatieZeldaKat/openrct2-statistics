import { timeData } from "../statistics/time";
import { createStatWidget } from "./createStatWidget";

export const getPlayTimeWidget = () =>
  createStatWidget({
    title: "Time Spent In",
    gameStatStore: timeData.gameTime,
    parkStatStore: timeData.parkTime,
    processStat: formatTime,
  });

function formatTime(totalSeconds: number): string {
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
