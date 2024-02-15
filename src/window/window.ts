import * as flex from "openrct2-flexui";
import { getTimeWidget } from "./windowTime";
import { getPausedWidget } from "./windowPause";
import { getResetWidget } from "./windowReset";
import { getPlayTimeWidget } from "./playTimeWidget";
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
      getTimeWidget(),
      getPlayTimeWidget(),
      getPausedWidget(),
      getResetWidget(sc),
      ...sc.widgets,
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
