"use client";

import { useThree } from "@react-three/fiber";
import { EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/** Desktop-only post-processing: contact shadows (AO), filmic tone mapping, anti-aliasing.
 *  Loaded lazily so phones never download it. (No bloom: on a transparent canvas it halos edges.) */
export default function Effects({ high }: { high: boolean }) {
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
