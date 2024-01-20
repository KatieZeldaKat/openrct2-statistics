// @ts-ignore
import * as info from "./info.js";
import * as time from "./statistics/time";
import * as window from "./window/window";


export function startup()
{
	time.initialize();

	if (typeof ui !== "undefined")
	{
		window.initialize();

		ui.registerMenuItem(info.name, window.openWindow);
		ui.registerToolboxMenuItem(info.name, window.openWindow);
	}
}
