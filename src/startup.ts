import * as events from "./helpers/events";
import * as time from "./statistics/time";
import * as window from "./window/window";
import * as windowWarning from "./window/windowWarning";

/**
 * The entry point for this plugin. Should initialize any tracking of statistics, and if the ui
 * is enabled, it should also initialize the windows.
 */
export function startup() {
  events.initialize();
  time.initialize();

  if (typeof ui !== "undefined") {
    window.initialize();
    windowWarning.initialize();

    const menuItemName = "OpenRCT2 Statistics";
    ui.registerMenuItem(menuItemName, window.openWindow);
    ui.registerToolboxMenuItem(menuItemName, window.openWindow);
  }
}
