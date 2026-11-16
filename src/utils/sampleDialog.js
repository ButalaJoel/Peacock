// Opens the colour-sample prompt from anywhere (top bar, colour pages, colour picker).
export const askForSample = colourName =>
  window.dispatchEvent(new CustomEvent("peacock:sample", { detail: { colour: colourName || "" } }));
