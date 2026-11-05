"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMaterials } from "./materials";
import { live } from "./director";

// Spout tip in kettle body coordinates; the kettle pivots around it.
const TIP = new THREE.Vector3(-1.9, 1.1, 0);

/** Gooseneck pour-over kettle plus the hot water stream. */
export function Kettle() {
  const m = useMaterials();
  const outer = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);

  const bodyGeo = useMemo(() => {
    const pts = [
      [0.0001, 0],
      [0.6, 0],
      [0.68, 0.03],
      [0.72, 0.12],
      [0.73, 0.55],
      [0.7, 0.68],
      [0.58, 0.8],
      [0.38, 0.87],
      [0.3, 0.88],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const lidGeo = useMemo(() => {
    const pts = [
      [0.32, 0.87],
      [0.28, 0.9],
      [0.12, 0.96],
      [0.0001, 0.97],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);

  const spoutGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [-0.55, 0.14, 0],
        [-0.95, 0.2, 0],
        [-1.22, 0.48, 0],
        [-1.38, 0.95, 0],
        [-1.55, 1.24, 0],
        [-1.76, 1.24, 0],
        [TIP.x, TIP.y, 0],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    return new THREE.TubeGeometry(curve, 80, 0.045, 14, false);
  }, []);

  const handleGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [0.66, 0.25, 0],
        [1.02, 0.3, 0],
        [1.14, 0.72, 0],
        [0.98, 1.02, 0],
        [0.48, 0.86, 0],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    return new THREE.TubeGeometry(curve, 48, 0.055, 12, false);
  }, []);

  const waterGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.028, 0.034, 1, 16, 1, true);
    g.translate(0, -0.5, 0); // top at 0, extends down to -1
    return g;
  }, []);
  const waterMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e8f1f4",
        roughness: 0.05,
        transparent: true,
        opacity: 0.55,
        clearcoat: 1,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const o = outer.current;
    if (o) {
      o.visible = live.kettleVisible;
      o.position.set(live.kettleX, live.kettleY, 0);
      o.rotation.z = live.kettleTilt;
    }
    const w = water.current;
    if (w) {
      const len = live.waterTop - live.waterBottom;
      w.visible = live.water > 0 && len > 0.01;
      w.position.set(live.kettleX - 0.02, live.waterTop, 0);
      const wob = 1 + Math.sin(state.clock.elapsedTime * 30) * 0.08;
      w.scale.set(wob, Math.max(len, 0.001), wob);
    }
  });

  return (
    <group>
      <group ref={outer}>
        <group rotation={[0, -0.35, 0]}>
          <group position={[-TIP.x * 0.9, -TIP.y * 0.9, 0]} scale={0.9}>
            <mesh geometry={bodyGeo} material={m.steel} castShadow receiveShadow />
            <mesh geometry={lidGeo} material={m.steel} />
            <mesh position={[0, 1.0, 0]} material={m.handleWood}>
              <sphereGeometry args={[0.07, 20, 20]} />
            </mesh>
            <mesh geometry={spoutGeo} material={m.steel} castShadow />
            <mesh geometry={handleGeo} material={m.handleWood} castShadow />
          </group>
        </group>
      </group>
      <mesh ref={water} geometry={waterGeo} material={waterMat} />
    </group>
  );
}
