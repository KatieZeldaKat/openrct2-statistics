import { ElementVisibility } from "openrct2-flexui";


/**
 * Converts a boolean value to an instance of `ElementVisibility`.
 * @param isVisible Whether the element should be visible or not.
 * @returns `"visible"` if true, `"none"` otherwise.
 */
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
