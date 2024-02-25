import * as flex from "openrct2-flexui";
import { getPausedWidget } from "./windowPause";
import { getResetWidget } from "./windowReset";
import { StatController } from "../objects/StatController";

let window: flex.WindowTemplate;
let isWindowOpen = false;

export function initialize(sc: StatController) {
    window = flex.window({
        title: "OpenRCT2 Statistics",
        width: 250,
        height: "auto",
        position: "center",
        colours: [flex.Colour.LightBlue, flex.Colour.White],
        onOpen: () => (isWindowOpen = true),
        onClose: () => (isWindowOpen = false),
        content: [
            // Spread in the widgets from the StatController
            ...sc.widgets,
            getPausedWidget(),
            // Pass in the StatController for reset functionality
            getResetWidget(sc),
            // It's also possible to add custom widgets directly to the window if needed
        ],
    });
}

/**
 * Opens the main window. If already open, the window will be focused.
 */
export function openWindow() {
    if (isWindowOpen) {
        window.focus();
    } else {
        window.open();
    }
}
