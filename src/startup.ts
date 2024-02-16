import * as events from "./helpers/events";
import * as time from "./statistics/time";
import * as window from "./window/window";
import * as windowWarning from "./window/windowWarning";
import { StatController } from "./objects/StatController";
import { timeSpentStatistic } from "./statistics/timeSpent";

/**
 * The entry point for this plugin. Should initialize any tracking of statistics, and if the ui
 * is enabled, it should also initialize the windows.
 *
 * To add new widgets, you can create a new Statistic object and add it to the StatController.
 */
export function startup() {
  // a container to hold all the statistics data/widgets for easy pausing and resetting
  const statController = new StatController();
  events.initialize();
  time.initialize();

  // track how much time has been spent in the game
  const timeSpentStat = timeSpentStatistic();

  // add the statistics to the controller
  statController.add(timeSpentStat);

  if (typeof ui !== "undefined") {
    window.initialize(statController);
    windowWarning.initialize();

    const menuItemName = "OpenRCT2 Statistics";
    ui.registerMenuItem(menuItemName, window.openWindow);
    ui.registerToolboxMenuItem(menuItemName, window.openWindow);
  }
}
