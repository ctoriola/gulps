import type Lenis from "lenis";

// The page's smooth-scroll instance (desktop only), shared with the cart drawer etc.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (instance = l);
export const getLenis = () => instance;
