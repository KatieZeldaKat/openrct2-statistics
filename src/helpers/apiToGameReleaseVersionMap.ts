/**
 * Current [april 2024] is v81, which requires at least 0.4.7
 * 78 is 0.4.6
 * 72 is 0.4.5
 * 70 is 0.4.4
 * 52 is 0.4.0
 */

/**
 * Plugin api versions are bumped when there are meaningful changes to the plugin api.
 * This will return the minimum game release version that the api is compatible with.
 */
export const getGameVersionFromApiVersion = (apiVersion: number): string => {
    // will need to update this as new versions are released
    if (apiVersion >= 82) {
        return ">0.4.10";
    }
    if (apiVersion >= 81) {
        return "0.4.7";
    }
    if (apiVersion >= 78) {
        return "0.4.6";
    }
    if (apiVersion >= 72) {
        return "0.4.5";
    }
    if (apiVersion >= 70) {
        return "0.4.4";
    }
    // anything older that 0.4.0 we should just tell the user to upgrade
    // to have an improved experience
    return "0.4.0";
};
