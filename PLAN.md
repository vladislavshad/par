# Fix hat configurator image switching bug + E2E tests

## Task 1: [ ] Fix HatPreview image transition — URL comparison bug
**File:** src/components/constructor/HatPreview.tsx
**Problem:** When user clicks a different hat variant/color/material, the preview image does not change. Root cause: the preloading useEffect creates a `new Image()`, sets `img.src = imageSrc` (relative URL like `/images/hats/base/kolpak-snow-felt.png`). But after assignment, `img.src` is resolved by the browser to an absolute URL (e.g. `https://domain.com/images/hats/base/kolpak-snow-felt.png`). The onload/onerror callbacks compare `pendingSrcRef.current` (relative) with `img.src` (absolute) — they never match, so `setDisplayedSrc` is never called and the image stays frozen on the initial one. Also `isTransitioning` stays true forever (60% opacity).
**Fix:** Capture the target URL in a local `const targetSrc = imageSrc` before creating the Image. In onload/onerror, compare `pendingSrcRef.current === targetSrc` (both relative). When matched, call `setDisplayedSrc(targetSrc)` and `setIsTransitioning(false)`. This ensures the comparison uses the same URL format. Do NOT change `img.src` to absolute — just fix the comparison logic.

## Task 2: [ ] Install and configure Playwright for E2E testing
**File:** package.json, playwright.config.ts
**Problem:** No E2E test infrastructure exists in the project.
**Fix:**
1. Run `npm install -D @playwright/test` and `npx playwright install chromium`
2. Create `playwright.config.ts` with:
   - baseURL: `http://localhost:3000`
   - webServer config to run `npm run dev` automatically
   - Use chromium only for speed
   - Set timeout to 30s
3. Add to package.json scripts: `"test:e2e": "playwright test"`, `"test:e2e:ui": "playwright test --ui"`
4. Create `e2e/` directory for test files

## Task 3: [ ] Write E2E tests for hat configurator — variant switching
**File:** e2e/hat-configurator.spec.ts
**Problem:** No automated tests verify hat configurator functionality.
**Fix:** Write Playwright tests that:
1. Navigate to `/constructor/hat`
2. Verify initial hat image is displayed (check img src contains expected variant)
3. Click each hat variant (Колпак, Будёновка, Ушанка, Панама) and verify:
   - The active variant button has gold border (border-gold class)
   - The preview image src changes to match the new variant
4. Click different materials and verify the active material button changes
5. Click different colors and verify image src includes the color name
6. Test embroidery type switching: click "Логотип ПАРЪ", verify logo image path is used
7. Test that "Без вышивки" → base image, "Монограмма" with text → engraving image
Use `page.waitForFunction` or polling to check image src changes (since preloading is async).
Add reasonable timeouts. Tests must pass with `npm run test:e2e`.
