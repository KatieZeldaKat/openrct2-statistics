import * as flex from "openrct2-flexui";
import { getTimeWidget } from "./windowTime";
import { getPausedWidget } from "./windowPause";

let window: flex.WindowTemplate;
let isWindowOpen = false;


export function openWindow()
{
    if (isWindowOpen)
    {
        window.focus();
        return;
    }

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
        ],
    });

    window.open();
}
