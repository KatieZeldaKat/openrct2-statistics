import { WidgetCreator, FlexiblePosition, groupbox, label, vertical } from "openrct2-flexui";
import { getGameVersionFromApiVersion } from "../helpers/apiToGameReleaseVersionMap";

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
            vertical({
                content: [
                    label({ text: "-+- Unable to calculate statistic. -+-" }),
                    label({
                        text: versionText,
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
