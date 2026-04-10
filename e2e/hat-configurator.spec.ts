import { test, expect } from "@playwright/test";

test.describe("Hat configurator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/constructor/hat", { waitUntil: "networkidle" });
    // Wait for Zustand store hydration and hat config initialization
    await page.locator("h3", { hasText: "Форма" }).waitFor({ state: "visible", timeout: 30000 });
    await page.locator("img[alt='Банная шапка']").waitFor({ state: "visible", timeout: 10000 });
  });

  test("displays initial hat image with default variant", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");
    await expect(img).toBeVisible();
    const src = await img.getAttribute("src");
    expect(src).toContain("kolpak-snow-felt");
  });

  test("switches hat variant and updates preview image", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");
    const formaSection = page.locator("h3", { hasText: "Форма" }).locator("..");
    const variantButtons = formaSection.locator("button");

    const variants = [
      { index: 0, name: "Колпак", idFragment: "kolpak" },
      { index: 1, name: "Будёновка", idFragment: "budenovka" },
      { index: 2, name: "Ушанка", idFragment: "ushanka" },
      { index: 3, name: "Панама", idFragment: "panama" },
    ];

    for (const variant of variants) {
      const btn = variantButtons.nth(variant.index);
      await btn.click();
      await expect(btn).toHaveClass(/border-gold/);
      await expect(async () => {
        const src = await img.getAttribute("src");
        expect(src).toContain(variant.idFragment);
      }).toPass({ timeout: 5000 });
    }
  });

  test("switches material and updates active button", async ({ page }) => {
    const materialSection = page.locator("h3", { hasText: "Материал" }).locator("..");
    const materialButtons = materialSection.locator("button");

    const materials = [
      { index: 0, name: "Войлок", idFragment: "kolpak-snow-felt" },
      { index: 1, name: "Войлок премиум", idFragment: "kolpak-snow-premium" },
      { index: 2, name: "Меринос", idFragment: "kolpak-snow-merino" },
      { index: 3, name: "Фетр", idFragment: "kolpak-snow-fetr" },
    ];

    for (const mat of materials) {
      const btn = materialButtons.nth(mat.index);
      await btn.click();
      await expect(btn).toHaveClass(/border-gold/);
      const img = page.locator("img[alt='Банная шапка']");
      await expect(async () => {
        const src = await img.getAttribute("src");
        expect(src).toContain(mat.idFragment);
      }).toPass({ timeout: 5000 });
    }
  });

  test("switches color and updates image src", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");
    const colorSection = page.locator("h3", { hasText: "Цвет:" }).locator("..");
    const colorButtons = colorSection.locator("button.rounded-full");

    // Click anthracite (3rd color, index 2)
    const anthraciteBtn = colorButtons.nth(2);
    await anthraciteBtn.click();
    await expect(anthraciteBtn).toHaveClass(/border-gold/);

    await expect(async () => {
      const src = await img.getAttribute("src");
      expect(src).toContain("anthracite");
    }).toPass({ timeout: 5000 });

    // Switch to cream (2nd color, index 1)
    const creamBtn = colorButtons.nth(1);
    await creamBtn.click();

    await expect(async () => {
      const src = await img.getAttribute("src");
      expect(src).toContain("cream");
    }).toPass({ timeout: 5000 });
  });

  test("selects logo embroidery and base image stays unchanged with overlay", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Get the base image src before selecting logo
    const baseSrcBefore = await img.getAttribute("src");

    // Click "Логотип ПАРЪ" embroidery type button
    const logoBtn = page.locator("button", { hasText: "Логотип ПАРЪ" });
    await logoBtn.click();
    await expect(logoBtn).toHaveClass(/border-gold/);

    // Base image should NOT change — still contains /hats/base/
    const baseSrcAfter = await img.getAttribute("src");
    expect(baseSrcAfter).toBe(baseSrcBefore);

    // Logo overlay should be visible
    const logoOverlay = page.locator("[data-testid='logo-overlay']");
    await expect(logoOverlay).toBeVisible();
    await expect(logoOverlay).toContainText("ПАРЪ");
  });

  test("selects no embroidery and overlay disappears", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // First select logo
    await page.locator("button", { hasText: "Логотип ПАРЪ" }).click();
    await expect(page.locator("[data-testid='logo-overlay']")).toBeVisible();

    // Get base image src
    const baseSrc = await img.getAttribute("src");

    // Now select "Без вышивки" to go back to none
    const noneBtn = page.locator("button", { hasText: "Без вышивки" });
    await noneBtn.click();
    await expect(noneBtn).toHaveClass(/border-gold/);

    // Overlay should disappear
    await expect(page.locator("[data-testid='logo-overlay']")).not.toBeVisible();

    // Base image should remain the same
    const currentSrc = await img.getAttribute("src");
    expect(currentSrc).toBe(baseSrc);
  });

  test("monogram with text shows engraving overlay, base image unchanged", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Get baseline image src
    const baseSrc = await img.getAttribute("src");

    // Select "Монограмма" embroidery type
    const monogramBtn = page.locator("button", { hasText: "Монограмма" });
    await monogramBtn.click();
    await expect(monogramBtn).toHaveClass(/border-gold/);

    // Type text into the monogram input
    const input = page.locator("input[placeholder='АБ']");
    await input.fill("АБ");

    // Base image should still be the same
    const currentSrc = await img.getAttribute("src");
    expect(currentSrc).toBe(baseSrc);

    // Engraving overlay should be visible with the text
    const engravingOverlay = page.locator("[data-testid='engraving-overlay']");
    await expect(engravingOverlay).toBeVisible();
    await expect(engravingOverlay).toContainText("АБ");
  });

  test("switching embroidery type does not change base image", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Record base image src in default state (no engraving)
    const baseSrc = await img.getAttribute("src");

    // Switch to logo
    await page.locator("button", { hasText: "Логотип ПАРЪ" }).click();
    expect(await img.getAttribute("src")).toBe(baseSrc);

    // Switch to monogram
    await page.locator("button", { hasText: "Монограмма" }).click();
    expect(await img.getAttribute("src")).toBe(baseSrc);

    // Switch back to none
    await page.locator("button", { hasText: "Без вышивки" }).click();
    expect(await img.getAttribute("src")).toBe(baseSrc);
  });

  test("rapid variant switching settles on last clicked variant", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");
    const formaSection = page.locator("h3", { hasText: "Форма" }).locator("..");
    const variantButtons = formaSection.locator("button");

    // Rapidly click variant 1 → 2 → 3 without waiting
    await variantButtons.nth(1).click();
    await variantButtons.nth(2).click();
    await variantButtons.nth(3).click();

    // Final image should match the last clicked variant (panama)
    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("panama");
    }).toPass({ timeout: 5000 });

    // Only the last button should be active
    await expect(variantButtons.nth(3)).toHaveClass(/border-gold/);
    await expect(variantButtons.nth(1)).not.toHaveClass(/border-gold/);
    await expect(variantButtons.nth(2)).not.toHaveClass(/border-gold/);
  });

  test("anthracite color keeps base image path with anthracite", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Switch to anthracite color
    const colorSection = page.locator("h3", { hasText: "Цвет:" }).locator("..");
    const colorButtons = colorSection.locator("button.rounded-full");
    await colorButtons.nth(2).click();

    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("anthracite");
    }).toPass({ timeout: 5000 });

    // Select logo embroidery — base image should still be base path with anthracite
    await page.locator("button", { hasText: "Логотип ПАРЪ" }).click();

    const src = decodeURIComponent(await img.getAttribute("src") || "");
    expect(src).toContain("/hats/base/");
    expect(src).toContain("anthracite");

    // Logo overlay should be visible
    await expect(page.locator("[data-testid='logo-overlay']")).toBeVisible();
  });

  test("engraving overlay reflects thread color visually", async ({ page }) => {
    // Select monogram embroidery type
    await page.locator("button", { hasText: "Монограмма" }).click();

    // Type text
    const input = page.locator("input[placeholder='АБ']");
    await input.fill("ИВ");

    // Engraving overlay should be visible
    const overlay = page.locator("[data-testid='engraving-overlay']");
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText("ИВ");

    // Switch thread color to silver
    await page.locator("button[title='Серебро']").click();

    // Overlay should still be visible with the text
    await expect(overlay).toContainText("ИВ");

    // The overlay span should have silver color (#C0C0C0)
    const span = overlay.locator("span");
    await expect(span).toHaveCSS("color", "rgb(192, 192, 192)");
  });
});
