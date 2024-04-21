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
    vertical,
} from "openrct2-flexui";
import { getGameVersionFromApiVersion } from "../helpers/apiToGameReleaseVersionMap";

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

/**
 * Creates a widget that displays a message that the stat is unsupported.
 */
export function createUnsupportedStatWidget(params: {
    /** The title of your widget which will display in the box. */
    title: string;
    /** The api version required (which will be greater than what the player is using). */
    minimumApiVersion: number;
}): WidgetCreator<FlexiblePosition> {
    const { title, minimumApiVersion } = params;
    // returns undefined if the api version isn't yet supported
    const gameVersion = getGameVersionFromApiVersion(minimumApiVersion);

    const versionText = gameVersion
        ? `This stat requires OpenRCT {RED}version ${gameVersion}\n{WHITE}or higher.`
        : `This stat requires the {RED}latest development \nbuild{WHITE} version.`;

    return groupbox({
        text: title,
        content: [
            vertical([
                label({ text: "-+- Unable to calculate statistic. -+-" }),
                label({
                    text: versionText,
                    padding: { bottom: 10 },
                }),
            ]),
        ],
    });
}
