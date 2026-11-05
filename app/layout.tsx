import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gulpsee Coffee · Lagos",
  description: "From bean to cup. Freshly ground specialty coffee, poured by hand in Lagos.",
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Start downloading the studio lighting while the JS loads (phones get a 4x smaller file).
            Media queries match MOBILE_MEDIA in lib/quality.ts. */}
        <link rel="preload" href="/hdri/studio_small_09_512.hdr" as="fetch" crossOrigin="anonymous" media="(pointer: coarse), (max-width: 819px)" />
        <link rel="preload" href="/hdri/studio_small_09_1k.hdr" as="fetch" crossOrigin="anonymous" media="(pointer: fine) and (min-width: 820px)" />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
