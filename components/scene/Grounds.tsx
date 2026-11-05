"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { live, BURR_BOTTOM_Y } from "./director";

const COUNT = 3800;

/**
 * Stream of freshly ground coffee. Each grain is a tiny faceted 3D particle
 * (instanced), lit by the scene so it catches highlights and shadows.
 * Positions are computed on the GPU from a per-grain seed.
 */
export function Grounds() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const geo = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute("position", base.getAttribute("position"));
    g.setAttribute("normal", base.getAttribute("normal"));
    const seed = new Float32Array(COUNT * 4);
    const look = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      seed[i * 4] = Math.random(); // phase
      seed[i * 4 + 1] = Math.random() * Math.PI * 2; // angle
      seed[i * 4 + 2] = Math.pow(Math.random(), 0.7); // radius
      seed[i * 4 + 3] = Math.random(); // shade
      look[i * 4] = 0.011 + Math.random() * 0.016; // size
      look[i * 4 + 1] = Math.random() * 2 - 1; // axis
      look[i * 4 + 2] = Math.random() * 2 - 1;
      look[i * 4 + 3] = 0.6 + Math.random() * 0.8; // squash
    }
    g.setAttribute("seed", new THREE.InstancedBufferAttribute(seed, 4));
    g.setAttribute("look", new THREE.InstancedBufferAttribute(look, 4));
    g.instanceCount = COUNT;
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTop: { value: BURR_BOTTOM_Y },
      uBottom: { value: -6 },
      uHead: { value: 0 },
      uTail: { value: 0 },
    }),
    [],
  );

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, flatShading: true });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          /* glsl */ `#include <common>
          attribute vec4 seed;
          attribute vec4 look;
          uniform float uTime, uTop, uBottom, uHead, uTail;
          varying float vShade;
          mat3 rotAxis(vec3 a, float r) {
            a = normalize(a); float s = sin(r), c = cos(r), oc = 1.0 - c;
            return mat3(oc*a.x*a.x+c, oc*a.x*a.y+a.z*s, oc*a.z*a.x-a.y*s,
                        oc*a.x*a.y-a.z*s, oc*a.y*a.y+c, oc*a.y*a.z+a.x*s,
                        oc*a.z*a.x+a.y*s, oc*a.y*a.z-a.x*s, oc*a.z*a.z+c);
          }`,
        )
        .replace(
          "#include <beginnormal_vertex>",
          /* glsl */ `float gT = fract(seed.x + uTime * 0.5);
          mat3 gR = rotAxis(vec3(look.y, look.z, 0.5), seed.x * 40.0 + uTime * 4.0 * (0.5 + seed.w));
          vec3 objectNormal = gR * normal;
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3( tangent.xyz );
          #endif`,
        )
        .replace(
          "#include <begin_vertex>",
          /* glsl */ `float fall = gT * gT * 0.35 + gT * 0.65;
          float y = mix(uTop, uBottom, fall);
          float spread = 0.05 + 0.2 * gT;
          float ang = seed.y + gT * 5.0;
          vec3 center = vec3(
            cos(ang) * seed.z * spread + 0.06 * sin(gT * 8.0 + uTime * 1.7) * gT,
            y,
            sin(ang) * seed.z * spread
          );
          float vis = step(gT, uHead) * step(uTail, gT);
          vec3 p = position * vec3(1.0, look.w, 1.0);
          vec3 transformed = center + gR * p * look.x * vis;
          vShade = seed.w;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vShade;")
        .replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          "vec4 diffuseColor = vec4( mix(vec3(0.13,0.065,0.025), vec3(0.42,0.25,0.12), vShade), opacity );",
        );
    };
    return m;
  }, [uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uHead.value = live.streamHead;
    uniforms.uTail.value = live.streamTail;
    uniforms.uBottom.value = live.streamBottom;
    if (mesh.current) mesh.current.visible = live.streamHead > 0 && live.streamTail < 1;
  });

  return <instancedMesh ref={mesh} args={[geo, mat, COUNT]} frustumCulled={false} />;
}
