// @ts-ignore
import * as info from "./info.js";
import * as events from "./helpers/events";
import * as time from "./statistics/time";
import * as window from "./window/window";
import * as windowWarning from "./window/windowWarning";


export function startup()
{
	events.initialize();
	time.initialize();

	if (typeof ui !== "undefined")
	{
		window.initialize();
		windowWarning.initialize();

		ui.registerMenuItem(info.name, window.openWindow);
		ui.registerToolboxMenuItem(info.name, window.openWindow);
	}
}
