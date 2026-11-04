import * as THREE from "three";

let cache: ReturnType<typeof make> | null = null;

function make() {
  return {
    bean: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.38,
      clearcoat: 0.55,
      clearcoatRoughness: 0.35,
      sheen: 0.4,
      sheenColor: new THREE.Color("#b0703f"),
    }),
    matteBlack: new THREE.MeshStandardMaterial({ color: "#1c1a19", roughness: 0.55, metalness: 0.25 }),
    gloss: new THREE.MeshPhysicalMaterial({ color: "#0d0c0c", roughness: 0.15, clearcoat: 1 }),
    inner: new THREE.MeshStandardMaterial({ color: "#2a2725", roughness: 0.85, metalness: 0.1 }),
    steel: new THREE.MeshStandardMaterial({ color: "#e4e2df", roughness: 0.2, metalness: 0.9, envMapIntensity: 1.6 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: "#8d8a86", roughness: 0.32, metalness: 1, flatShading: true }),
    white: new THREE.MeshBasicMaterial({ color: "#f2ede4" }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
      clearcoat: 1,
      specularIntensity: 1,
    }),
    ceramic: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.32,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
    }),
    handleGlaze: new THREE.MeshPhysicalMaterial({ color: "#efe7d8", roughness: 0.3, clearcoat: 0.8 }),
    grounds: new THREE.MeshStandardMaterial({ color: "#4a2a12", roughness: 1, flatShading: true }),
    handleWood: new THREE.MeshStandardMaterial({ color: "#2a211b", roughness: 0.6 }),
  };
}

export function useMaterials() {
  if (!cache) cache = make();
  return cache;
}
