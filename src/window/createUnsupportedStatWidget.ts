import { WidgetCreator, FlexiblePosition, groupbox, label, vertical } from "openrct2-flexui";

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

    return groupbox({
        text: title,
        height: 100,
        content: [
            vertical({
                content: [
                    label({ text: "-+- Unable to calculate this statistic. -+-" }),
                    label({
                        text: `This stat requires OpenRCT API {RED}version ${minimumApiVersion}\n{WHITE}or higher.`,
                    }),
                    label({
                        padding: { top: 10 },
                        text: `Please update to a newer version \n(current version ${context.apiVersion}).`,
                    }),
                ],
            }),
        ],
    });
}
