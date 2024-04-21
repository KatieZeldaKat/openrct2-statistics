import { Statistic } from "../objects/Statistic";

const STATISTIC_KEY = "guestsDrowned";
const STATISTIC_TITLE = "Guests Drowned in";

type GuestsDrownedStat = number;

const subscribeToGuestDrowning = (
    updatedValueCallback: (additionalGuests: GuestsDrownedStat) => void,
) => {
    context.subscribe("guest.drown", (_) => {
        updatedValueCallback(1);
    });
};

const accumulateGuests = (newVal: GuestsDrownedStat, existingVal: GuestsDrownedStat) => {
    return existingVal + newVal;
};

const formatDisplay = (totalGuests: GuestsDrownedStat) => {
    return totalGuests.toString();
};

export const guestsDrownedStatistic = () => {
    const key = STATISTIC_KEY;
    const title = STATISTIC_TITLE;
    const resetValue = 0;

    return new Statistic(
        key,
        title,
        resetValue,
        subscribeToGuestDrowning,
        accumulateGuests,
        formatDisplay,
    );
};
