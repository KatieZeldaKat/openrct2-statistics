import { store } from "openrct2-flexui";
import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "ridesBuilt";
const STATISTIC_TITLE = "Rides Built";

type RideStat = {
  rideId: number;
  rideType: number;
  rideObject: number;
};

const newBuiltRide = store<RideStat>({
  rideId: -1,
  rideType: -1,
  rideObject: -1,
});

const subscribeToRideBuiltHook = () => {
  context.subscribe("action.execute", (e) => {
    // the event is very poorly typed, so having to cast it to the correct type
    const event = e as unknown as {
      action: ActionType;
      args: { flags: number; rideType: number; rideObject: number };
      result: { ride: number };
    };
    if (event.action == "ridecreate") {
      // if the event's flags are greater than zero, it means they weren't actually executed and should be ignored
      // sometimes the flags are overflowing to -2147483648, so we need to check for <= 0
      if (event.args.flags <= 0) {
        console.log(`Ride built: ${JSON.stringify(event)}`);
        newBuiltRide.set({
          rideId: event.result.ride,
          rideType: event.args.rideType,
          rideObject: event.args.rideObject,
        });
      }
    }
    return;
  });
  return { newBuiltRide };
};

function accumulateNewRide(newRide: RideStat, existingRides: RideStat[]) {
  return [...existingRides, newRide];
}

export const ridesBuiltStatistic = () => {
  const key = STATISTIC_KEY;
  const title = STATISTIC_TITLE;
  const statStore = newBuiltRide;

  subscribeToRideBuiltHook();

  return new Statistic({
    key,
    title,
    statStore,
    resetValue: [],
    formatDisplay,
    accumulator: accumulateNewRide,
  });
};

function formatDisplay(ridesBuilt: RideStat[]): string {
  const numberOfRides = Object.keys(ridesBuilt).length;
  return `${numberOfRides}`;
}
