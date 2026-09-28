# Saksiri v1.9 — 3D Cinematic Depth

This version adds a stronger cinematic 3D treatment using GSAP perspective transforms, layered depth motion, pointer parallax, camera-like push/pull transitions, and animated glass typography. It does not use the generated composite hero artwork.

# Saksiri Riverside Boutique Hotel — Cinematic Trial v1.4

This version focuses on a reliable cinematic scroll experience:
- 7 distinct hotel/Laos scenes, each with its own clear image.
- Images are preloaded before the scroll sequence starts to prevent blank panels.
- High-resolution remote photography with a fallback image if a source fails.
- Premium floating navigation with numbered sections and mobile overlay menu.
- Expanded Saksiri Concierge knowledge and conversation handling.
- OpenAI Responses API support through `OPENAI_API_KEY` and `OPENAI_MODEL`.

## Important
The photography is sourced from public hotel/listing imagery for the trial concept. For production, replace these URLs with hotel-approved/local image assets.

## AI concierge
Set on Vercel:
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini

Without an API key the site uses a deterministic hotel-specific fallback; it is not a real LLM.


## v1.5 image clarity update
- Replaced the previous soft destination hero with a clear hotel/pool image.
- Every cinematic scene has a distinct high-resolution hotel/property image.
- Reduced large image scaling during scroll to preserve sharpness.
- Removed compositor-heavy image transforms that could make photographs appear soft while scrolling.


### v1.7 opening hero
The opening scene now uses clean hotel photography as the visual layer only. The Saksiri brand, navigation, headline, supporting copy and booking CTA are all real HTML elements rendered by the website. The previous composite hero artwork with baked-in typography/navigation has been removed. Scene zoom remains close to 1:1 to keep photography crisp.


## v1.7 hero correction
The opening hero now uses clean hotel photography as a visual layer only. Branding, navigation, title, description and CTA are rendered as real HTML UI; no text or navigation is baked into the hero image. The previous generated composite hero artwork has been removed.

## v1.8 immersive copy update
- Reworked the hero and scene language toward a more restrained, premium hospitality tone.
- Added translucent glass copy panels behind the typography so the text feels integrated with the photography rather than pasted on top.
- The glass panel fades, lifts and subtly scales with each scene transition.
- Scene headlines reveal word-by-word with a soft blur-to-sharp animation tied to the cinematic scroll.
- Added a subtle editorial divider/brand mark to scene cards.
- The hero CTA now reads “DISCOVER SAKSIRI” and uses the same restrained glass treatment.

## v1.9 refinement — editorial opening + persistent navigation
- Opening hero typography now follows the supplied visual direction: oversized editorial Saksiri title, compact Vang Vieng kicker, cinematic supporting line and glass CTA.
- Hero artwork remains clean photography only; no text or navigation is baked into the image.
- Main navigation is fixed to the viewport so it remains visible while the cinematic hero is scrolling/pinned and after the hero.
- Opening copy now reveals in a smoother staged sequence: kicker → title → description → CTA.

## v1.9.1 scene storytelling update
- Fixed the scene-copy indexing so each image transition receives the correct place description.
- Added bold, high-contrast scene titles and readable supporting copy.
- Added a darker glass panel with blur and border treatment for legibility over photography.
- Scene labels now explicitly identify ARRIVE, POOL, STAY, PAUSE, DINE, EXPLORE and RETURN locations.
- The opening editorial hero remains separate from the cinematic scene descriptions.


## v1.9.2 reliability fix
- ScrollTrigger no longer waits for all remote images before initializing.
- Scene copy is explicitly synchronized to the arriving panel.
- The first scene description is revealed during the opening sequence.
- Images trigger ScrollTrigger refresh as they finish loading, with resize/visibility refreshes.
- This prevents scene text from requiring a browser reload to appear.


v1.9.5 restoration: returned to the v1.9.2 cinematic layout/animation system. Every one of the 7 cinematic scenes retains its own editorial kicker, title, description and mark, synchronized to that scene's transition. No panel-nesting redesign was introduced. Added explicit word spacing so animated title words never visually run together.


## v1.9.6 — premium 3D scene transitions
- Restores and strengthens the cinematic 3D camera/depth transition between every image.
- Each scene keeps its own editorial kicker, title, paragraph and Saksiri mark.
- Incoming images travel from a separate Z-depth plane with restrained yaw/scale; outgoing images pull back.
- Scene copy enters on its own depth layer with word-by-word reveal.
- No baked-in branding or text is placed inside the photography.

## v2.0 cinematic rebuild
A full visual rebuild: cinematic entry, editorial typography, seven scene-specific image/story pairings, layered 3D camera transitions, pointer parallax, glass storytelling cards, fixed navigation and concierge UI. The scene text is synchronized to the image that is currently arriving.
