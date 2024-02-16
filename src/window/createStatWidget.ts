import * as events from "../helpers/events";
import { getElementVisibility } from "../helpers/flexHelper";
import {
  WidgetCreator,
  FlexiblePosition,
  groupbox,
  horizontal,
  label,
  compute,
  Store,
} from "openrct2-flexui";

/**
 * Creates a stat widget with the given properties.
 *
 * @param {string} props.title - The title of the stat widget.
 * @param {Store<T>} props.gameStatStore - The statistic store with values for the entire game.
 * @param {Store<T>} props.parkStatStore - The park stat store with values for the current park.
 * @param {(stat: T) => string} [props.processStat] - Optional function to process the stat value for displaying it more clearly.
 * @returns {WidgetCreator<FlexiblePosition>} The created stat widget.
 */
export function createStatWidget<T>(props: {
  /** The title of your widget which will display in the box*/
  title: string;
  /** The store with total game stat values*/
  gameStatStore: Store<T>;
  /** The store with this park stat values*/
  parkStatStore: Store<T>;
  /**
   * Function to process the stat value,
   * e.g. to process time in seconds into nice human-readable text,
   * or to take the take the length of an array instead of its values*/
  processStat: (stat: T) => string;
}): WidgetCreator<FlexiblePosition> {
  const { title, gameStatStore, parkStatStore, processStat } = props;

  return groupbox({
    text: `${title}`,
    content: [
      getGameStatWidget(gameStatStore, processStat),
      getParkStatWidget(parkStatStore, processStat),
    ],
  });
}

function getGameStatWidget<T>(
  statStore: Store<T>,
  processStat: (stat: T) => string
) {
  return horizontal([
    label({ text: "OpenRCT2 -" }),
    label({
      // Compute lets you use a store's value to create a new value
      text: compute(statStore, (value) => processStat(value)),
    }),
  ]);
}

function getParkStatWidget<T>(
  statStore: Store<T>,
  processStat: (stat: T) => string
) {
  const parkNameFormat = (name: string) => `"${name}" -`;
  const isVisible = compute(events.isInPark, (isInPark) =>
    getElementVisibility(isInPark)
  );

  return horizontal([
    label({
      text: compute(events.parkName, (name) => parkNameFormat(name)),
      visibility: isVisible,
    }),
    label({
      text: compute(statStore, (value) => processStat(value)),
      visibility: isVisible,
    }),
  ]);
}
