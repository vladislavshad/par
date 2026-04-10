# Configurator UX Improvements

Improve the ПАРЪ bath set configurator (Next.js 16 + React 19 + Zustand + Tailwind v4 + Framer Motion).
Design system: dark theme, gold (#c9a96e) accent, Playfair serif headings, Inter sans body.

## Task 1: [x] Add sticky price bar across all constructor steps

**File:** `src/components/constructor/StickyPriceBar.tsx` (new), `src/app/constructor/page.tsx`
**Problem:** Users have no price feedback until the final step. They don't know the running total while selecting items or customizing.
**Fix:** Create a sticky bottom bar that shows on all 4 steps:
- Fixed to bottom of viewport, z-50, bg-bg-secondary border-t border-white/10
- Left side: item count badge + "N предметов" text
- Center: animated total price (use framer-motion AnimatePresence for number transitions)
- Right side: primary CTA button that changes per step:
  - Step 1: "Далее — настроить" (disabled if 0 items)
  - Step 2: "Далее — упаковка"
  - Step 3: "Далее — оформить"
  - Step 4: hide bar (OrderSummary has its own submit)
- Use `useConstructor` store's `getTotal()`, `selectedItems.length`, `step`, `nextStep`
- Mobile: full width, compact layout (price left, button right)
- Desktop: max-w-5xl centered, matching page container
- Import and render in `constructor/page.tsx` outside the AnimatePresence (so it persists across steps)
- Add pb-20 to the constructor page container so content isn't hidden behind the bar
- Remove the individual "Далее"/"Назад" button rows from ItemSelector, ItemCustomizer, PackagingStep (the bar replaces them). Keep the "Назад" as a text link inside the bar on steps 2-4.

## Task 2: [x] Add preset kit quick-start cards on Step 1

**File:** `src/components/constructor/PresetKits.tsx` (new), `src/components/constructor/ItemSelector.tsx`
**Problem:** Users must manually select items one by one. The PRESET_KITS data exists in products.ts but there's no UI for it on step 1.
**Fix:** Create a PresetKits component shown above the item grid on Step 1:
- Import `PRESET_KITS` from `@/data/products` and `useConstructor`'s `applyPreset`
- Render 3 horizontal cards (grid cols-1 sm:cols-3 gap-4):
  - Each card: border border-white/10 hover:border-gold/30 transition, bg-bg-secondary
  - Card content: kit name (font-serif bold), subtitle, price in gold, item count, "Выбрать" button
  - On click: call `applyPreset(kit.id)` — this already sets items, configs, packaging and jumps to step 2
- Add a section header above the cards: "Готовые наборы" with subtitle "Или соберите свой ниже"
- Add a thin separator (border-b border-white/5 my-8) between presets and the manual item grid
- In ItemSelector.tsx, import and render `<PresetKits />` before the products grid

## Task 3: [x] Make StepIndicator clickable for completed steps

**File:** `src/components/constructor/StepIndicator.tsx`
**Problem:** Users can't navigate back to completed steps by clicking the stepper — only Forward/Back buttons work.
**Fix:**
- Accept `onStepClick: (step: number) => void` prop (pass `setStep` from useConstructor in page.tsx)
- For steps where `step.num < current`: make the circle + label a clickable button with cursor-pointer, hover:bg-gold/10 transition
- For `step.num === current`: show as active (current behavior)
- For `step.num > current`: keep disabled/muted appearance, no click
- Update page.tsx to pass `onStepClick={setStep}` to StepIndicator
- Show step labels on mobile too (text-xs), not just desktop — users need orientation on small screens

## Task 4: [x] Add material descriptions and properties to customizer cards

**File:** `src/data/products.ts`, `src/components/constructor/ItemCustomizer.tsx`
**Problem:** Material cards show only name and price. Users can't compare quality characteristics (thickness, warmth, softness) to justify price differences.
**Fix:**
- In `products.ts`: add `properties` field to Material type: `properties?: { thickness?: string; warmth?: string; softness?: string }`. Populate for hat materials:
  - Войлок 100%: thickness "5-6mm", warmth "Высокая", softness "Средняя"
  - Меринос: thickness "6-8mm", warmth "Очень высокая", softness "Высокая"
  - Альпака+шёлк: thickness "5-7mm", warmth "Максимальная", softness "Премиальная"
  For other products, add similar appropriate properties.
- In `ItemCustomizer.tsx` material buttons: below the price, show property badges as small tags:
  - `<div className="flex flex-wrap gap-1 mt-1.5">` with `<span className="text-[10px] text-text-muted bg-bg-primary px-1.5 py-0.5">{prop}</span>` for each property
- Make material cards slightly taller to accommodate the extra info

## Task 5: [x] Add live embroidery text preview overlay

**File:** `src/components/constructor/ItemCustomizer.tsx`
**Problem:** When users type embroidery text, they see it in a summary box below but NOT on the product image. The main UTP (personalized embroidery) has no visual wow-effect.
**Fix:**
- In the material image preview section (the aspect-[16/10] container), add a text overlay when `config.engravingTypeId !== "none"` and `config.engravingTypeId !== "logo"` and `config.engraving` is not empty:
  - Position: absolute, centered in the lower third of the image
  - Text: `config.engraving` rendered in the selected font style
  - Color: use the hex from `EMBROIDERY_COLORS.find(c => c.id === config.engravingColorId)`
  - Font mapping: serif → font-serif (Playfair), sans → font-sans (Inter), mono → font-mono
  - Style: text-2xl sm:text-3xl, text-shadow for readability (drop-shadow-lg)
  - Animate entry with framer-motion: fade in + slight scale
- This gives instant visual feedback of what the embroidery will look like on the product

## Task 6: [ ] Add LocalStorage persistence for constructor state

**File:** `src/store/useConstructor.ts`
**Problem:** If users accidentally close the browser or navigate away, their entire configuration is lost.
**Fix:**
- Use Zustand's `persist` middleware to save state to localStorage
- Import `persist` from `zustand/middleware`
- Wrap the store: `create<ConstructorState>()(persist((set, get) => ({ ... }), { name: 'par-constructor', partials: ... }))`
- Persist: selectedItems, itemConfigs, packagingId, giftCardText, step (so users return to where they left off)
- Do NOT persist: contactName, contactPhone (privacy)
- Add `reset()` that also clears localStorage: `localStorage.removeItem('par-constructor')`
- On order submission success, call `reset()` to clear saved state

## Task 7: [ ] Mobile UX improvements — sticky bottom actions and responsive cards

**File:** `src/components/constructor/ItemSelector.tsx`, `src/components/constructor/ItemCustomizer.tsx`, `src/app/constructor/page.tsx`
**Problem:** On mobile, item cards get truncated, the "Next" button scrolls off screen, and material options are cramped.
**Fix:**
- ItemSelector: on mobile (< sm), switch to 2-column grid instead of 1 (grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4). Reduce card padding and font sizes for mobile.
- ItemCustomizer: on mobile, material cards should be full width (grid-cols-1 on mobile) with horizontal scroll for colors
- The sticky price bar from Task 1 already handles the mobile "Next" button issue
- Add safe-area-inset padding for iOS: `pb-[env(safe-area-inset-bottom)]` to the sticky bar
- Ensure all touch targets are at least 44px height on mobile (per Apple HIG)
