"use client";

import { EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/** Desktop-only post-processing: contact shadows (AO), filmic tone mapping, anti-aliasing.
 *  Loaded lazily so phones never download it. (No bloom: on a transparent canvas it halos edges.) */
export default function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {/* Half-resolution AO with depth-aware upsampling: ~4x cheaper, visually the same. */}
      <N8AO aoRadius={0.45} distanceFalloff={0.6} intensity={2.4} quality="medium" halfRes depthAwareUpsampling color="#2b1808" />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <SMAA />
    </EffectComposer>
  );
}
