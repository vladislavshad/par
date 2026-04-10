import { test, expect } from "@playwright/test";

test.describe("Hat configurator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/constructor/hat", { waitUntil: "networkidle" });
    // Wait for Zustand store hydration and hat config initialization
    // The page shows "Загрузка..." until the config is ready
    await page.locator("h3", { hasText: "Форма" }).waitFor({ state: "visible", timeout: 30000 });
    // Now wait for the preview image
    await page.locator("img[alt='Банная шапка']").waitFor({ state: "visible", timeout: 10000 });
  });

  test("displays initial hat image with default variant", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");
    await expect(img).toBeVisible();
    const src = await img.getAttribute("src");
    // Next.js may rewrite src via Image optimization; check the underlying image path
    // Default: kolpak, snow, felt-standard → kolpak-snow-felt
    expect(src).toContain("kolpak-snow-felt");
  });

  test("switches hat variant and updates preview image", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Find variant buttons under the "Форма" section
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

      // Active variant should have gold border
      await expect(btn).toHaveClass(/border-gold/);

      // Wait for image src to update
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

      // Active material should have gold border
      await expect(btn).toHaveClass(/border-gold/);

      // Wait for image src to update
      const img = page.locator("img[alt='Банная шапка']");
      await expect(async () => {
        const src = await img.getAttribute("src");
        expect(src).toContain(mat.idFragment);
      }).toPass({ timeout: 5000 });
    }
  });

  test("switches color and updates image src", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Color picker buttons are round buttons under "Цвет:" heading
    const colorSection = page.locator("h3", { hasText: "Цвет:" }).locator("..");
    const colorButtons = colorSection.locator("button.rounded-full");

    // Click the anthracite color (3rd color, index 2)
    const anthraciteBtn = colorButtons.nth(2);
    await anthraciteBtn.click();

    // Active color button should have gold border and scale
    await expect(anthraciteBtn).toHaveClass(/border-gold/);

    // Image should now contain "anthracite" in the path
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

  test("selects logo embroidery and updates image to logo path", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Click "Логотип ПАРЪ" embroidery type button
    const logoBtn = page.locator("button", { hasText: "Логотип ПАРЪ" });
    await logoBtn.click();

    // Button should be active
    await expect(logoBtn).toHaveClass(/border-gold/);

    // Image should switch to logo path (decode URL-encoded Next.js image src)
    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("/hats/logo/");
    }).toPass({ timeout: 5000 });
  });

  test("selects no embroidery and returns to base image", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // First select logo to change the image
    await page.locator("button", { hasText: "Логотип ПАРЪ" }).click();
    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("/hats/logo/");
    }).toPass({ timeout: 5000 });

    // Now select "Без вышивки" to go back to base
    const noneBtn = page.locator("button", { hasText: "Без вышивки" });
    await noneBtn.click();
    await expect(noneBtn).toHaveClass(/border-gold/);

    // Image should go back to base path
    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("/hats/base/");
    }).toPass({ timeout: 5000 });
  });

  test("monogram with text switches to engraving image", async ({ page }) => {
    const img = page.locator("img[alt='Банная шапка']");

    // Select "Монограмма" embroidery type
    const monogramBtn = page.locator("button", { hasText: "Монограмма" });
    await monogramBtn.click();
    await expect(monogramBtn).toHaveClass(/border-gold/);

    // Type text into the monogram input (use placeholder to avoid matching contact form)
    const input = page.locator("input[placeholder='АБ']");
    await input.fill("АБ");

    // Image should switch to engraving path (decode URL-encoded Next.js image src)
    await expect(async () => {
      const src = decodeURIComponent(await img.getAttribute("src") || "");
      expect(src).toContain("/hats/engraving/");
    }).toPass({ timeout: 5000 });
  });
});
