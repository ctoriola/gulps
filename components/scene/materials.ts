import * as THREE from "three";
import { useTextures } from "./textures";
import { getQuality } from "@/lib/quality";

let cache: ReturnType<typeof make> | null = null;

function make() {
  const t = useTextures();
  // Phones skip the extra BRDF lobes (sheen, anisotropy, most clearcoat) that
  // each add a full lighting evaluation per pixel. Reflections stay.
  const m = getQuality().tier === "mobile";
  return {
    bean: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 1,
      roughnessMap: t.beanRough,
      normalMap: t.beanNormal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      clearcoat: m ? 0 : 0.6,
      clearcoatRoughness: 0.28,
      sheen: m ? 0 : 0.5,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#b0703f"),
      envMapIntensity: 1.1,
    }),
    // Powder-coated grinder body.
    matteBlack: new THREE.MeshPhysicalMaterial({
      color: "#1b1918",
      roughness: 0.48,
      metalness: 0.1,
      normalMap: t.powderNormal,
      normalScale: new THREE.Vector2(0.18, 0.18),
      clearcoat: m ? 0 : 0.25,
      clearcoatRoughness: 0.45,
    }),
    gloss: new THREE.MeshPhysicalMaterial({ color: "#0b0a0a", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 }),
    inner: new THREE.MeshStandardMaterial({ color: "#2a2725", roughness: 0.85, metalness: 0.1 }),
    // Brushed stainless steel with anisotropic highlights.
    steel: new THREE.MeshPhysicalMaterial({
      color: "#f2f1ee",
      metalness: 1,
      roughness: 0.3,
      roughnessMap: t.brushedRough,
      normalMap: t.brushedNormal,
      normalScale: new THREE.Vector2(0.12, 0.12),
      anisotropy: m ? 0 : 0.6,
      envMapIntensity: 1.9,
    }),
    darkSteel: new THREE.MeshPhysicalMaterial({
      color: "#9a9792",
      roughness: 0.38,
      metalness: 1,
      flatShading: true,
      anisotropy: m ? 0 : 0.5,
      envMapIntensity: 1.2,
    }),
    white: new THREE.MeshBasicMaterial({ color: "#f2ede4" }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.02,
      metalness: 0,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      specularIntensity: 1,
      envMapIntensity: 2.2,
    }),
    // Glazed hand-thrown ceramic.
    ceramic: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.38,
      normalMap: t.ceramicNormal,
      normalScale: new THREE.Vector2(0.07, 0.07),
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      sheen: m ? 0 : 0.15,
      envMapIntensity: 1.1,
    }),
    handleGlaze: new THREE.MeshPhysicalMaterial({
      color: "#efe7d8",
      roughness: 0.38,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    }),
    grounds: new THREE.MeshStandardMaterial({ color: "#4a2a12", roughness: 0.95, flatShading: true }),
    handleWood: new THREE.MeshPhysicalMaterial({
      color: "#241c17",
      roughness: 0.55,
      clearcoat: m ? 0 : 0.4,
      clearcoatRoughness: 0.4,
    }),
  };
}

export function useMaterials() {
  if (!cache) cache = make();
  return cache;
}
