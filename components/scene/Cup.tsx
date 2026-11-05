"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCremaTexture, createCupGeometry, createSoftTexture, cupInner } from "./geometry";
import { useMaterials } from "./materials";
import { live } from "./director";
import { getQuality } from "@/lib/quality";

const PUFFS = 7;

export function Cup() {
  const m = useMaterials();
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mound = useRef<THREE.Mesh>(null);
  const liquid = useRef<THREE.Mesh>(null);
  const steam = useRef<THREE.Group>(null);

  const cupGeo = useMemo(() => createCupGeometry(), []);
  const crema = useMemo(() => createCremaTexture(), []);
  const soft = useMemo(() => createSoftTexture(), []);

  const moundGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const n = 1 + 0.12 * Math.sin(p.getX(i) * 31) * Math.cos(p.getZ(i) * 27);
      p.setY(i, p.getY(i) * n);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const liquidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: crema,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    [crema],
  );

  const steamMats = useMemo(
    () =>
      Array.from(
        { length: PUFFS },
        () =>
          new THREE.MeshBasicMaterial({
            map: soft,
            transparent: true,
            depthWrite: false,
            opacity: 0,
            color: "#ffffff",
          }),
      ),
    [soft],
  );

  const shadowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: soft,
        transparent: true,
        depthWrite: false,
        color: "#3a2410",
        opacity: 0.35,
      }),
    [soft],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.position.set(live.cupX, live.cupY, 0);
    g.scale.setScalar(live.cupScale);
    g.visible = live.s > 1.6;
    if (spin.current) spin.current.rotation.y = live.cupRotY;

    const gl = live.groundsLevel;
    if (mound.current) {
      const r = cupInner(gl) * 0.97;
      mound.current.visible = live.s > 2.1 && live.liquid < 1;
      mound.current.position.y = gl - 0.04;
      mound.current.scale.set(r, 0.07 + 0.05 * (gl - 0.1) * 4, r);
    }
    if (liquid.current) {
      const r = cupInner(live.liquidLevel) * 0.995;
      liquid.current.visible = live.liquid > 0;
      liquid.current.position.y = live.liquidLevel;
      liquid.current.scale.set(r, r, r);
      liquid.current.rotation.z = t * 0.15;
    }
    if (steam.current) {
      steam.current.children.forEach((c, i) => {
        const ph = (t * 0.22 + i / PUFFS) % 1;
        c.position.set(Math.sin(t * 0.8 + i * 1.7) * 0.12 * ph, 1.05 + ph * 1.1, Math.cos(i * 2.3) * 0.08);
        c.scale.setScalar(0.35 + ph * 0.6);
        c.quaternion.copy(state.camera.quaternion);
        steamMats[i].opacity = Math.sin(Math.PI * ph) * 0.08 * live.steam;
      });
    }
  });

  return (
    <group ref={group}>
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.036, 0]} material={shadowMat}>
        <planeGeometry args={[1.6, 1.6]} />
      </mesh>
      {/* invisible floor that only shows the cast shadow (desktop: phones have no shadow maps,
          so this full-size transparent plane would cost fill-rate for nothing) */}
      {getQuality().tier === "desktop" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
          <planeGeometry args={[6, 6]} />
          <shadowMaterial transparent opacity={0.18} color="#3a2410" />
        </mesh>
      )}
      <group ref={spin}>
        <mesh geometry={cupGeo} material={m.ceramic} castShadow receiveShadow />
        {/* handle */}
        <mesh position={[0.62, 0.55, 0]} rotation={[0, 0, -Math.PI / 2 - 0.15]} material={m.handleGlaze} castShadow receiveShadow>
          <torusGeometry args={[0.21, 0.05, 16, 40, Math.PI * 1.15]} />
        </mesh>
        <mesh ref={mound} geometry={moundGeo} material={m.grounds} receiveShadow />
        <mesh ref={liquid} rotation={[-Math.PI / 2, 0, 0]} material={liquidMat}>
          <circleGeometry args={[1, 64]} />
        </mesh>
      </group>
      <group ref={steam}>
        {steamMats.map((mat, i) => (
          <mesh key={i} material={mat}>
            <planeGeometry args={[1, 1]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
