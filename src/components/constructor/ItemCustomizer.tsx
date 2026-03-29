"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRODUCTS,
  ENGRAVING_FONTS,
  EMBROIDERY_COLORS,
  EMBROIDERY_TYPES,
} from "@/data/products";
import { useConstructor } from "@/store/useConstructor";
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";

export function ItemCustomizer() {
  const {
    selectedItems,
    itemConfigs,
    setItemConfig,
    nextStep,
    prevStep,
    getItemPrice,
  } = useConstructor();
  const [expandedItem, setExpandedItem] = useState<string | null>(
    selectedItems[0] ?? null
  );

  const selectedProducts = PRODUCTS.filter((p) =>
    selectedItems.includes(p.id)
  );

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
          Настройте каждый предмет
        </h2>
        <p className="text-text-muted">
          Материал, цвет, форма, вышивка — всё под вас
        </p>
      </div>

      <div className="space-y-3">
        {selectedProducts.map((product) => {
          const config = itemConfigs[product.id];
          if (!config) return null;
          const isExpanded = expandedItem === product.id;
          const selectedMaterial = product.materials.find(
            (m) => m.id === config.materialId
          );
          const selectedVariant = product.variants?.find(
            (v) => v.id === config.variantId
          );

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
                    src={product.image}
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
              </button>

              {/* Expanded panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 space-y-6 border-t border-white/5 pt-5">

                      {/* ── Variant (hat shape, etc.) ── */}
                      {product.variants && (
                        <div>
                          <label className="text-sm text-text-secondary font-medium mb-3 block">
                            Форма
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {product.variants.map((v) => (
                              <button
                                key={v.id}
                                onClick={() =>
                                  setItemConfig(product.id, { variantId: v.id })
                                }
                                className={`text-left border transition-all overflow-hidden ${
                                  config.variantId === v.id
                                    ? "border-gold bg-gold/5 ring-1 ring-gold/20"
                                    : "border-white/10 hover:border-white/20"
                                }`}
                              >
                                {v.image && (
                                  <div className="relative w-full aspect-square bg-bg-primary">
                                    <Image
                                      src={v.image}
                                      alt={v.name}
                                      fill
                                      sizes="(max-width: 640px) 50vw, 25vw"
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-2.5">
                                  <div className="text-sm font-medium">{v.name}</div>
                                  {v.description && (
                                    <div className="text-text-muted text-xs mt-0.5">{v.description}</div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── Material ── */}
                      <div>
                        <label className="text-sm text-text-secondary font-medium mb-2 block">
                          Материал
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {product.materials.map((mat) => (
                            <button
                              key={mat.id}
                              onClick={() =>
                                setItemConfig(product.id, { materialId: mat.id })
                              }
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
                        <label className="text-sm text-text-secondary font-medium mb-2 block">
                          Цвет:{" "}
                          <span className="text-text-muted">
                            {product.colors.find((c) => c.id === config.colorId)?.name}
                          </span>
                        </label>
                        <ColorPicker
                          colors={product.colors}
                          selected={config.colorId}
                          onSelect={(id) => setItemConfig(product.id, { colorId: id })}
                        />
                      </div>

                      {/* ── Trim / edging color ── */}
                      {product.trimColors && (
                        <div>
                          <label className="text-sm text-text-secondary font-medium mb-2 block">
                            Цвет канта:{" "}
                            <span className="text-text-muted">
                              {product.trimColors.find((c) => c.id === config.trimColorId)?.name}
                            </span>
                          </label>
                          <ColorPicker
                            colors={product.trimColors}
                            selected={config.trimColorId ?? ""}
                            onSelect={(id) => setItemConfig(product.id, { trimColorId: id })}
                          />
                        </div>
                      )}

                      {/* ── Size ── */}
                      {product.sizes && (
                        <div>
                          <label className="text-sm text-text-secondary font-medium mb-2 block">
                            Размер
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <button
                                key={size.id}
                                onClick={() =>
                                  setItemConfig(product.id, { sizeId: size.id })
                                }
                                className={`px-4 py-2 text-sm border transition-colors ${
                                  config.sizeId === size.id
                                    ? "border-gold bg-gold/5 text-gold"
                                    : "border-white/10 text-text-secondary hover:border-white/20"
                                }`}
                              >
                                {size.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── Embroidery ── */}
                      {product.allowEngraving && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-text-secondary font-medium">
                              Именная вышивка
                            </label>
                            <span className="text-gold text-xs">
                              +{product.engravingPrice} ₽
                            </span>
                          </div>

                          {/* Embroidery type */}
                          <div className="flex flex-wrap gap-2">
                            {EMBROIDERY_TYPES.map((type) => (
                              <button
                                key={type.id}
                                onClick={() =>
                                  setItemConfig(product.id, { engravingTypeId: type.id })
                                }
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
                            onChange={(e) =>
                              setItemConfig(product.id, { engraving: e.target.value })
                            }
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

                          {config.engraving && (
                            <div className="space-y-4">
                              {/* Preview */}
                              <div className="bg-bg-primary border border-white/5 p-4 text-center">
                                <p className="text-text-muted text-xs mb-2">Предпросмотр</p>
                                <p
                                  className={`text-2xl ${
                                    config.engravingFont === "serif"
                                      ? "font-serif"
                                      : config.engravingFont === "script"
                                        ? "italic font-serif"
                                        : config.engravingFont === "oldrus"
                                          ? "font-serif tracking-[0.2em]"
                                          : ""
                                  }`}
                                  style={{
                                    color: EMBROIDERY_COLORS.find(
                                      (c) => c.id === config.engravingColorId
                                    )?.hex ?? "#C9A96E",
                                  }}
                                >
                                  {config.engraving}
                                </p>
                              </div>

                              {/* Font */}
                              <div>
                                <label className="text-xs text-text-muted mb-2 block">Шрифт</label>
                                <div className="flex flex-wrap gap-2">
                                  {ENGRAVING_FONTS.map((font) => (
                                    <button
                                      key={font.id}
                                      onClick={() =>
                                        setItemConfig(product.id, { engravingFont: font.id })
                                      }
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

                              {/* Embroidery color */}
                              <div>
                                <label className="text-xs text-text-muted mb-2 block">
                                  Цвет нити:{" "}
                                  <span>
                                    {EMBROIDERY_COLORS.find(
                                      (c) => c.id === config.engravingColorId
                                    )?.name}
                                  </span>
                                </label>
                                <ColorPicker
                                  colors={EMBROIDERY_COLORS}
                                  selected={config.engravingColorId ?? "gold"}
                                  onSelect={(id) =>
                                    setItemConfig(product.id, { engravingColorId: id })
                                  }
                                />
                              </div>

                              {/* Position */}
                              {product.engravingPositions && (
                                <div>
                                  <label className="text-xs text-text-muted mb-2 block">
                                    Расположение
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {product.engravingPositions.map((pos) => (
                                      <button
                                        key={pos.id}
                                        onClick={() =>
                                          setItemConfig(product.id, {
                                            engravingPositionId: pos.id,
                                          })
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
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="border border-white/10 hover:border-white/20 text-text-secondary px-6 py-3 font-medium tracking-wide transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
        <button
          onClick={nextStep}
          className="bg-gold hover:bg-gold-light text-bg-primary px-6 py-3 font-medium tracking-wide transition-colors flex items-center gap-2"
        >
          Далее
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
