import * as events from "./helpers/events";
import { StatController } from "./objects/StatController";
import { ridesBuiltStatistic } from "./statistics/ridesBuilt";
import * as time from "./statistics/time";
import * as window from "./window/window";
import * as windowWarning from "./window/windowWarning";

/**
 * The entry point for this plugin. Should initialize any tracking of statistics, and if the ui
 * is enabled, it should also initialize the windows.
 */
export function startup() {
  const sc = new StatController();
  events.initialize();
  time.initialize();
  const ridesBuiltStat = ridesBuiltStatistic();
  sc.add(ridesBuiltStat);

  if (typeof ui !== "undefined") {
    window.initialize(sc);
    windowWarning.initialize();

    const menuItemName = "OpenRCT2 Statistics";
    ui.registerMenuItem(menuItemName, window.openWindow);
    ui.registerToolboxMenuItem(menuItemName, window.openWindow);
  }
}
