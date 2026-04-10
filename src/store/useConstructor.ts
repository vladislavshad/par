"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, PACKAGING_OPTIONS, PRESET_KITS } from "@/data/products";

export type ItemConfig = {
  productId: string;
  materialId: string;
  colorId: string;
  sizeId?: string;
  variantId?: string;
  trimColorId?: string;
  engraving?: string;
  engravingFont?: string;
  engravingColorId?: string;
  engravingTypeId?: string;
  engravingPositionId?: string;
};

type ConstructorState = {
  step: number;
  selectedItems: string[];
  itemConfigs: Record<string, ItemConfig>;
  packagingId: string;
  giftCardText: string;
  contactName: string;
  contactPhone: string;
  contactMethod: "telegram" | "whatsapp";

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleItem: (productId: string) => void;
  setItemConfig: (productId: string, config: Partial<ItemConfig>) => void;
  setPackaging: (id: string) => void;
  setGiftCardText: (text: string) => void;
  setContactName: (name: string) => void;
  setContactPhone: (phone: string) => void;
  setContactMethod: (method: "telegram" | "whatsapp") => void;
  applyPreset: (presetId: string) => void;
  getTotal: () => number;
  getItemPrice: (productId: string) => number;
  reset: () => void;
};

const initialState = {
  step: 1,
  selectedItems: [] as string[],
  itemConfigs: {} as Record<string, ItemConfig>,
  packagingId: "standard",
  giftCardText: "",
  contactName: "",
  contactPhone: "",
  contactMethod: "telegram" as const,
};

export const useConstructor = create<ConstructorState>()(persist((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  toggleItem: (productId) =>
    set((s) => {
      const isSelected = s.selectedItems.includes(productId);
      if (isSelected) {
        const { [productId]: _, ...rest } = s.itemConfigs;
        return {
          selectedItems: s.selectedItems.filter((id) => id !== productId),
          itemConfigs: rest,
        };
      }
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return s;
      return {
        selectedItems: [...s.selectedItems, productId],
        itemConfigs: {
          ...s.itemConfigs,
          [productId]: {
            productId,
            materialId: product.materials[0].id,
            colorId: product.colors[0].id,
            sizeId: product.sizes?.[0]?.id,
            variantId: product.variants?.[0]?.id,
            trimColorId: product.trimColors?.[0]?.id,
            engraving: "",
            engravingFont: "serif",
            engravingColorId: "gold",
            engravingTypeId: "none",
            engravingPositionId: product.engravingPositions?.[0]?.id,
          },
        },
      };
    }),

  setItemConfig: (productId, config) =>
    set((s) => ({
      itemConfigs: {
        ...s.itemConfigs,
        [productId]: { ...s.itemConfigs[productId], ...config },
      },
    })),

  applyPreset: (presetId) =>
    set(() => {
      const kit = PRESET_KITS.find((k) => k.id === presetId);
      if (!kit) return {};
      const configs: Record<string, ItemConfig> = {};
      for (const productId of kit.items) {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) continue;
        const materialId = kit.materialPreset[productId] ?? product.materials[0].id;
        configs[productId] = {
          productId,
          materialId,
          colorId: product.colors[0].id,
          sizeId: product.sizes?.[0]?.id,
          variantId: product.variants?.[0]?.id,
          trimColorId: product.trimColors?.[0]?.id,
          engraving: "",
          engravingFont: "serif",
          engravingColorId: "gold",
          engravingTypeId: "none",
          engravingPositionId: product.engravingPositions?.[0]?.id,
        };
      }
      return {
        selectedItems: [...kit.items],
        itemConfigs: configs,
        packagingId: kit.packagingId,
        step: 2,
      };
    }),

  setPackaging: (id) => set({ packagingId: id }),
  setGiftCardText: (text) => set({ giftCardText: text }),
  setContactName: (name) => set({ contactName: name }),
  setContactPhone: (phone) => set({ contactPhone: phone }),
  setContactMethod: (method) => set({ contactMethod: method }),

  getItemPrice: (productId) => {
    const state = get();
    const config = state.itemConfigs[productId];
    if (!config) return 0;
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return 0;
    const material = product.materials.find((m) => m.id === config.materialId);
    const base = material?.price ?? product.materials[0].price;
    const hasEngraving = config.engravingTypeId !== "none" && (config.engravingTypeId === "logo" || !!config.engraving);
    const engravingCost =
      product.allowEngraving && hasEngraving
        ? product.engravingPrice
        : 0;
    return base + engravingCost;
  },

  getTotal: () => {
    const state = get();
    let total = 0;
    for (const productId of state.selectedItems) {
      total += state.getItemPrice(productId);
    }
    const pkg = PACKAGING_OPTIONS.find((p) => p.id === state.packagingId);
    if (pkg) {
      const isFree = pkg.freeThreshold && state.selectedItems.length >= pkg.freeThreshold;
      if (!isFree) total += pkg.price;
    }
    if (state.giftCardText) total += 300;
    return total;
  },

  reset: () => {
    set(initialState);
  },
}), {
  name: "par-constructor",
  partialize: (state) => ({
    selectedItems: state.selectedItems,
    itemConfigs: state.itemConfigs,
    packagingId: state.packagingId,
    giftCardText: state.giftCardText,
    step: state.step,
  }),
}));
