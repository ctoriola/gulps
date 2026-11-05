"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

export default function SceneMount() {
  return (
    <>
      <div className="scene-layer" aria-hidden="true">
        <Scene />
      </div>
      {/* Photographic finish over the 3D: soft vignette + fine film grain */}
      <div className="lens" aria-hidden="true" />
    </>
  );
}
