"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
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

/** Softbox-style key light that travels with the camera and casts soft shadows. */
function KeyLight() {
  const light = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    if (l.target.parent !== scene) scene.add(l.target);
    l.position.set(live.offsetX - 2, live.camY + 8, 4);
    l.target.position.set(live.offsetX, live.camY - 1, 0);
  });
  return (
    <directionalLight
      ref={light}
      intensity={2.2}
      color="#fff0dc"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
      shadow-camera-left={-4.5}
      shadow-camera-right={4.5}
      shadow-camera-top={4.5}
      shadow-camera-bottom={-4.5}
      shadow-camera-near={0.5}
      shadow-camera-far={20}
    />
  );
}

/** Post-processing: contact shadows (AO), filmic tone mapping, anti-aliasing. (Bloom is left out: on a transparent canvas it adds halos around edges.) */
function Effects({ high }: { high: boolean }) {
  const size = useThree((s) => s.size);
  const small = size.width < 760;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={0.45} distanceFalloff={0.6} intensity={high ? 2.4 : 1.8} quality={high ? "medium" : "performance"} halfRes={!high || small} color="#2b1808" />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <SMAA />
    </EffectComposer>
  );
}

/** Mounts only after every suspended asset (HDRI) has loaded, then reveals the canvas. */
function Ready() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => gl.domElement.parentElement?.closest(".scene-layer")?.classList.add("ready"));
    });
    return () => cancelAnimationFrame(raf);
  }, [gl]);
  return null;
}

export default function Scene() {
  const [high, setHigh] = useState(true);
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.75]}
      shadows
      camera={{ fov: 35, position: [0, 4.2, 10], near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <PerformanceMonitor onDecline={() => setHigh(false)} />
      <SoftShadows size={28} samples={high ? 12 : 6} focus={0.6} />
      <Director />

      {/* Lighting: real photo-studio HDRI for reflections, plus warm softboxes. */}
      <ambientLight intensity={0.15} color="#ffe8d2" />
      <KeyLight />
      <directionalLight position={[5, 2, 4]} intensity={0.55} color="#ffd9b3" />
      <directionalLight position={[0, 3, -6]} intensity={0.9} color="#fff4e6" />
      <Environment files="/hdri/studio_small_09_1k.hdr" environmentIntensity={0.85} resolution={512}>
        <Lightformer form="rect" intensity={2.5} color="#ffe0bd" position={[-5, 2, 3]} rotation-y={Math.PI / 2.5} scale={[4, 6, 1]} />
        {/* big overhead + front softboxes so polished steel reads bright, not dark */}
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#fff6ec" position={[0, 1, 7]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#c98a62" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>

      <Root>
        <Beans />
        <Grinder />
        <Grounds />
        <Cup />
        <Kettle />
      </Root>

      <Effects high={high} />
      <Ready />
    </Canvas>
  );
}
