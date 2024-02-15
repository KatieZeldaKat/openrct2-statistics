import { store } from "openrct2-flexui";
import { Statistic } from "../objects/Statistic";

// used for saving/loading the values
const STATISTIC_KEY = "ridesBuilt";
// used for displaying the statistic
const STATISTIC_TITLE = "Rides Built";

// creating a type for the statistic helps me keep track of what the store is supposed to hold
// and with the accumulator function
type RideStat = {
  rideId: number;
  rideType: number;
  rideObject: number;
};

// the store that will hold the value of the statistic
// initialized with a default value
const newBuiltRide = store<RideStat>({
  rideId: -1,
  rideType: -1,
  rideObject: -1,
});

// function that tracks when the important event happens that we want to track
// this function will subscribe to the hook when a ride is built
// after doing some data processing, set the value of the store to the new value
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
        // can print the event if you want to see the flags and other data
        console.log(`Ride built: ${JSON.stringify(event)}`);

        // set the value of the store to the new ride
        newBuiltRide.set({
          rideId: event.result.ride,
          rideType: event.args.rideType,
          rideObject: event.args.rideObject,
        });
      }
    }
  });
};

// function showing how to accumulate the new value into the existing value
// in this case, we're just adding the new ride to the list of rides
// in other cases, you might add the new value to the existing value
// or set the keys/values in an object or map
function accumulateNewRide(newRide: RideStat, existingRides: RideStat[]) {
  // check if the last ride is the same as the new ride
  // if it is, then don't add it to the list

  if (existingRides.length === 0) {
    return [newRide];
  } else {
    const lastRide = existingRides[existingRides.length - 1];
    if (
      lastRide.rideId == newRide.rideId &&
      lastRide.rideType == newRide.rideType
    ) {
      return existingRides;
    }
  }
  return [...existingRides, newRide];
}

// function that creates the Statistic object and which is exported
export const ridesBuiltStatistic = () => {
  const key = STATISTIC_KEY;
  const title = STATISTIC_TITLE;
  // the store that holds the value of the newest occurrence of the event
  const statStore = newBuiltRide;

  // call the function that subscribes to the hook
  subscribeToRideBuiltHook();

  // create the Statistic object and return it
  return new Statistic({
    key,
    title,
    statStore,
    resetValue: [],
    formatDisplay,
    accumulator: accumulateNewRide,
  });
};

// function that formats the value of the statistic for display
// in this case, it's just the number of rides built
// but I could see it being reformatted to show the names of the rides built or something else
// and displayed in a different widget
function formatDisplay(ridesBuilt: RideStat[]): string {
  const numberOfRides = Object.keys(ridesBuilt).length;
  return `${numberOfRides}`;
}
