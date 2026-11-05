"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easeIn, easeOut, lerp, seg } from "@/lib/anim";
import { story } from "@/lib/story";
import { createBeanGeometry } from "./geometry";
import { useMaterials } from "./materials";
import { HERO_Y, HOPPER_DROP_Y } from "./director";

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
      h.scale.setScalar(lerp(1.15, 0.12, easeOut(seg(s, 0.08, 0.92))));
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
      <mesh ref={hero} geometry={heroGeo} material={m.bean} castShadow />
      <instancedMesh ref={rain} args={[smallGeo, m.bean, RAIN]} frustumCulled={false} />
    </group>
  );
}
