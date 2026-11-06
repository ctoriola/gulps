// Facts the website copy depends on. Bracketed items in the content strategy
// ("facts we don't have yet") are null here: the site hides the sentence
// that needs them until you fill them in.

export const shop = {
  city: "Abuja",
  hours: "Mon to Fri 7am to 8pm | Sat and Sun 8am to 9pm",
  address: ["El-pantomath Park", "14B Accra St, Wuse, Abuja 900285", "Federal Capital Territory, Nigeria"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("El-pantomath Park, 14B Accra St, Wuse, Abuja 900285, Nigeria"),
};

export const gallery = {
  name: "Hare and Grouse",
  /** Gallery website or Instagram, for the "Visit Hare and Grouse" button. */
  url: null as string | null,
  /** [How to get from Gulpsee to the gallery.] */
  directions: null as string | null,
  /** [entry terms, to be agreed] for the receipt stub, e.g. "free entry". */
  receiptTerms: null as string | null,
};

export const pairings = {
  /** [on date / when trigger], e.g. "on 1 December". */
  revealWhen: null as string | null,
  /** Flip to true once the Pairings are revealed (then add artwork + artist per coffee). */
  revealed: false,
  /** Flip to true to show the coffees' real names (kept in lib/products.ts as realName).
   *  Until then each card reads "Unnamed Brew". */
  namesRevealed: false,
};

/** The Unnamed Menu: one launch drink shown by its contents only. */
export const unnamedDrink = {
  productId: "zobo-cold-brew",
  contents: "Cold brew, hibiscus, ginger",
  /** The secret name: shown only on the QR reveal page (/reveal) until it goes public. */
  name: null as string | null,
  /** Public once this many people have scanned... */
  scanThreshold: null as number | null,
  /** ...or on this date, whichever comes first, e.g. "Friday 20 November". */
  revealDate: null as string | null,
  /** Live scan count (wire to the QR service later). */
  scans: null as number | null,
};
