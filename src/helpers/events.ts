import { store } from "openrct2-flexui";

export const isInPark = store(context.mode == "normal");
export const parkName = store(park.name);


export function initialize()
{
    // isInPark
    context.subscribe("map.changed", () => isInPark.set(context.mode == "normal"));

    // parkName
    context.subscribe("map.changed", () => parkName.set(park.name));
    context.subscribe("action.execute", e => {
        if (e.action == "parksetname")
        {
            parkName.set(park.name);
        }
    });
}
