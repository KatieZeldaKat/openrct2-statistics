import * as events from "../helpers/events";
import { openWarningWindow } from "./windowWarning";
import { getElementVisibility } from "../helpers/flexHelper";
import {
  WidgetCreator,
  FlexiblePosition,
  groupbox,
  store,
  horizontal,
  button,
  label,
} from "openrct2-flexui";
import { StatController } from "../objects/StatController";

export function getResetWidget(
  sc: StatController
): WidgetCreator<FlexiblePosition> {
  const parkNameFormat = (name: string) => `Reset Statistics for "${name}"`;
  let parkName = store(parkNameFormat(events.parkName.get()));
  events.parkName.subscribe((newName) => parkName.set(parkNameFormat(newName)));

  let isParkWidgetVisible = store(getElementVisibility(events.isInPark.get()));
  events.isInPark.subscribe((inPark) =>
    isParkWidgetVisible.set(getElementVisibility(inPark))
  );

  return groupbox({
    text: "Reset Statistics",
    content: [
      horizontal([
        button({
          image: "reload",
          width: "25px",
          height: "25px",
          onClick: () => resetGenericStatistics(sc),
        }),
        label({ text: "Reset OpenRCT2 Statistics", padding: "6px" }),
      ]),
      horizontal([
        button({
          image: "reload",
          width: "25px",
          height: "25px",
          visibility: isParkWidgetVisible,
          onClick: () => resetParkStatistics(sc),
        }),
        label({
          text: parkName,
          padding: "6px",
          visibility: isParkWidgetVisible,
        }),
      ]),
    ],
  });
}

function resetGenericStatistics(statController: StatController) {
  openWarningWindow("reset cumulative statistics?", () =>
    statController.resetGameStatistics()
  );
}

function resetParkStatistics(statController: StatController) {
  openWarningWindow("reset park statistics?", () =>
    statController.resetParkStatistics()
  );
}
