import * as events from "../helpers/events";
import { getElementVisibility } from "../helpers/flexHelper";
import {
    WidgetCreator,
    FlexiblePosition,
    Store,
    groupbox,
    horizontal,
    label,
    compute,
} from "openrct2-flexui";

/**
 * Creates a stat widget with the given properties.
 */
export function createStatWidget<T>(params: {
    /** The title of your widget which will display in the box. */
    title: string;

    /** The store with total game stat values. */
    gameStatStore: Store<T>;

    /** The store with this park stat values. */
    parkStatStore: Store<T>;

    /**
     * Function to process the stat value,
     * e.g. to process time in seconds into nice human-readable text
     * or to take the take the length of an array instead of its values. */
    formatDisplay: (stat: T) => string;
}): WidgetCreator<FlexiblePosition> {
    const { title, gameStatStore, parkStatStore, formatDisplay } = params;

    return groupbox({
        text: title,
        content: [
            getGameStatWidget(gameStatStore, formatDisplay),
            getParkStatWidget(parkStatStore, formatDisplay),
        ],
    });
}

function getGameStatWidget<T>(statStore: Store<T>, processStat: (stat: T) => string) {
    return horizontal([
        label({ text: "OpenRCT2 -" }),
        label({
            // Compute lets you use a store's value to create a new value
            text: compute(statStore, (value) => processStat(value)),
        }),
    ]);
}

function getParkStatWidget<T>(statStore: Store<T>, processStat: (stat: T) => string) {
    const parkNameFormat = (name: string) => `"${name}" -`;
    const isVisible = compute(events.isInPark, (isInPark) => getElementVisibility(isInPark));

    return horizontal([
        label({
            text: compute(events.parkName, (name) => parkNameFormat(name)),
            visibility: isVisible,
        }),
        label({
            text: compute(statStore, (value) => processStat(value)),
            visibility: isVisible,
        }),
    ]);
}
