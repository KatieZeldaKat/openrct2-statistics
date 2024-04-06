import { WidgetCreator, FlexiblePosition, groupbox, label, vertical } from "openrct2-flexui";
import { getGameVersionFromApiVersion } from "../helpers/apiToGameReleaseVersionMap";

/**
 * Creates a stat widget with the given properties.
 */
export function createUnsupportedStatWidget(params: {
    /** The title of your widget which will display in the box. */
    title: string;
    /** The api version required (which will be greater than what the player is using for this with). */
    minimumApiVersion: number;
}): WidgetCreator<FlexiblePosition> {
    const { title, minimumApiVersion } = params;
    const gameVersion = getGameVersionFromApiVersion(minimumApiVersion);

    return groupbox({
        text: title,
        content: [
            vertical({
                content: [
                    label({ text: "-+- Unable to calculate statistic. -+-" }),
                    label({
                        text: `This stat requires OpenRCT {RED}version ${gameVersion}\n{WHITE}or higher.`,
                    }),
                    label({
                        padding: { top: 10 },
                        text: `Update to a newer version of the game.`,
                    }),
                ],
            }),
        ],
    });
}
