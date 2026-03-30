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
