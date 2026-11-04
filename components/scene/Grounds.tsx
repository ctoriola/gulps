"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { live, BURR_BOTTOM_Y } from "./director";

const COUNT = 4200;

const vertex = /* glsl */ `
  attribute vec4 seed; // phase, angle, radius, shade
  uniform float uTime;
  uniform float uTop;
  uniform float uBottom;
  uniform float uHead;
  uniform float uTail;
  uniform float uSize;
  varying float vAlpha;
  varying float vShade;
  void main() {
    float t = fract(seed.x + uTime * 0.5);
    float fall = t * t * 0.35 + t * 0.65; // gentle acceleration
    float y = mix(uTop, uBottom, fall);
    float spread = 0.05 + 0.2 * t;
    float ang = seed.y + t * 5.0;
    vec3 p = vec3(
      cos(ang) * seed.z * spread + 0.06 * sin(t * 8.0 + uTime * 1.7) * t,
      y,
      sin(ang) * seed.z * spread
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + seed.w * 0.9) * (10.0 / -mv.z);
    vAlpha = step(t, uHead) * step(uTail, t);
    vShade = seed.w;
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying float vShade;
  void main() {
    if (vAlpha < 0.5) discard;
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    vec3 dark = vec3(0.16, 0.08, 0.03);
    vec3 light = vec3(0.45, 0.27, 0.13);
    vec3 col = mix(dark, light, vShade) * (1.0 - d * 0.8);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Particle stream of freshly ground coffee falling from the burr into the cup. */
export function Grounds() {
  const { gl } = useThree();
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seed = new Float32Array(COUNT * 4);
    const position = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      seed[i * 4] = Math.random();
      seed[i * 4 + 1] = Math.random() * Math.PI * 2;
      seed[i * 4 + 2] = Math.pow(Math.random(), 0.7);
      seed[i * 4 + 3] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(position, 3));
    g.setAttribute("seed", new THREE.BufferAttribute(seed, 4));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uTop: { value: BURR_BOTTOM_Y },
          uBottom: { value: -6 },
          uHead: { value: 0 },
          uTail: { value: 0 },
          uSize: { value: 4 },
        },
      }),
    [],
  );

  useFrame((state) => {
    const u = mat.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uHead.value = live.streamHead;
    u.uTail.value = live.streamTail;
    u.uBottom.value = live.streamBottom;
    u.uSize.value = 3.6 * gl.getPixelRatio();
    if (pts.current) pts.current.visible = live.streamHead > 0 && live.streamTail < 1;
  });

  return <points ref={pts} geometry={geo} material={mat} frustumCulled={false} />;
}
