import * as flex from "openrct2-flexui";

const message = flex.store("");
const callback = flex.store(() => {});

let window: flex.WindowTemplate;
let isWindowOpen = false;

export function initialize() {
  window = flex.window({
    title: "Warning",
    width: 200,
    height: 100,
    position: "center",
    colours: [flex.Colour.BordeauxRed, flex.Colour.BordeauxRed],
    onOpen: () => (isWindowOpen = true),
    onClose: () => (isWindowOpen = false),
    content: [
      flex.vertical({
        padding: ["10px", "6px"],
        content: [
          flex.label({
            text: "Are you sure you want to",
            alignment: "centred",
          }),
          flex.label({ text: message, alignment: "centred" }),
        ],
      }),
      flex.horizontal([
        flex.button({ text: "Confirm", height: 20, onClick: confirm }),
        flex.button({
          text: "Cancel",
          height: 20,
          onClick: () => window.close(),
        }),
      ]),
    ],
  });
}

/**
 * Creates a window asking the player to confirm a given action.
 * @param warningMessage A message to display after the line: `"Are you sure you want to"`.
 * @param warningCallback A function to be executed if the player confirms.
 */
export function openWarningWindow(
  warningMessage: string,
  warningCallback: () => void,
) {
  if (isWindowOpen) {
    window.close();
  }

  message.set(warningMessage);
  callback.set(warningCallback);
  window.open();
}

function confirm() {
  callback.get()();
  window.close();
}
