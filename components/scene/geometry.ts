import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural coffee bean: a flattened ellipsoid with an S-shaped crease
 * carved into its flat face. Vertex colours darken the crease.
 */
export function createBeanGeometry(detail = 64) {
  let g: THREE.BufferGeometry = new THREE.SphereGeometry(1, detail, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);

  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const base = new THREE.Color("#6b3a1c");
  const dark = new THREE.Color("#2a1407");
  const tmp = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Ellipsoid proportions, with slightly pointed ends.
    const taper = 1 - 0.12 * Math.pow(Math.abs(y), 3);
    x *= 0.7 * taper;
    z *= 0.52 * taper;
    // The crease side of a bean is flatter.
    if (z > 0) z *= 0.72;

    // S-shaped groove down the flat face.
    const cx = 0.07 * Math.sin(y * 3.2);
    const d = x - cx;
    const along = Math.sqrt(Math.max(0, 1 - y * y));
    const g1 = Math.exp(-(d * d) / 0.006) * along;
    let groove = 0;
    if (z > 0) {
      groove = g1;
      z -= groove * 0.2 * Math.min(1, z / 0.3);
    }

    pos.setXYZ(i, x, y, z);
    tmp.copy(base).lerp(dark, Math.min(1, groove * 1.3));
    // Tiny tonal variation so the surface does not look plastic.
    const n = 0.06 * Math.sin(x * 23.1 + y * 17.7) * Math.cos(z * 19.3 - y * 7.1);
    colors[i * 3] = tmp.r + n;
    colors[i * 3 + 1] = tmp.g + n * 0.7;
    colors[i * 3 + 2] = tmp.b + n * 0.4;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Outer radius of the cup at normalised height y (0 = foot, 1 = rim). */
export const cupOuter = (y: number) => 0.4 + 0.24 * (1 - (1 - y) * (1 - y));
export const CUP_WALL = 0.045;
export const CUP_FLOOR = 0.07;
export const cupInner = (y: number) => cupOuter(y) - CUP_WALL;

/**
 * Hand-thrown style ceramic cup (lathe). Glossy cream glaze dripping over
 * a speckled terracotta clay base, done with vertex colours.
 */
export function createCupGeometry() {
  const pts: THREE.Vector2[] = [];
  const steps = 70;
  // inside floor -> inner wall up
  pts.push(new THREE.Vector2(0.0001, CUP_FLOOR));
  pts.push(new THREE.Vector2(cupInner(CUP_FLOOR) * 0.8, CUP_FLOOR));
  for (let i = 0; i <= steps; i++) {
    const y = CUP_FLOOR + 0.02 + ((1 - CUP_FLOOR - 0.02) * i) / steps;
    pts.push(new THREE.Vector2(cupInner(y), y));
  }
  // rounded rim
  for (let i = 1; i < 8; i++) {
    const a = Math.PI - (Math.PI * i) / 8;
    pts.push(
      new THREE.Vector2(
        cupOuter(1) - CUP_WALL / 2 + Math.cos(a) * (CUP_WALL / 2),
        1 + Math.sin(a) * (CUP_WALL / 2),
      ),
    );
  }
  // outer wall down
  for (let i = steps; i >= 0; i--) {
    const y = (1 * i) / steps;
    pts.push(new THREE.Vector2(cupOuter(y), y));
  }
  // foot ring
  pts.push(new THREE.Vector2(0.37, -0.03));
  pts.push(new THREE.Vector2(0.33, -0.04));
  pts.push(new THREE.Vector2(0.0001, -0.04));

  // Lathe normals face outward when the profile runs bottom-to-top.
  pts.reverse();
  const g = new THREE.LatheGeometry(pts, 128);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const glaze = new THREE.Color("#efe7d8");
  const glazeEdge = new THREE.Color("#d9c4a6");
  const clay = new THREE.Color("#c48a5f");
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    const a = Math.atan2(z, x);
    const inside = y > 0.02 && r < cupOuter(Math.min(1, y)) - CUP_WALL * 0.5;
    // Drippy glaze line.
    const line =
      0.42 +
      0.07 * Math.sin(a * 3 + 1.2) +
      0.05 * Math.sin(a * 7 + 0.4) +
      0.09 * Math.pow(Math.max(0, Math.sin(a * 5 + 2.1)), 12);
    const t = THREE.MathUtils.smoothstep(y, line - 0.025, line + 0.025);
    if (inside || y >= 0.999) {
      c.copy(glaze);
    } else {
      c.copy(clay).lerp(glaze, t);
      if (t > 0 && t < 1) c.lerp(glazeEdge, 0.6 * (1 - Math.abs(t * 2 - 1)));
      // speckles in the clay
      const sp = Math.sin(a * 91.7 + y * 133.1) * Math.sin(a * 57.3 - y * 211.9);
      if (t < 0.5 && sp > 0.93) c.multiplyScalar(0.75);
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Radial gradient texture for the coffee surface (dark centre, crema edge). */
export function createCremaTexture() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d")!;
  const grd = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, "#3a1c0b");
  grd.addColorStop(0.55, "#5a2e12");
  grd.addColorStop(0.85, "#9a6235");
  grd.addColorStop(1, "#c08a55");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, s, s);
  // a few crema swirls
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#d9a873";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(s / 2 + 6 * i, s / 2 - 4 * i, 30 + i * 16, 0.3 * i, Math.PI * 1.2 + 0.3 * i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft round sprite for steam. */
export function createSoftTexture() {
  const s = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d")!;
  const grd = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.5)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  return tex;
}
