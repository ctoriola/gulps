"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seg } from "@/lib/anim";
import { story } from "@/lib/story";
import { createBeanGeometry } from "./geometry";
import { useMaterials } from "./materials";
import { live } from "./director";

const BODY_H = 1.8;
const BODY_Y = -0.7; // body centre
const R_TOP = 0.82;
const R_BOT = 0.9;
const HOPPER_BEANS = 170;

/** Dial on the front of the grinder body. */
function Dial({ angle }: { angle: number }) {
  const m = useMaterials();
  const ticks = useMemo(() => Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2), []);
  const r = 0.885;
  return (
    <group position={[Math.sin(angle) * r, -0.88, Math.cos(angle) * r]} rotation={[0, angle, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.gloss}>
        <cylinderGeometry args={[0.31, 0.31, 0.05, 48]} />
      </mesh>
      <mesh position={[0, 0, 0.02]} material={m.steel}>
        <torusGeometry args={[0.31, 0.022, 12, 64]} />
      </mesh>
      {ticks.map((a, i) => (
        <mesh
          key={i}
          position={[Math.sin(a) * 0.24, Math.cos(a) * 0.24, 0.03]}
          rotation={[0, 0, -a]}
          material={m.white}
        >
          <boxGeometry args={[i % 6 === 0 ? 0.012 : 0.006, i % 6 === 0 ? 0.05 : 0.03, 0.005]} />
        </mesh>
      ))}
      <mesh position={[0.04, 0.06, 0.035]} rotation={[0, 0, -0.6]} material={m.white}>
        <boxGeometry args={[0.012, 0.15, 0.005]} />
      </mesh>
      <mesh position={[0, 0, 0.04]} material={m.steel}>
        <sphereGeometry args={[0.025, 16, 16]} />
      </mesh>
    </group>
  );
}

/** One half of the grinder body (sliced vertically so it can open up). */
function BodyHalf({ side }: { side: 1 | -1 }) {
  const m = useMaterials();
  return (
    <group>
      <mesh material={m.matteBlack} position={[0, BODY_Y, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R_TOP, R_BOT, BODY_H, 64, 1, false, side === 1 ? 0 : Math.PI, Math.PI]} />
      </mesh>
      {/* cut face */}
      <mesh
        material={m.inner}
        position={[0, BODY_Y, 0]}
        rotation={[0, side === 1 ? -Math.PI / 2 : Math.PI / 2, 0]}
      >
        <planeGeometry args={[(R_TOP + R_BOT) * 0.98, BODY_H]} />
      </mesh>
      {/* metal trim bands */}
      {[0.18, -1.58].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={m.steel}>
          <cylinderGeometry
            args={[
              y > 0 ? R_TOP + 0.012 : R_BOT + 0.012,
              y > 0 ? R_TOP + 0.012 : R_BOT + 0.012,
              0.05,
              64,
              1,
              true,
              side === 1 ? 0 : Math.PI,
              Math.PI,
            ]}
          />
        </mesh>
      ))}
      {side === 1 && <Dial angle={0.42} />}
    </group>
  );
}

export function Grinder() {
  const m = useMaterials();
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  const burr = useRef<THREE.Group>(null);
  const pile = useRef<THREE.InstancedMesh>(null);
  const root = useRef<THREE.Group>(null);
  const beanGeo = useMemo(() => createBeanGeometry(16), []);

  const hopperGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const y = 0.55 + (1.5 * i) / 24;
      pts.push(new THREE.Vector2(0.6 + 0.14 * Math.pow(i / 24, 1.4), y));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  // Fill the hopper with beans once.
  const placed = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const e = live.explode;
    const s = story.stage;
    if (root.current) {
      root.current.position.y = live.grinderLift;
      root.current.visible = live.grinderLift < 7.9;
    }
    if (left.current) {
      left.current.position.x = -e * 0.85;
      left.current.rotation.z = e * 0.08;
    }
    if (right.current) {
      right.current.position.x = e * 0.85;
      right.current.rotation.z = -e * 0.08;
    }
    if (top.current) top.current.position.y = e * 0.5;
    if (burr.current) {
      const spin = s > 1.1 && s < 3.4 ? 7 : 0.4;
      burr.current.rotation.y += dt * spin;
    }
    if (pile.current) {
      if (!placed.current) {
        for (let i = 0; i < HOPPER_BEANS; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * 0.5;
          const y = 0.62 + Math.pow(Math.random(), 0.8) * 0.62;
          dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
          dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
          dummy.scale.setScalar(0.11 + Math.random() * 0.02);
          dummy.updateMatrix();
          pile.current.setMatrixAt(i, dummy.matrix);
        }
        pile.current.instanceMatrix.needsUpdate = true;
        placed.current = true;
      }
      // Beans settle as they are ground.
      pile.current.position.y = -0.3 * seg(s, 1.2, 3.2) + Math.sin(state.clock.elapsedTime * 40) * 0.004 * (s > 1.2 && s < 3.2 ? 1 : 0);
    }
  });

  return (
    <group ref={root}>
      <group ref={left}>
        <BodyHalf side={-1} />
      </group>
      <group ref={right}>
        <BodyHalf side={1} />
      </group>

      {/* Burr set, revealed when the body opens */}
      <group ref={burr} position={[0, 0.02, 0]}>
        <mesh rotation={[Math.PI, 0, 0]} material={m.darkSteel} castShadow receiveShadow>
          <coneGeometry args={[0.42, 0.55, 18, 3]} />
        </mesh>
        <mesh position={[0, -0.05, 0]} material={m.darkSteel}>
          <cylinderGeometry args={[0.55, 0.36, 0.3, 24, 1, true]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={m.steel}>
          <torusGeometry args={[0.5, 0.05, 12, 48]} />
        </mesh>
      </group>

      {/* Collar + glass hopper lift away together */}
      <group ref={top}>
        <mesh position={[0, 0.37, 0]} material={m.steel} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.8, 0.32, 64]} />
        </mesh>
        {[0.25, 0.49].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.darkSteel}>
            <torusGeometry args={[0.79, 0.025, 8, 64]} />
          </mesh>
        ))}
        <mesh geometry={hopperGeo} material={m.glass} renderOrder={2} />
        <mesh position={[0, 2.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <torusGeometry args={[0.74, 0.018, 8, 64]} />
        </mesh>
        <instancedMesh ref={pile} args={[beanGeo, m.bean, HOPPER_BEANS]} frustumCulled={false} castShadow receiveShadow />
      </group>
    </group>
  );
}
