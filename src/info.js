export const name = "openrct2-statistics";
export const version = "1.1.1";
export const type = "intransient";
export const license = "MIT";

// prettier-ignore
export const authors = [
    "Katherine Norton (KatieZeldaKat)",
    "Smitty Penman (ltsSmitty)",
];

/**
 * The following field determines which OpenRCT2 API version to use. It's best to always target
 * the latest release version, unless you want to use specific versions from a newer develop
 * version. Version 81 equals the v0.4.7 release.
 * @see https://github.com/OpenRCT2/OpenRCT2/blob/v0.4.7/src/openrct2/scripting/ScriptEngine.h#L50
 */
export const targetApiVersion = 81;
