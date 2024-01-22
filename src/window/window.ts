import * as flex from "openrct2-flexui";
import { getTimeWidget } from "./windowTime";
import { getPausedWidget } from "./windowPause";
import { getResetWidget } from "./windowReset";

let window: flex.WindowTemplate;
let isWindowOpen = false;


export function initialize()
{
    window = flex.window({
        title: "OpenRCT2 Statistics",
        width: 250,
        height: "auto",
        position: "center",
        colours: [ flex.Colour.LightBlue, flex.Colour.White ],
        onOpen: () => isWindowOpen = true,
        onClose: () => isWindowOpen = false,
        content: [
            getTimeWidget(),
            getPausedWidget(),
            getResetWidget(),
        ],
    });
}


export function openWindow()
{
    if (isWindowOpen)
    {
        window.focus();
    }
    else
    {
        window.open();
    }
}
