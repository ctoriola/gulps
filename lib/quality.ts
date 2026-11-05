// Decides once, on the client, how much rendering work the device can take.
export type Tier = "mobile" | "desktop";

type Quality = { tier: Tier; grounds: number; beanDetail: number; envRes: number; hdri: string };
let cached: Quality | null = null;

/** Keep in sync with the HDRI preload links in app/layout.tsx. */
export const MOBILE_MEDIA = "(pointer: coarse), (max-width: 819px)";

export function getQuality() {
  if (cached) return cached;
  let tier: Tier = "desktop";
  if (typeof window !== "undefined") {
    // Touch devices and narrow windows. (Width only: many laptops have
    // viewports under 820px tall and must still get the desktop renderer.)
    if (window.matchMedia(MOBILE_MEDIA).matches) tier = "mobile";
  }
  cached =
    tier === "mobile"
      ? { tier, grounds: 2200, beanDetail: 48, envRes: 256, hdri: "/hdri/studio_small_09_512.hdr" }
      : { tier, grounds: 3800, beanDetail: 72, envRes: 512, hdri: "/hdri/studio_small_09_1k.hdr" };
  return cached;
}
