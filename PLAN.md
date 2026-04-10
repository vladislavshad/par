# Fix hat configurator image switching — E2E verified

Context: Hat configurator at /constructor/hat has a bug where clicking a different variant/color/material does not update the preview image. A previous fix (commit fde2981) modified HatPreview.tsx to use a local targetSrc variable to compare against pendingSrcRef.current. We need to VERIFY the fix actually works via real E2E tests, and if not — diagnose and fix for real.

Playwright is already installed. e2e/hat-configurator.spec.ts exists with initial tests.

## Task 1: [x] Build the project and verify it compiles
**Goal:** Confirm the project builds cleanly before testing.
**Steps:**
1. cd /root/par
2. Run: npm install (idempotent, should be fast)
3. Run: npm run build 2>&1 | tee /tmp/build.log
4. If build fails → fix TypeScript/lint errors first
**Done when:** Build succeeds with no errors.

## Task 2: [x] Run existing E2E tests and capture results
**Goal:** Run the existing e2e/hat-configurator.spec.ts suite against the dev server and see what actually passes/fails.
**Steps:**
1. cd /root/par
2. Run: npx playwright install chromium --with-deps (if not already)
3. Run: npm run test:e2e 2>&1 | tee /tmp/e2e-run1.log
4. Save the raw log to /root/par/E2E_RESULTS_BEFORE.md with: which tests passed, which failed, failure messages
5. DO NOT fix anything yet — just report what happened.
**Done when:** E2E_RESULTS_BEFORE.md is written with real results.

## Task 3: [x] Diagnose any failing tests
**Goal:** For each failing test from Task 2, identify the root cause.
**Steps:**
1. Read E2E_RESULTS_BEFORE.md
2. For each failure, open Playwright trace/screenshot in test-results/ — analyze what happened
3. Write DIAGNOSIS.md with one section per failure: test name, observed behavior, root cause hypothesis, proposed fix
**Done when:** DIAGNOSIS.md covers every failure (or says all tests pass).

## Task 4: [x] Fix the root cause(s)
**Goal:** Apply fixes so the hat configurator actually switches images when user clicks variant/color/material/embroidery buttons.
**Key files to inspect:**
- src/components/constructor/HatPreview.tsx (image preloading logic)
- src/components/constructor/HatOptionsPanel.tsx (button click handlers)
- src/store/useConstructor.ts (Zustand store update logic)
**Guidance:**
- If tests fail because imageSrc does not update at all → the store update is broken (handler or setState issue)
- If imageSrc updates but displayedSrc stays stale → the HatPreview useEffect has a bug
- Consider: next/image src may contain the path in a URL-encoded form (_next/image?url=...). Tests should check the underlying path, not strict equality.
- Consider: the existing fix may be correct but tests have incorrect selectors — fix the tests in that case.
- If image preloading via new window.Image() is fundamentally broken → simplify: remove preloading, let next/image handle it directly (just use imageSrc as displayedSrc with a simple key-based transition).
**Done when:** You have a concrete fix committed to git.

## Task 5: [ ] Re-run E2E tests and verify
**Goal:** All E2E tests pass.
**Steps:**
1. Run: npm run test:e2e 2>&1 | tee /tmp/e2e-run2.log
2. If any tests still fail → go back to Task 3 (max 3 iterations)
3. Save final log to /root/par/E2E_RESULTS_AFTER.md
**Done when:** All tests pass.

## Task 6: [ ] Write additional E2E coverage for embroidery and rapid switching
**Goal:** Cover edge cases that Vlad reported.
**Add tests:**
1. Click Логотип ПАРЪ embroidery type → image src should contain /logo/
2. Type custom text for engraving → image src should contain /engraving/
3. Switch thread color (gold ↔ silver) → image path should reflect it
4. Rapid click test: click variant 1 → variant 2 → variant 3 within 200ms → final image should match variant 3 (tests the pendingSrcRef guard)
5. Color switch to anthracite (dark) → image path should contain dark tone logic
**Done when:** Tests added and all pass.

## Task 7: [ ] Final verification
**Goal:** Confirm everything works end-to-end.
**Steps:**
1. Run full suite one more time: npm run test:e2e
2. Run: npm run lint (must pass)
3. Run: npm run build (must succeed)
4. Commit everything with a clear message
5. Write FINAL_REPORT.md summarizing: what was broken, what was fixed, test count, any remaining concerns
**Done when:** Clean build, clean lint, all tests pass, FINAL_REPORT.md written.
