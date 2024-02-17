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
      // legacy time widget, is replicated in the StatController's widgets
      // getTimeWidget(),
      // spread in the widgets from the StatController
      // including the new timeSpent widget
      ...sc.widgets,
      getPausedWidget(),
      // pass in the StatController to pass through the reset functions
      getResetWidget(sc),
      // it's also possible to add widgets directly to the window if there are other custom widgets
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
