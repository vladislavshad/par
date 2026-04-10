# PLAN: Fix Hat Configurator Image Switching Bugs

## Context
Users reported two bugs on `/constructor/hat`:
1. **Embroidery type switch changes hat shape.** When changing from "none" to "logo" or "monogram/name/phrase", the hat appears to change shape even though variantId stays the same. Root cause: HatPreview.tsx switches between completely different image sets (base/, logo/, engraving/) that were generated separately with inconsistent hat appearances.
2. **Color switch inconsistency.** Cream and anthracite show the same hat shape, but snow/white shows a different one. Root cause: the base images (e.g. `kolpak-cream-felt.png` vs `kolpak-snow-felt.png`) were AI-generated separately and are visually inconsistent.

## Key Files
- `src/components/constructor/HatPreview.tsx` — main preview component, currently swaps entire image
- `src/components/constructor/HatOptionsPanel.tsx` — controls for hat options
- `src/store/useConstructor.ts` — Zustand store
- `src/data/products.ts` — product definitions, embroidery types/colors
- `public/images/hats/base/` — base hat images (per variant/color/material)
- `public/images/hats/logo/` — logo images (per variant/tone/thread)
- `public/images/hats/engraving/` — engraving images (per variant/tone/thread/position)

## Tasks

### Task 1: Refactor HatPreview to layered approach
**Goal:** Always show the base image as the primary hat photo. Overlay embroidery visuals on TOP using CSS, not by swapping the entire image.

Changes to `HatPreview.tsx`:
- [x] Always use `getBaseImage(variantId, colorId, materialId)` as the displayed `<Image>` src
- [x] For `engravingTypeId === "logo"`: overlay a ПАРЪ text/badge positioned on the hat using absolute positioning + CSS (e.g., gold "ПАРЪ" text with drop-shadow, positioned at center of hat)
- [x] For custom engraving (monogram/name/phrase): overlay the user's text `config.engraving` with the selected font and color on the hat using absolute positioning (similar to what ItemCustomizer already does with the `<span>` overlay)
- [x] Remove the logo/engraving image switching logic (getLogoImage, getEngravingImage are no longer used for display)
- [x] Keep the preload/transition logic for base image changes only (variant, color, material switches)

**Acceptance:** Switching embroidery type (none → logo → monogram → name → phrase) does NOT change the hat photo. Only overlay text/badge appears/disappears.

### Task 2: Ensure visual consistency of base images across colors
**Goal:** Verify that base images for the same variant look visually consistent across all 3 colors (snow, cream, anthracite).

- List all base images per variant: `kolpak-{snow,cream,anthracite}-{felt,premium,merino,fetr}.png`
- Check file sizes — if they're identical or wildly different, note it
- If images are missing for any color/material combo, create placeholder by copying the closest existing one
- Document findings

**Acceptance:** All variant/color/material combos have a base image. No 404s on the page.

### Task 3: Simplify image preloading
**Goal:** Clean up the preloading logic in HatPreview since we now only switch base images.

- The useEffect with `new Image()` preloading should only fire when `baseImage` changes
- Remove `isTransitioning` complexity if not needed — or keep it simple for smooth transitions
- Make sure rapid clicking between colors/materials/variants doesn't cause stale image display

**Acceptance:** Rapid switching between variants/colors/materials always shows the correct base image. No stale images displayed.

### Task 4: Update embroidery overlay styling
**Goal:** Make the CSS overlays for logo and custom text look polished and realistic.

For logo overlay:
- Gold "ПАРЪ" text, positioned at ~60% from top, centered horizontally
- Font: serif, bold, ~24px with text-shadow for embroidery effect
- Subtle shadow/glow to simulate thread texture

For custom text overlay:
- Use `config.engravingFont` CSS class
- Use `config.engravingColorId` hex color from EMBROIDERY_COLORS
- Position based on `config.engravingPositionId` (front-center → centered, front-side → offset left)
- Size based on text length (monogram = larger, phrase = smaller)

**Acceptance:** Overlays look intentional and polished, not like a debugging label.

### Task 5: Build + lint + E2E tests
**Goal:** Verify everything works.

- `npm run build` must pass
- Lint must pass (if configured)
- Write E2E tests in `e2e/hat-configurator.spec.ts`:
  1. Navigate to `/constructor/hat`
  2. Select a hat variant (e.g., budenovka)
  3. Switch embroidery type from "none" to "logo" → verify the base image src still contains the selected variant name
  4. Switch to "monogram", type "АБ" → verify base image src unchanged, overlay text visible
  5. Switch color from snow to anthracite → verify base image src updates with new color
  6. Switch back to "none" → verify overlay disappears, base image still correct

**Acceptance:** All E2E tests pass. Build clean.
