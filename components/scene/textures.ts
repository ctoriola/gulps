import * as THREE from "three";
import { getQuality } from "@/lib/quality";

/** Deterministic hash-based value noise (tileable over `period`). */
function makeNoise(period: number, seed = 1) {
  const grid = new Float32Array(period * period);
  let s = seed * 9301 + 49297;
  for (let i = 0; i < grid.length; i++) {
    s = (s * 9301 + 49297) % 233280;
    grid[i] = s / 233280;
  }
  const at = (x: number, y: number) =>
    grid[(((y % period) + period) % period) * period + (((x % period) + period) % period)];
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

/** Builds a tangent-space normal map from a height function h(u, v) in 0..1. */
function normalMapFromHeight(
  w: number,
  h: number,
  height: (u: number, v: number) => number,
  strength: number,
  repeat: [number, number] = [1, 1],
) {
  const H = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) H[y * w + x] = height(x / w, y / h);
  const data = new Uint8Array(w * h * 4);
  const get = (x: number, y: number) => H[((y + h) % h) * w + ((x + w) % w)];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (get(x + 1, y) - get(x - 1, y)) * strength;
      const dy = (get(x, y + 1) - get(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Greyscale data texture (for roughness maps). */
function greyTexture(w: number, h: number, fn: (u: number, v: number) => number, repeat: [number, number] = [1, 1]) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const g = Math.max(0, Math.min(255, fn(x / w, y / h) * 255));
      const i = (y * w + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = g;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

let cache: ReturnType<typeof build> | null = null;

function build() {
  // Phones: half-size maps (4x less CPU work while the page loads, no visible difference on a small screen).
  const k = getQuality().tier === "mobile" ? 0.5 : 1;
  const px = (n: number) => Math.round(n * k);
  const n1 = makeNoise(64, 3);
  const n2 = makeNoise(256, 7);
  const n3 = makeNoise(32, 11);

  // Brushed metal: fine streaks running around the object (along U).
  const brushedRough = greyTexture(px(512), px(512),
    (u, v) => 0.62 + 0.22 * (n2(u * 4, v * 256) - 0.5) + 0.1 * (n1(u * 8, v * 32) - 0.5),
    [2, 1],
  );
  const brushedNormal = normalMapFromHeight(px(512), px(512), (u, v) => n2(u * 4, v * 256), 1.2, [2, 1]);

  // Powder-coated / matte body: soft orange-peel bumps.
  const powderNormal = normalMapFromHeight(px(256), px(256),
    (u, v) => n1(u * 64, v * 64) * 0.7 + n3(u * 32, v * 32) * 0.3,
    2.0,
    [3, 2],
  );

  // Hand-thrown ceramic: throwing rings (horizontal ridges) + gentle wobble.
  const ceramicNormal = normalMapFromHeight(px(512), px(512),
    (u, v) => 0.5 + 0.5 * Math.sin(v * Math.PI * 2 * 9 + n1(u * 6, v * 6) * 3) * 0.35 + n1(u * 16, v * 16) * 0.3,
    1.6,
  );

  // Roasted bean: fine organic surface.
  const beanNormal = normalMapFromHeight(px(256), px(256), (u, v) => n1(u * 48, v * 24) * 0.6 + n2(u * 64, v * 64) * 0.4, 3.0);
  const beanRough = greyTexture(px(256), px(256), (u, v) => 0.35 + 0.35 * n1(u * 24, v * 12));

  return { brushedRough, brushedNormal, powderNormal, ceramicNormal, beanNormal, beanRough };
}

export function useTextures() {
  if (!cache) cache = build();
  return cache;
}
