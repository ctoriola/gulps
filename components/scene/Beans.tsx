"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easeIn, easeOut, lerp, seg } from "@/lib/anim";
import { story } from "@/lib/story";
import { createBeanGeometry } from "./geometry";
import { useMaterials } from "./materials";
import { HERO_Y, HOPPER_DROP_Y, live } from "./director";

const RAIN = 26;

/** The hero bean, plus a shower of beans that follows it into the grinder. */
export function Beans() {
  const m = useMaterials();
  const heroGeo = useMemo(() => createBeanGeometry(72), []);
  const smallGeo = useMemo(() => createBeanGeometry(20), []);
  const hero = useRef<THREE.Mesh>(null);
  const rain = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: RAIN }, (_, i) => ({
        x: (Math.random() - 0.5) * 2.2,
        y: HERO_Y + 3.4 + Math.random() * 2.5,
        z: (Math.random() - 0.5) * 1.2,
        delay: (i / RAIN) * 0.4,
        rx: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        spin: 3 + Math.random() * 5,
        land: (Math.random() - 0.5) * 0.7,
      })),
    [],
  );

  useFrame((state) => {
    const s = story.stage;
    const t = state.clock.elapsedTime;

    const h = hero.current;
    if (h) {
      const p = easeIn(seg(s, 0.1, 0.95));
      h.visible = s < 0.97;
      h.position.set(0, lerp(HERO_Y, HOPPER_DROP_Y, p), 0);
      h.scale.setScalar(lerp(1.02, 0.12, easeOut(seg(s, 0.08, 0.92))));
      h.rotation.set(
        0.3 + Math.sin(t * 0.7) * 0.12 - story.pointerY * 0.5 + p * 4,
        t * 0.5 + story.pointerX * 0.9 + p * 5,
        -0.45 + Math.sin(t * 0.5) * 0.08,
      );
    }

    const r = rain.current;
    if (r) {
      for (let i = 0; i < RAIN; i++) {
        const sd = seeds[i];
        const q = seg(s, 0.12 + sd.delay, 0.62 + sd.delay);
        const visible = q > 0 && q < 1;
        const e = easeIn(q);
        dummy.position.set(lerp(sd.x, sd.land, e), lerp(sd.y, HOPPER_DROP_Y, e), lerp(sd.z, 0, e));
        dummy.rotation.set(sd.rx + q * sd.spin, t * 0.3 + i, sd.rz + q * sd.spin);
        dummy.scale.setScalar(visible ? 0.12 : 0);
        dummy.updateMatrix();
        r.setMatrixAt(i, dummy.matrix);
      }
      r.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <BeanPiles geo={smallGeo} />
      <mesh ref={hero} geometry={heroGeo} material={m.bean} castShadow />
      <instancedMesh ref={rain} args={[smallGeo, m.bean, RAIN]} frustumCulled={false} />
    </group>
  );
}

const PILE = 85;

/** Make a loose, roughly circular scatter of beans (no overlaps). */
function scatter(count: number, radius: number, seed: number) {
  let r = seed;
  const rand = () => ((r = (r * 16807) % 2147483647) - 1) / 2147483646;
  const pts: { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number }[] = [];
  let guard = 0;
  while (pts.length < count && guard++ < 6000) {
    const a = rand() * Math.PI * 2;
    const d = Math.pow(rand(), 0.75) * radius;
    const x = Math.cos(a) * d * 0.85;
    const y = Math.sin(a) * d * 1.15;
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 0.27)) continue;
    pts.push({
      x,
      y,
      z: (rand() - 0.5) * 0.25,
      rx: (rand() < 0.5 ? 0 : Math.PI) + (rand() - 0.5) * 0.6,
      ry: (rand() - 0.5) * 0.6,
      rz: rand() * Math.PI * 2,
      s: 0.15 + rand() * 0.03,
    });
  }
  // a few loose strays further out
  for (let i = 0; i < 5; i++) {
    const a = rand() * Math.PI * 2;
    pts.push({ x: Math.cos(a) * (radius + 0.5 + rand() * 0.6), y: Math.sin(a) * (radius + 0.4), z: 0, rx: rand() * 3, ry: 0, rz: rand() * 6, s: 0.16 });
  }
  return pts;
}

/** Two scattered piles of beans framing the hero, like beans spilled on the table. */
function BeanPiles({ geo }: { geo: THREE.BufferGeometry }) {
  const m = useMaterials();
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const lm = useRef<THREE.InstancedMesh>(null);
  const rm = useRef<THREE.InstancedMesh>(null);
  const layouts = useMemo(() => [scatter(PILE, 1.35, 11), scatter(PILE, 1.35, 29)], []);
  const placed = useRef(false);

  useFrame((state) => {
    if (!placed.current && lm.current && rm.current) {
      const d = new THREE.Object3D();
      [lm.current, rm.current].forEach((mesh, k) => {
        layouts[k].forEach((p, i) => {
          d.position.set(p.x, p.y, p.z);
          d.rotation.set(p.rx, p.ry, p.rz);
          d.scale.setScalar(p.s);
          d.updateMatrix();
          mesh.setMatrixAt(i, d.matrix);
        });
        mesh.count = layouts[k].length;
        mesh.instanceMatrix.needsUpdate = true;
      });
      placed.current = true;
    }
    const w = live.heroHalfW;
    const k = live.mobile ? 0.65 : 1;
    const t = state.clock.elapsedTime;
    const visible = story.stage < 0.8;
    if (left.current) {
      left.current.visible = visible;
      left.current.position.set(-w - 0.2 + story.pointerX * 0.08, live.heroCamY + 0.15 + Math.sin(t * 0.4) * 0.03, -0.6);
      left.current.scale.setScalar(k);
    }
    if (right.current) {
      right.current.visible = visible;
      right.current.position.set(w + 0.1 + story.pointerX * 0.08, live.heroCamY + 0.55 + Math.cos(t * 0.4) * 0.03, -0.6);
      right.current.scale.setScalar(k);
    }
  });

  return (
    <>
      <group ref={left}>
        <instancedMesh ref={lm} args={[geo, m.bean, PILE + 5]} frustumCulled={false} castShadow receiveShadow />
      </group>
      <group ref={right}>
        <instancedMesh ref={rm} args={[geo, m.bean, PILE + 5]} frustumCulled={false} castShadow receiveShadow />
      </group>
    </>
  );
}
