# Diagnosis of E2E Test Failures

Run date: 2026-04-10
Total: 4 passed, 3 failed (out of 7 tests)

---

## Failure 1: "selects logo embroidery and updates image to logo path"

**Location:** e2e/hat-configurator.spec.ts:108

**Observed behavior:** Test clicks "Логотип ПАРЪ" button, then checks that `img[alt='Банная шапка']` src attribute contains the literal string `/hats/logo/`. The assertion times out.

**Actual src value:**
```
/_next/image?url=%2Fimages%2Fhats%2Flogo%2Fkolpak-light-gold.png&w=3840&q=75
```

**Root cause:** Next.js `<Image>` component rewrites the `src` attribute to use its image optimization endpoint (`/_next/image?url=...`). The original path (`/images/hats/logo/...`) is URL-encoded with `%2F` instead of `/`. The test checks for the literal substring `/hats/logo/` which does not appear in the percent-encoded URL.

**This is a test bug, not an application bug.** The image does correctly switch to the logo path.

**Proposed fix:** Decode the src before asserting, or check for the encoded form `%2Fhats%2Flogo%2F`. Decoding is cleaner:
```ts
const src = await img.getAttribute("src");
const decoded = decodeURIComponent(src || "");
expect(decoded).toContain("/hats/logo/");
```

---

## Failure 2: "selects no embroidery and returns to base image"

**Location:** e2e/hat-configurator.spec.ts:125

**Observed behavior:** Same as Failure 1. The first assertion (checking logo path after clicking "Логотип ПАРЪ") fails with the same URL-encoding mismatch before the test even gets to click "Без вышивки".

**Root cause:** Identical to Failure 1 — literal `/hats/logo/` does not match URL-encoded `%2Fhats%2Flogo%2F`. The second assertion checking `/hats/base/` would also fail for the same reason.

**This is a test bug, not an application bug.**

**Proposed fix:** Apply `decodeURIComponent()` to src before all path assertions in this test (both the logo check and the base check).

---

## Failure 3: "monogram with text switches to engraving image"

**Location:** e2e/hat-configurator.spec.ts:147

**Observed behavior:** After clicking "Монограмма", the test tries to fill text into `input[type='text']`. Playwright's strict mode rejects this because the selector matches 2 elements:
1. The monogram input (placeholder="АБ", maxlength=3)
2. A contact form name input (placeholder="Иван") lower on the page

**Root cause:** The selector `input[type='text']` is too generic. It matches both the monogram text field in the embroidery section and a contact form input at the bottom of the page.

**This is a test bug, not an application bug.**

**Proposed fix:** Use a more specific selector. The monogram input has `placeholder="АБ"`, so:
```ts
const input = page.locator("input[placeholder='АБ']");
```
Or use Playwright's recommended role-based locator:
```ts
const input = page.getByRole('textbox', { name: 'АБ' });
```

Additionally, the engraving path assertion would also need `decodeURIComponent()` applied (same issue as Failures 1 and 2).

---

## Summary

All 3 failures are test-level issues, not application bugs:

| # | Test | Root Cause | Category |
|---|------|-----------|----------|
| 1 | Logo embroidery | URL-encoded src vs literal path check | Test assertion bug |
| 2 | No embroidery (return to base) | Same URL encoding issue | Test assertion bug |
| 3 | Monogram engraving | Ambiguous `input[type='text']` selector | Test selector bug |

The hat configurator's core image-switching logic (variant, material, color) works correctly as confirmed by the 4 passing tests. The embroidery/engraving image switching also appears to work correctly based on the actual src values returned — the tests just fail to match them properly.

### Fixes needed (Task 4):
1. Add `decodeURIComponent()` to all src path assertions in embroidery tests
2. Use specific selector `input[placeholder='АБ']` for monogram input
3. No application code changes expected
