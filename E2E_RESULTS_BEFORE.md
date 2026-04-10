# E2E Test Results - Before Fix

Run date: 2026-04-10
Command: npx playwright test
Server mode: production build (npm run build && npm run start)

Note: Dev mode (npm run dev) was unusable due to a Next.js 16.2.1 devtools bug where
`segmentExplorerNodeAdd` crashes with "Cannot read properties of undefined (reading 'hat')"
on the /constructor/hat route. The playwright config was updated to use production mode.

## Summary: 4 passed, 3 failed (out of 7 tests)

## Passed Tests

1. displays initial hat image with default variant (1.2s)
2. switches hat variant and updates preview image (1.3s)
3. switches material and updates active button (1.3s)
4. switches color and updates image src (1.4s)

## Failed Tests

### Test 5: selects logo embroidery and updates image to logo path
- Location: e2e/hat-configurator.spec.ts:108
- Failure: URL encoding mismatch
- Expected: src to contain "/hats/logo/"
- Received: "/_next/image?url=%2Fimages%2Fhats%2Flogo%2Fkolpak-light-gold.png&w=3840&q=75"
- Root cause: Next.js Image component URL-encodes the path. Test checks the encoded `src` attribute for a literal "/" path, but the actual src uses `%2F` encoding.

### Test 6: selects no embroidery and returns to base image
- Location: e2e/hat-configurator.spec.ts:125
- Failure: Same URL encoding mismatch as Test 5
- Expected: src to contain "/hats/logo/" (in the first step before clicking "Без вышивки")
- Received: "/_next/image?url=%2Fimages%2Fhats%2Flogo%2Fkolpak-light-gold.png&w=3840&q=75"
- Root cause: Same as Test 5 - URL-encoded src vs literal path comparison.

### Test 7: monogram with text switches to engraving image
- Location: e2e/hat-configurator.spec.ts:147
- Failure: Strict mode violation - multiple matching elements
- Error: locator('input[type="text"]') resolved to 2 elements:
  1. Monogram input (placeholder="АБ")
  2. Contact form name input (placeholder="Иван")
- Root cause: Test uses generic `input[type='text']` selector which matches both the monogram text field and the contact form name field at the bottom of the page.

## Key Findings

1. The core hat configurator image switching works correctly (variant, material, color all pass).
2. The 3 failures are all test issues, not application bugs:
   - Tests 5 & 6: Need to decode the URL or use `%2F` in expected strings
   - Test 7: Needs a more specific selector for the monogram input
3. The Next.js dev mode has a devtools bug that needs a workaround (use production mode for E2E).
