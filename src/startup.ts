import * as events from "./helpers/events";
import * as window from "./window/window";
import * as windowWarning from "./window/windowWarning";
import { StatController } from "./objects/StatController";
import { timeSpentStatistic } from "./statistics/timeSpent";
import { guestsDrownedStatistic } from "./statistics/guestsDrowned";

/**
 * The entry point for this plugin. Should initialize any tracking of statistics, and if the ui
 * is enabled, it should also initialize the windows.
 *
 * To add new widgets, you can create a new Statistic object and add it to the StatController.
 */
export function startup() {
    // Events for ease of tracking game state
    events.initialize();

    // Setup the statistics to track and their container
    const statController = new StatController()
        .add(timeSpentStatistic())
        .add(guestsDrownedStatistic());

    if (typeof ui !== "undefined") {
        windowWarning.initialize();
        window.initialize(statController);

        const menuItemName = "OpenRCT2 Statistics";
        ui.registerMenuItem(menuItemName, window.openWindow);
        ui.registerToolboxMenuItem(menuItemName, window.openWindow);
    }
}
