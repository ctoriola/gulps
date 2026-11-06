# Gulpsee Coffee website

A scroll-driven, real-time 3D story for Gulpsee. Scrolling takes one coffee bean through the whole brew:

0. **Bean** (hero): a 3D coffee bean that follows your mouse
1. **Grind**: the bean drops into a burr grinder full of beans
2. **Ground**: the grinder opens up and fresh grounds stream out
3. **Into the cup**: the grounds pile into a hand-thrown ceramic cup
4. **Pour**: a gooseneck kettle pours hot water, the cup fills with coffee and steam rises
5. **Sip**: the "Find your cup" shop with coffee bags, then the drinks menu and the footer

All 3D models are built in code (Three.js through React Three Fiber), so there are no model files to download.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start   # production
```

Deploy: push to GitHub and import the repo on Vercel. No settings are needed.

## Where things live

| What | File |
| --- | --- |
| Page sections and copy | `app/page.tsx` |
| Styles, colours, fonts | `app/globals.css`, `app/layout.tsx` |
| Coffees (Pairings) and drinks with prices (₦) | `lib/products.ts` |
| Shop facts, gallery, Pairings reveal, Unnamed Menu drink | `lib/content.ts` (null = not known yet; the sentence that needs it stays hidden) |
| QR landing page for the Unnamed Menu | `app/reveal/page.tsx` (URL: `/reveal`) |
| Cart (saved in the browser) | `lib/cart.tsx`, `components/CartDrawer.tsx` |
| Scroll → stage mapping | `components/StoryTracker.tsx` |
| Animation timeline (camera, timings) | `components/scene/director.ts` |
| 3D models | `components/scene/*.tsx`, `components/scene/geometry.ts` |
| Logo files | `public/brand/` |

## Changing the animation

The story is **scroll-triggered**, not scroll-scrubbed. Scrolling about a fifth of the way into the next section fires that step, and it then plays by itself as a timed animation. Scrolling back past that point plays it in reverse.

- Trigger point and step durations: `TRIGGER` and `STEP_SECONDS` in `components/StoryTracker.tsx`
- What happens during each step: `components/scene/director.ts`. The story position `s` moves smoothly from one step number to the next (for example 1 → 2), and each motion is written as `seg(s, start, end)`. For example, `seg(s, 1.15, 1.75)` makes the grinder open in the first half of the Grind → Ground step.

## Online ordering (next steps)

The cart already works and saves in the browser. To take real orders:
1. Move `lib/products.ts` into a Supabase table.
2. Add a checkout route (`app/api/checkout/route.ts`) that creates a Paystack transaction.
3. Save each order to Supabase after the Paystack webhook confirms payment.
4. Optional: send new-order alerts to WhatsApp or email through n8n.
