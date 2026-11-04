# Gulpsee scroll film: Google Flow prompts

Five 8-second clips (40 seconds in total) that join into one continuous shot. Each clip matches one section of the website.

## Settings

- **Model:** Veo 3.1 (Quality) if available, otherwise Veo 3 Quality. Quality gives better detail than Fast.
- **Aspect ratio:** 16:9 landscape for the desktop site. If Flow offers 9:16, make a second set for phones; otherwise I will crop the centre.
- **Clip length:** 8 seconds each. 5 clips = 40 seconds in total.
- **Outputs per prompt:** 2 to 4. Pick the most consistent one before moving on.
- **Resolution:** Download in 1080p (use Flow's upscale option).
- **Audio:** Not needed. The site plays the video silently.

## Workflow

1. Open labs.google/flow and sign in with the Google account that has your Gemini / Google AI plan.
2. Click New project and name it Gulpsee Scroll Film.
3. Open the settings and set the model, 16:9 aspect ratio and number of outputs (see the settings table).
4. Choose Text to Video.
5. Paste the full Clip 1 prompt (style block plus timeline) and generate.
6. Watch every result. Check: one continuous shot, no text, cream background, bean centred.
7. If none is right, change one sentence of the timeline and regenerate. Do not rewrite the style block.
8. Add the best Clip 1 to Scenebuilder.
9. In Scenebuilder, click + after Clip 1 and choose Extend.
10. Paste the full Clip 2 prompt and generate. Extend continues from Clip 1's last frame, so the shot stays seamless.
11. If Extend is not available, save Clip 1's last frame as an image, choose Frames to Video, upload it as the start frame and paste the Clip 2 prompt.
12. Pick the best Clip 2 and keep it in Scenebuilder.
13. Repeat steps 9 to 12 for Clips 3, 4 and 5.
14. Play the whole sequence from the start. Check that the cup, grinder and kettle look the same in every clip.
15. If one clip does not match, regenerate only that clip. Keep the clips on either side of it.
16. Download the full Scenebuilder sequence as one MP4 at 1080p.
17. Also download the 5 individual clips as backup.
18. Send me the MP4s (upload them here or commit them to the repo in /media-source).

## Style block (already included in every prompt)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.
```

## Clip 1 - The bean (hero) (0:00 - 0:08)

Mode: Text to Video (fresh start)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.

Scene: A single glossy dark-roasted coffee bean floats in mid-air, rotates, then begins to fall.

Timeline:
[0-1s] A single large, glossy, dark-roasted coffee bean floats in the centre of the frame, its S-shaped crease facing the camera.
[1-2s] The bean slowly rotates on its vertical axis. Soft light glints across its oily surface.
[2-3s] It keeps rotating, showing its rounded back, then the crease again. Tiny surface texture is visible.
[3-4s] The bean bobs gently up and down as if weightless, still rotating slowly.
[4-5s] The rotation slows and the bean tilts slightly forward.
[5-6s] The bean begins to drop downward. The camera tilts down smoothly to follow it.
[6-7s] A few more coffee beans tumble down from above the top of the frame behind it.
[7-8s] The open top of a glass coffee grinder hopper rises into view at the bottom of the frame. The falling beans head towards it.
```

## Clip 2 - The grinder (0:08 - 0:16)

Mode: Extend (or Frames to Video using Clip 1's last frame)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.

Scene: The beans land in the glass hopper; the camera pulls back to reveal the whole grinder.

Timeline:
[0-1s] Coffee beans fall into the open glass hopper and land on a pile of glossy roasted beans.
[1-2s] The last beans bounce and settle into the pile.
[2-3s] The camera slowly pulls back and tilts down to reveal the whole coffee grinder.
[3-4s] Full grinder in the centre of the frame: a tall matte-black cylindrical body, a round black dial with white tick marks on the front, a brushed-steel collar, and a clear glass hopper full of beans on top.
[4-5s] The grinder sits still. Light glides across the steel collar and the glass hopper.
[5-6s] The grinder switches on. The beans in the hopper vibrate gently.
[6-7s] The bean level in the hopper slowly sinks as the beans are drawn into the grinder.
[7-8s] The grinder keeps humming, centred in frame. End on a clean, steady shot of the whole grinder.
```

## Clip 3 - Ground coffee (0:16 - 0:24)

Mode: Extend (or Frames to Video using Clip 2's last frame)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.

Scene: The grinder splits open in an exploded view and a stream of fresh grounds pours out.

Timeline:
[0-1s] The black grinder is centred in the frame. A fine vertical seam appears down the middle of its body.
[1-2s] The body splits into two halves that slowly slide apart to the left and right, floating in mid-air.
[2-3s] The glass hopper and steel collar lift slowly upward and float above. This is a clean exploded product view.
[3-4s] In the centre, a conical steel burr is revealed, spinning.
[4-5s] The first fine coffee grounds sprinkle out from the bottom of the spinning burr.
[5-6s] The grounds become a steady, slightly wavy stream falling straight down.
[6-7s] Close detail: thousands of tiny brown coffee grounds tumble through the air, softly backlit, with fine coffee dust.
[7-8s] The exploded grinder floats steadily while the stream of grounds keeps pouring down out of the bottom of the frame.
```

## Clip 4 - Into the cup (0:24 - 0:32)

Mode: Extend (or Frames to Video using Clip 3's last frame)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.

Scene: The camera follows the stream of grounds down into a ceramic cup.

Timeline:
[0-1s] The camera begins a smooth tilt downward, following the falling stream of coffee grounds.
[1-2s] Grounds tumble past the lens in a continuous stream.
[2-3s] A handmade ceramic coffee cup rises into view at the bottom of the frame: glossy cream glaze dripping over an unglazed terracotta base, with a small handle.
[3-4s] The camera arrives slightly above the cup, looking down into it at a 30-degree angle. The cup is centred.
[4-5s] The stream of grounds lands inside the cup with a soft puff of coffee dust.
[5-6s] The grounds pile up into a small mound at the bottom of the cup.
[6-7s] The stream thins out and the last few particles fall.
[7-8s] The stream stops. The cup sits centred and still, with a mound of fresh coffee grounds inside.
```

## Clip 5 - Hot water (0:32 - 0:40)

Mode: Extend (or Frames to Video using Clip 4's last frame)

```
Photorealistic premium coffee commercial with a clean 3D studio render look. Seamless warm cream backdrop (soft beige, like oat milk) with a gentle vignette, no horizon line, no table, no props. Soft diffused key light from the upper left, warm fill light, soft contact shadows. 50mm lens, shallow depth of field, crisp focus on the subject. Subject stays in the middle third of the frame with generous empty cream space on both sides. Colour palette: espresso brown, cream, terracotta, brushed steel, matte black. One single continuous shot, no cuts, no transitions, slow and smooth motion, no camera shake. Avoid: text, logos, labels, watermarks, people, hands, extra objects.

Scene: A gooseneck kettle pours hot water; the cup fills with coffee and steam rises.

Timeline:
[0-1s] The cup of coffee grounds is centred. A brushed-steel gooseneck pour-over kettle with a black handle glides in from the right side of the frame.
[1-2s] The kettle stops above and to the right of the cup and tilts forward.
[2-3s] A thin, clear stream of hot water pours from the curved spout into the centre of the cup.
[3-4s] The water hits the grounds. Dark coffee forms and rises, and steam begins to curl up.
[4-5s] The cup fills with rich dark coffee and a caramel-coloured crema ring forms on the surface.
[5-6s] The pour stops. The kettle tilts back and glides out of the frame to the right.
[6-7s] The cup slowly rotates so its handle faces right. Soft wisps of steam rise from the full cup.
[7-8s] Final hero shot: a full cup of coffee centred on the cream backdrop, gentle steam rising, perfectly still. Hold this frame.
```

## Fixes

- **The video cuts to a new angle:** Add 'single continuous shot, no cuts' again at the end of the timeline.
- **Text or a logo appears:** Regenerate. Keep the Avoid line. Do not mention 'Gulpsee' in the prompt.
- **The cup or grinder changes design between clips:** Use Extend or a start frame, and copy the exact object description word for word into each clip.
- **The background turns grey or dark:** Add 'bright warm cream backdrop, high-key lighting' to the timeline.
- **Motion is too fast:** Add 'slow motion, unhurried' to the beat that is too fast.
- **A hand or person appears:** Add 'the object moves on its own' to that beat.

## What happens after

1. I convert the 40-second MP4 into about 400 compressed image frames (WebP) for desktop and a lighter set for phones.
2. I replace the live 3D scene with a scroll-scrubbed frame player. Scrolling forward plays the film, and scrolling back rewinds it.
3. Each section (Bean, Grind, Ground, Cup, Pour) is pinned to its 8-second slice of the film, so the text matches the action.
4. I match the site's background colour to the video's cream so the edges blend in.
5. The shop, menu and cart stay exactly as they are.
6. The current 3D version stays in the code as a fallback, so you can switch between the two.
