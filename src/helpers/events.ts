import { store } from "openrct2-flexui";

/**
 * Tracks if the player is currently playing a park/scenario.
 */
export const isInPark = store(context.mode == "normal");

/**
 * Tracks the name of the park the player is currently in. This can change even if a player is
 * not playing a park/scenario, but behavior is undefined in this case.
 */
export const parkName = store(park.name);

export function initialize() {
    // isInPark
    context.subscribe("map.changed", () => isInPark.set(context.mode == "normal"));

    // parkName
    context.subscribe("map.changed", () => parkName.set(park.name));
    context.subscribe("action.execute", (e) => {
        if (e.action == "parksetname") {
            parkName.set(park.name);
        }
    });
}
