import { store } from "openrct2-flexui";
import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "vehiclesCrashed";
const STATISTIC_TITLE = "Vehicle Crashes";

// i thought it would be interesting to track the date and time of the crash
// it could potentially be diplayed in a different widget format
type VehicleCrashStat = VehicleCrashArgs & {
  dateTime: Date;
};

const crashedVehicleStore = store<VehicleCrashStat>({
  id: -1,
  crashIntoType: "land",
  dateTime: new Date(),
});

const subscribeToVehicleCrashesHook = () => {
  context.subscribe("vehicle.crash", (e) => {
    crashedVehicleStore.set({
      id: e.id,
      crashIntoType: e.crashIntoType,
      dateTime: new Date(),
    });
  });
};

// when a new crash happens, we want to add it to the list of crashes
function accumulateNewCrashedVehicle(
  newCrash: VehicleCrashStat,
  existingVehiclesCrashed: VehicleCrashStat[]
) {
  return [...existingVehiclesCrashed, newCrash];
}

export const vehiclesCrashedStatistic = () => {
  const key = STATISTIC_KEY;
  const title = STATISTIC_TITLE;
  const statStore = crashedVehicleStore;

  subscribeToVehicleCrashesHook();

  return new Statistic({
    key,
    title,
    statStore,
    resetValue: [],
    formatDisplay,
    accumulator: accumulateNewCrashedVehicle,
  });
};

function formatDisplay(ridesBuilt: VehicleCrashStat[]): string {
  const numberOfCrashedVehicles = Object.keys(ridesBuilt).length;
  return `${numberOfCrashedVehicles}`;
}
