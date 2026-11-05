import { clamp, easeIn, easeInOut, easeOut, keyframes, lerp, seg } from "@/lib/anim";

/**
 * World layout (scene units). The story runs top-to-bottom:
 * bean (hero) -> grinder -> stream of grounds -> cup -> kettle pours.
 */
export const HERO_Y = 4.2;
export const HOPPER_DROP_Y = 1.15; // where falling beans land in the hopper
export const BURR_BOTTOM_Y = -0.35; // grounds leave the burr here
export const CUP_BASE_Y = -6.0;

/**
 * Everything the scene needs for the current (smoothed) stage, computed once
 * per frame by the Director so every object reads the same values.
 */
export const live = {
  s: 0,
  mobile: false,
  camY: HERO_Y,
  camLift: 0,
  heroCamY: HERO_Y,
  heroHalfW: 9,
  camZ: 10,
  offsetX: 0,
  // grinder
  explode: 0,
  grinderLift: 0,
  // grounds stream
  streamHead: 0,
  streamTail: 0,
  streamBottom: CUP_BASE_Y,
  // cup
  cupX: 0,
  cupY: CUP_BASE_Y,
  cupScale: 1.5,
  cupRotY: 2.6,
  groundsLevel: 0,
  liquidLevel: 0,
  liquid: 0,
  // kettle
  kettleX: 6,
  kettleY: 0,
  kettleTilt: 0,
  kettleVisible: false,
  waterTop: 0,
  waterBottom: 0,
  water: 0,
  steam: 0,
};

export function computeLive(s: number, aspect: number) {
  live.s = s;
  const mobile = aspect < 0.85;
  live.mobile = mobile;

  // Camera follows the story downwards.
  const camY = keyframes(s, [HERO_Y, 0.22, -0.6, -4.6, -4.4, -4.25]);
  const baseZ = keyframes(s, [10.5, 13, 12.5, 10.6, 11.2, 9.6]);
  const zMul = mobile ? clamp(0.95 / aspect, 1, 1.9) : 1;
  live.camZ = baseZ * zMul;
  // On phones the copy sits on top, so push the objects lower in frame.
  const visH = 2 * live.camZ * Math.tan((35 * Math.PI) / 360);
  // Headline sits top-centre, so the object is framed in the lower-middle.
  const frame = keyframes(s, [0.2, 0.2, 0.14, 0.13, 0.16, 0.04]);
  live.camY = camY + visH * (frame + (mobile ? 0.03 : 0));
  live.heroCamY = HERO_Y + 2 * 10.5 * zMul * Math.tan((35 * Math.PI) / 360) * (0.2 + (mobile ? 0.03 : 0));
  live.heroHalfW = 10.5 * zMul * Math.tan((35 * Math.PI) / 360) * aspect;
  // Raise the camera (while still looking at camY) so we can see into the cup.
  live.camLift = keyframes(s, [0, 0.2, 0.5, 2.0, 2.4, 1.7]);
  // Layout is centred, so the scene is never shifted sideways.
  live.offsetX = 0;

  // Grinder opens up to reveal the burr.
  live.explode = easeInOut(seg(s, 1.15, 1.75));
  // Once the grounds are in the cup the grinder exits upwards.
  live.grinderLift = easeIn(seg(s, 3.05, 3.7)) * 8;

  // Ground coffee stream.
  live.streamHead = seg(s, 1.3, 1.95);
  live.streamTail = seg(s, 3.05, 3.45);

  // Cup: grounds land, then hot water rises.
  live.cupScale = lerp(1.5, 1.95, easeInOut(seg(s, 4.4, 5)));
  live.cupX = 0;
  live.cupY = CUP_BASE_Y;
  live.cupRotY = lerp(2.5, 0.55, easeInOut(seg(s, 4.35, 5)));
  live.groundsLevel = lerp(0.1, 0.3, easeOut(seg(s, 2.15, 3.1)));
  live.liquid = seg(s, 3.42, 3.6);
  live.liquidLevel = lerp(live.groundsLevel, 0.86, easeOut(seg(s, 3.45, 4.3)));
  live.streamBottom = live.cupY + live.cupScale * live.groundsLevel;

  // Kettle glides in from the right, tilts, pours, then leaves.
  const rimY = live.cupY + live.cupScale;
  const kin = easeOut(seg(s, 2.95, 3.45));
  const kout = easeIn(seg(s, 4.35, 4.85));
  live.kettleX = live.cupX + 0.12 + lerp(6.5, 0, kin) + kout * 6;
  live.kettleY = rimY + 0.7 + kout * 1.5;
  live.kettleTilt = 0.5 * easeInOut(seg(s, 3.2, 3.45)) * (1 - easeInOut(seg(s, 4.2, 4.45)));
  live.kettleVisible = s > 2.9 && s < 4.9;

  // Water stream from spout tip down to the liquid surface.
  const grow = seg(s, 3.38, 3.5);
  const end = seg(s, 4.15, 4.32);
  const surface = live.cupY + live.cupScale * live.liquidLevel;
  const L = live.kettleY - surface;
  live.waterTop = live.kettleY - end * L;
  live.waterBottom = live.kettleY - grow * L;
  live.water = grow > 0 && end < 1 ? 1 : 0;

  live.steam = seg(s, 3.7, 4.2);
}
