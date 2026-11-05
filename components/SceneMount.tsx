"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const loadScene = () => import("./scene/Scene");
const Scene = dynamic(loadScene, { ssr: false });

export default function SceneMount() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    // Start downloading the 3D code immediately...
    loadScene();
    // ...but only build the scene (geometry, textures, shaders) once the browser
    // is idle, so it never competes with the first paint or the first touch.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMount(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setMount(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div className="scene-layer" aria-hidden="true">
        {mount && <Scene />}
      </div>
      {/* Photographic finish over the 3D: soft vignette + fine film grain (desktop) */}
      <div className="lens" aria-hidden="true" />
    </>
  );
}
