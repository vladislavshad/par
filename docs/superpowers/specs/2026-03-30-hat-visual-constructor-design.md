# Hat Visual Constructor — Design Spec

## Overview

A dedicated page (`/constructor/hat`) for visually customizing a sauna hat with real-time monogram/embroidery preview overlaid on the product photo. Inspired by Ralph Lauren's custom polo shirt builder.

## Scope

- **In scope:** Hat only. Other products remain in the existing accordion customizer.
- **Out of scope:** Color-tinting the hat photo, canvas-based rendering, other product visual previews.

## Layout

### Route

`/constructor/hat` — a new `"use client"` page in `src/app/constructor/hat/page.tsx`.

### Desktop (lg+)

Two-column 50/50 layout:

- **Left column (sticky):** Large hat photo (aspect ~4:3) with CSS-overlay initials. Below the photo: compact text showing selected color and material.
- **Right column (scrollable):** Options panel divided into sections: Shape, Material, Color, Embroidery. Sticky bottom bar with price and action buttons.

### Mobile

Single column. Hat photo at top (sticky while scrolling through options). Options panel below.

## Preview Component

### Photo Switching

The preview image changes based on the selected hat shape:

| Shape | Image file |
|---|---|
| Kolpak | `hat-kolpak.png` |
| Budenovka | `hat-budenovka.png` |
| Ushanka | `hat-ushanka.png` |
| Panama | `hat-panama.png` |

### Embroidery Overlay

A `<span>` element with `position: absolute` is placed over the photo. Each hat shape has its own positioning config:

```ts
const EMBROIDERY_POSITIONS: Record<string, { top: string; left: string }> = {
  kolpak:    { top: "62%", left: "50%" },
  budenovka: { top: "45%", left: "50%" },
  ushanka:   { top: "42%", left: "50%" },
  panama:    { top: "40%", left: "50%" },
};
```

Coordinates are approximate starting points and will be tuned visually during implementation.

### Text Styling

CSS properties driven by user selections:

- **fontFamily:** Maps from `ENGRAVING_FONTS` config — serif, italic serif, sans, serif with wide tracking.
- **color:** Hex value from `EMBROIDERY_COLORS` (gold, silver, white, black, navy, burgundy, forest).
- **fontSize:** Adaptive based on embroidery type:
  - Monogram (1-3 chars): `2.5rem`
  - Name (up to 15 chars): `1.5rem`
  - Phrase (up to 30 chars): `1rem`
- **transform:** `translate(-50%, -50%)` for centering on the position point.

Text updates in real-time as the user types. Shape/font/color changes are instant with no animation.

## Options Panel (Right Column)

Sections appear in fixed order, top to bottom:

### Shape

4 button-cards in a row. Each shows a small thumbnail of the hat shape and its name. Active selection has a gold border. Selecting a shape updates the preview photo on the left.

Data source: `PRODUCTS.find(p => p.id === "hat").variants`

### Material

List of 4 material options (Felt, Premium Felt, Merino, Fetl). Each button shows name, description, and price. Active has gold border.

Data source: `PRODUCTS.find(p => p.id === "hat").materials`

### Color

Circle swatches from `FELT_COLORS` (8 colors). Selected swatch has gold ring. Color name displayed next to palette. Photo does NOT change color.

Data source: `FELT_COLORS`

### Embroidery (optional)

- **Type:** Monogram / Name / Phrase — chip buttons from `EMBROIDERY_TYPES`
- **Text input:** With `maxLength` based on type (3 / 15 / 30)
- **Font:** 4 buttons from `ENGRAVING_FONTS`
- **Thread color:** Circle swatches from `EMBROIDERY_COLORS`
- **Position:** "Front center" / "Front side" — buttons from hat's `engravingPositions`
- **Price:** "+500 rub" shown next to section header

### Bottom Bar

Sticky on desktop, fixed on mobile:

- Real-time price (material base price + embroidery if text entered)
- "Add to kit" button — saves config to `useConstructor` store, redirects to `/constructor` step 2
- "Back to kit" link

## Integration with Existing Constructor

### ItemCustomizer Changes

When the expanded item is the hat (`product.id === "hat"`), instead of the full accordion options panel, render a compact card:

- Thumbnail of currently selected hat shape
- Summary line: material, color, embroidery text if any
- Price
- "Customize" button — `<Link href="/constructor/hat">`

All other products keep the existing accordion behavior unchanged.

### Store

No changes to `useConstructor` store structure or types. The hat constructor page reads from and writes to `itemConfigs["hat"]` using the existing `setItemConfig` action.

If the hat is not yet in `selectedItems` when `/constructor/hat` loads, it is auto-added via `toggleItem("hat")`.

### Direct Access

`/constructor/hat` is accessible directly by URL. If visited without prior constructor state, the hat is auto-added to the kit.

### Unchanged

- Steps 1, 3, 4 of the constructor — no changes
- Other products in ItemCustomizer — no changes
- Store types, product data, packaging — no changes

## New Files

- `src/app/constructor/hat/page.tsx` — page component
- `src/components/constructor/HatPreview.tsx` — photo + embroidery overlay
- `src/components/constructor/HatOptionsPanel.tsx` — right column options

## Modified Files

- `src/components/constructor/ItemCustomizer.tsx` — hat renders as compact card with link instead of accordion
