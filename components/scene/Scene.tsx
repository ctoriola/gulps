"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { damp } from "@/lib/anim";
import { story } from "@/lib/story";
import { computeLive, live } from "./director";
import { Beans } from "./Beans";
import { Grinder } from "./Grinder";
import { Grounds } from "./Grounds";
import { Cup } from "./Cup";
import { Kettle } from "./Kettle";

/** Smooths the scroll stage and moves the camera. Mounted first so every
 *  other object reads this frame's values. */
function Director() {
  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    story.stage = damp(story.stage, story.target, 5, d);
    if (Math.abs(story.stage - story.target) < 0.0005) story.stage = story.target;
    computeLive(story.stage, state.size.width / state.size.height);
    const cam = state.camera;
    cam.position.set(0, live.camY + live.camLift, live.camZ);
    cam.lookAt(0, live.camY, 0);
  });
  return null;
}

function Root({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    g.position.x = live.offsetX;
    g.rotation.y = damp(g.rotation.y, story.pointerX * 0.12, 3, d);
    g.rotation.x = damp(g.rotation.x, story.pointerY * 0.04, 3, d);
  });
  return <group ref={ref}>{children}</group>;
}

export default function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [0, 4.2, 10], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Director />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 6, 6]} intensity={2.4} color="#fff1df" />
      <directionalLight position={[5, 2, 4]} intensity={0.9} color="#ffd9b3" />
      <directionalLight position={[0, -3, 5]} intensity={0.35} color="#f5e6d3" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -4]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffe2c4" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="circle" intensity={2.5} position={[0, 6, 4]} scale={3} />
        <Lightformer form="rect" intensity={0.8} color="#c98a62" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
      <Root>
        <Beans />
        <Grinder />
        <Grounds />
        <Cup />
        <Kettle />
      </Root>
    </Canvas>
  );
}
