/**
 * Plugin api versions are bumped when there are meaningful changes to the plugin api.
 * This will return the minimum game release version that the api is compatible with.
 */
export const getGameVersionFromApiVersion = (apiVersion: number): string | undefined => {
    // will need to update this as new versions are released
    // Current [april 2024] is v81, which requires at least 0.4.7
    if (apiVersion >= 82) {
        return undefined;
    }
    if (apiVersion === 81) {
        return "0.4.7";
    }
    if (apiVersion >= 78) {
        return "0.4.6";
    }
    if (apiVersion >= 77) {
        return "0.4.5";
    }
    if (apiVersion >= 70) {
        return "0.4.4";
    }
    if (apiVersion >= 65) {
        return "0.4.3";
    }
    if (apiVersion >= 62) {
        return "0.4.2";
    }
    if (apiVersion >= 57) {
        return "0.4.1";
    }
    // anything older that 0.4.0 we should just tell the user to upgrade
    // to have an improved experience
    return "0.4.0";
};
