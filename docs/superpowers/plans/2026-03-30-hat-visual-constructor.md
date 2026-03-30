# Hat Visual Constructor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated hat customizer page at `/constructor/hat` with real-time embroidery preview overlaid on product photos.

**Architecture:** New page with two-column layout (preview + options). The preview component uses CSS `position: absolute` to overlay embroidery text on hat photos. Reads/writes to existing `useConstructor` Zustand store — no store changes needed.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand, Framer Motion, Tailwind CSS 4

---

### Task 1: HatPreview component

**Files:**
- Create: `src/components/constructor/HatPreview.tsx`

- [ ] **Step 1: Create HatPreview component**

This component renders the hat photo with a CSS-overlay embroidery text. It receives the current hat config and displays the appropriate hat shape image with styled initials on top.

```tsx
"use client";

import Image from "next/image";
import { EMBROIDERY_COLORS, ENGRAVING_FONTS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

const HAT_IMAGES: Record<string, string> = {
  kolpak: "/images/hat-kolpak.png",
  budenovka: "/images/hat-budenovka.png",
  ushanka: "/images/hat-ushanka.png",
  panama: "/images/hat-panama.png",
};

const OVERLAY_POSITIONS: Record<string, { top: string; left: string }> = {
  kolpak: { top: "62%", left: "50%" },
  budenovka: { top: "45%", left: "50%" },
  ushanka: { top: "42%", left: "50%" },
  panama: { top: "40%", left: "50%" },
};

const FONT_SIZE_BY_TYPE: Record<string, string> = {
  monogram: "2.5rem",
  name: "1.5rem",
  phrase: "1rem",
};

const FONT_CSS: Record<string, string> = {
  serif: "font-serif",
  script: "italic font-serif",
  sans: "",
  oldrus: "font-serif tracking-[0.2em]",
};

type Props = {
  config: ItemConfig;
  colorName: string;
  materialName: string;
};

export function HatPreview({ config, colorName, materialName }: Props) {
  const variantId = config.variantId ?? "kolpak";
  const imageSrc = HAT_IMAGES[variantId] ?? HAT_IMAGES.kolpak;
  const overlayPos = OVERLAY_POSITIONS[variantId] ?? OVERLAY_POSITIONS.kolpak;

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

  const fontClass = FONT_CSS[config.engravingFont ?? "serif"] ?? "";
  const fontSize = FONT_SIZE_BY_TYPE[config.engravingTypeId ?? "monogram"] ?? "2.5rem";

  return (
    <div>
      <div className="relative aspect-[4/3] bg-bg-primary overflow-hidden border border-white/5">
        <Image
          src={imageSrc}
          alt="Банная шапка"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {config.engraving && (
          <span
            className={`absolute pointer-events-none select-none font-bold ${fontClass}`}
            style={{
              top: overlayPos.top,
              left: overlayPos.left,
              transform: "translate(-50%, -50%)",
              color: engravingColor,
              fontSize,
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              letterSpacing: "0.05em",
            }}
          >
            {config.engraving}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
        <span>Цвет: <span className="text-text-secondary">{colorName}</span></span>
        <span>Материал: <span className="text-text-secondary">{materialName}</span></span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify component renders without errors**

Open `http://localhost:3000` and confirm the dev server has no compilation errors related to this file. The component is not mounted yet — just check it compiles.

- [ ] **Step 3: Commit**

```bash
git add src/components/constructor/HatPreview.tsx
git commit -m "feat: add HatPreview component with embroidery overlay"
```

---

### Task 2: HatOptionsPanel component

**Files:**
- Create: `src/components/constructor/HatOptionsPanel.tsx`

- [ ] **Step 1: Create HatOptionsPanel component**

This component renders the right-column options panel: Shape, Material, Color, and Embroidery sections.

```tsx
"use client";

import Image from "next/image";
import {
  PRODUCTS,
  FELT_COLORS,
  EMBROIDERY_COLORS,
  EMBROIDERY_TYPES,
  ENGRAVING_FONTS,
} from "@/data/products";
import { useConstructor } from "@/store/useConstructor";
import { ColorPicker } from "./ColorPicker";

const hatProduct = PRODUCTS.find((p) => p.id === "hat")!;

export function HatOptionsPanel() {
  const { itemConfigs, setItemConfig, getItemPrice } = useConstructor();
  const config = itemConfigs["hat"];

  if (!config) return null;

  const selectedMaterial = hatProduct.materials.find(
    (m) => m.id === config.materialId
  );

  return (
    <div className="space-y-8">
      {/* ── Shape ── */}
      <div>
        <h3 className="text-sm text-text-secondary font-medium mb-3">Форма</h3>
        <div className="grid grid-cols-4 gap-3">
          {hatProduct.variants?.map((v) => (
            <button
              key={v.id}
              onClick={() => setItemConfig("hat", { variantId: v.id })}
              className={`text-center border transition-all overflow-hidden ${
                config.variantId === v.id
                  ? "border-gold ring-1 ring-gold/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {v.image && (
                <div className="relative w-full aspect-square bg-bg-primary">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-2 text-xs font-medium">{v.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Material ── */}
      <div>
        <h3 className="text-sm text-text-secondary font-medium mb-3">Материал</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hatProduct.materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setItemConfig("hat", { materialId: mat.id })}
              className={`p-3 text-left border transition-colors ${
                config.materialId === mat.id
                  ? "border-gold bg-gold/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="text-sm font-medium">{mat.name}</div>
              {mat.description && (
                <div className="text-text-muted text-xs mt-0.5">{mat.description}</div>
              )}
              <div className="text-gold text-xs mt-1">
                {mat.price.toLocaleString("ru-RU")} ₽
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Color ── */}
      <div>
        <h3 className="text-sm text-text-secondary font-medium mb-3">
          Цвет:{" "}
          <span className="text-text-muted">
            {FELT_COLORS.find((c) => c.id === config.colorId)?.name}
          </span>
        </h3>
        <ColorPicker
          colors={FELT_COLORS}
          selected={config.colorId}
          onSelect={(id) => setItemConfig("hat", { colorId: id })}
        />
      </div>

      {/* ── Embroidery ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-text-secondary font-medium">
            Именная вышивка
          </h3>
          <span className="text-gold text-xs">+{hatProduct.engravingPrice} ₽</span>
        </div>

        {/* Type */}
        <div className="flex flex-wrap gap-2">
          {EMBROIDERY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setItemConfig("hat", { engravingTypeId: type.id })}
              className={`px-3 py-2 text-xs border transition-colors ${
                config.engravingTypeId === type.id
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-white/10 text-text-secondary hover:border-white/20"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Text input */}
        <input
          type="text"
          value={config.engraving ?? ""}
          onChange={(e) => setItemConfig("hat", { engraving: e.target.value })}
          placeholder={
            config.engravingTypeId === "monogram"
              ? "АБ"
              : config.engravingTypeId === "name"
                ? "Александр"
                : "С лёгким паром!"
          }
          maxLength={
            config.engravingTypeId === "monogram"
              ? 3
              : config.engravingTypeId === "name"
                ? 15
                : 30
          }
          className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
        />

        {/* Font */}
        <div>
          <label className="text-xs text-text-muted mb-2 block">Шрифт</label>
          <div className="flex flex-wrap gap-2">
            {ENGRAVING_FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => setItemConfig("hat", { engravingFont: font.id })}
                className={`px-3 py-2 text-sm border transition-colors ${font.css} ${
                  config.engravingFont === font.id
                    ? "border-gold bg-gold/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Thread color */}
        <div>
          <label className="text-xs text-text-muted mb-2 block">
            Цвет нити:{" "}
            <span>
              {EMBROIDERY_COLORS.find((c) => c.id === config.engravingColorId)?.name}
            </span>
          </label>
          <ColorPicker
            colors={EMBROIDERY_COLORS}
            selected={config.engravingColorId ?? "gold"}
            onSelect={(id) => setItemConfig("hat", { engravingColorId: id })}
          />
        </div>

        {/* Position */}
        {hatProduct.engravingPositions && (
          <div>
            <label className="text-xs text-text-muted mb-2 block">Расположение</label>
            <div className="flex flex-wrap gap-2">
              {hatProduct.engravingPositions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() =>
                    setItemConfig("hat", { engravingPositionId: pos.id })
                  }
                  className={`px-3 py-2 text-xs border transition-colors ${
                    config.engravingPositionId === pos.id
                      ? "border-gold bg-gold/5 text-gold"
                      : "border-white/10 text-text-secondary hover:border-white/20"
                  }`}
                >
                  {pos.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Check dev server for compilation errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/constructor/HatOptionsPanel.tsx
git commit -m "feat: add HatOptionsPanel component"
```

---

### Task 3: Hat constructor page

**Files:**
- Create: `src/app/constructor/hat/page.tsx`

- [ ] **Step 1: Create the hat constructor page**

This page composes `HatPreview` and `HatOptionsPanel` into a two-column layout. It auto-adds the hat to the kit if not already selected, and provides navigation back to the main constructor.

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS, FELT_COLORS } from "@/data/products";
import { useConstructor } from "@/store/useConstructor";
import { HatPreview } from "@/components/constructor/HatPreview";
import { HatOptionsPanel } from "@/components/constructor/HatOptionsPanel";

const hatProduct = PRODUCTS.find((p) => p.id === "hat")!;

export default function HatConstructorPage() {
  const router = useRouter();
  const {
    selectedItems,
    toggleItem,
    itemConfigs,
    getItemPrice,
    setStep,
  } = useConstructor();

  // Auto-add hat if not selected
  useEffect(() => {
    if (!selectedItems.includes("hat")) {
      toggleItem("hat");
    }
  }, [selectedItems, toggleItem]);

  const config = itemConfigs["hat"];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Загрузка...
      </div>
    );
  }

  const selectedMaterial = hatProduct.materials.find(
    (m) => m.id === config.materialId
  );
  const selectedColor = FELT_COLORS.find((c) => c.id === config.colorId);
  const price = getItemPrice("hat");

  const handleAddToKit = () => {
    setStep(2);
    router.push("/constructor");
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/constructor"
            className="text-text-muted hover:text-gold text-sm transition-colors flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к комплекту
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            Банная шапка
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Preview */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <HatPreview
              config={config}
              colorName={selectedColor?.name ?? ""}
              materialName={selectedMaterial?.name ?? ""}
            />
          </div>

          {/* Right: Options */}
          <div>
            <HatOptionsPanel />

            {/* Bottom bar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-muted text-sm">Итого</span>
                <span className="text-gold text-2xl font-serif font-bold">
                  {price.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              <button
                onClick={handleAddToKit}
                className="w-full bg-gold hover:bg-gold-light text-bg-primary py-4 font-medium tracking-wide transition-colors text-lg"
              >
                Добавить в комплект
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test the page in browser**

Open `http://localhost:3000/constructor/hat`. Verify:
- Hat photo renders with the kolpak image
- Switching shapes changes the photo
- Typing initials shows text overlay on the photo in real-time
- Changing font/color updates the overlay immediately
- Material/color selection works
- Price updates when changing material or adding embroidery
- "Добавить в комплект" redirects to `/constructor` step 2
- "Назад к комплекту" link works

- [ ] **Step 3: Commit**

```bash
git add src/app/constructor/hat/page.tsx
git commit -m "feat: add hat constructor page with live preview"
```

---

### Task 4: Modify ItemCustomizer for hat

**Files:**
- Modify: `src/components/constructor/ItemCustomizer.tsx`

- [ ] **Step 1: Replace hat accordion with compact card linking to /constructor/hat**

In `ItemCustomizer`, change the rendering for the hat product. Instead of expanding the full options accordion, render a compact card with a summary and a link to the dedicated hat constructor.

Find this block in `ItemCustomizer.tsx` (the map over `selectedProducts`), and wrap the expanded panel section in a condition. Replace the content inside the `selectedProducts.map()` callback:

After the closing `</button>` of the collapsed header (line ~103), replace the `<AnimatePresence>` block for the hat with a compact card. For all other products, keep the existing accordion.

Replace the entire `return` inside the `selectedProducts.map` callback (lines 55–404) with:

```tsx
            return (
            <div
              key={product.id}
              className={`bg-bg-secondary border transition-colors ${
                isExpanded ? "border-gold/30" : "border-white/5"
              }`}
            >
              {/* Collapsed header */}
              <button
                onClick={() =>
                  setExpandedItem(isExpanded ? null : product.id)
                }
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 overflow-hidden">
                  <Image
                    src={product.id === "hat" && selectedVariant?.image ? selectedVariant.image : product.image}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-sm truncate">
                    {selectedMaterial?.name}
                    {selectedVariant ? ` · ${selectedVariant.name}` : ""}
                    {config.engraving ? ` · «${config.engraving}»` : ""}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-gold font-serif font-bold">
                    {getItemPrice(product.id).toLocaleString("ru-RU")} ₽
                  </div>
                </div>
                {product.id === "hat" ? (
                  <Link
                    href="/constructor/hat"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Настроить
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* Expanded panel — only for non-hat products */}
              {product.id !== "hat" && (
              <AnimatePresence>
                {isExpanded && (
```

And at the very end of the expanded panel `</motion.div>` closing, before `</AnimatePresence>`, no changes. Just add the closing for the new condition after `</AnimatePresence>`:

```tsx
              </AnimatePresence>
              )}
            </div>
```

Also add the `Link` import at the top of the file:

```tsx
import Link from "next/link";
```

- [ ] **Step 2: Test in browser**

Open `http://localhost:3000/constructor`. Select the hat and at least one other product. Verify:
- Hat shows as a compact card with "Настроить →" button (no accordion expands)
- Clicking "Настроить" navigates to `/constructor/hat`
- Other products still expand with the full accordion as before
- After customizing hat on `/constructor/hat` and clicking "Добавить в комплект", you return to the constructor with the hat config preserved

- [ ] **Step 3: Commit**

```bash
git add src/components/constructor/ItemCustomizer.tsx
git commit -m "feat: hat uses dedicated constructor instead of accordion"
```

---

### Task 5: Visual tuning and final verification

**Files:**
- May adjust: `src/components/constructor/HatPreview.tsx` (overlay positions)

- [ ] **Step 1: Tune overlay positions for each hat shape**

Open `http://localhost:3000/constructor/hat`. Type "АБ" in the embroidery field. Switch between all 4 hat shapes and adjust the `OVERLAY_POSITIONS` values in `HatPreview.tsx` so the text sits naturally on each photo. The initial values from the spec are approximate — update them based on what looks right visually.

- [ ] **Step 2: Test the full flow end-to-end**

1. Go to `http://localhost:3000`
2. Click "Создать комплект" → go to constructor
3. Select hat + one more product → click "Далее"
4. On step 2: hat shows compact card → click "Настроить"
5. On `/constructor/hat`: select shape, material, color, type embroidery text
6. Verify text appears on photo in real-time
7. Click "Добавить в комплект" → return to constructor step 2
8. Verify hat card shows updated summary
9. Continue through steps 3 and 4 to order summary
10. Verify hat details appear correctly in the order summary

- [ ] **Step 3: Test direct access**

Open `http://localhost:3000/constructor/hat` directly in a new tab. Verify:
- Hat is auto-added to the kit
- All customization options work
- "Добавить в комплект" works

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit any tuning changes**

```bash
git add -A
git commit -m "fix: tune embroidery overlay positions"
```
