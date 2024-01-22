import { ElementVisibility } from "openrct2-flexui";


export function getElementVisibility(isVisible: boolean): ElementVisibility
{
    if (isVisible)
    {
        return "visible";
    }
    else
    {
        return "none";
    }
}
