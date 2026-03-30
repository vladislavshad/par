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

const HAT_COLORS_SHORT = FELT_COLORS.filter((c) =>
  ["snow", "cream", "anthracite"].includes(c.id)
);

const EMBROIDERY_COLORS_SHORT = EMBROIDERY_COLORS.filter((c) =>
  ["gold", "silver", "black"].includes(c.id)
);

const FONTS_SHORT = ENGRAVING_FONTS.filter((f) =>
  ["serif", "oldrus"].includes(f.id)
);

const POSITION_OPTIONS = [
  { id: "front-center", name: "По центру (крупно)", description: "Большие буквы по центру шапки" },
  { id: "front-side", name: "Сбоку (мелко)", description: "Маленькие буквы сбоку" },
];

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
            {HAT_COLORS_SHORT.find((c) => c.id === config.colorId)?.name}
          </span>
        </h3>
        <ColorPicker
          colors={HAT_COLORS_SHORT}
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
            {FONTS_SHORT.map((font) => (
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
              {EMBROIDERY_COLORS_SHORT.find((c) => c.id === config.engravingColorId)?.name}
            </span>
          </label>
          <ColorPicker
            colors={EMBROIDERY_COLORS_SHORT}
            selected={config.engravingColorId ?? "gold"}
            onSelect={(id) => setItemConfig("hat", { engravingColorId: id })}
          />
        </div>

        {/* Position */}
        <div>
          <label className="text-xs text-text-muted mb-2 block">Расположение</label>
          <div className="grid grid-cols-2 gap-2">
            {POSITION_OPTIONS.map((pos) => (
              <button
                key={pos.id}
                onClick={() =>
                  setItemConfig("hat", { engravingPositionId: pos.id })
                }
                className={`p-3 text-left border transition-colors ${
                  config.engravingPositionId === pos.id
                    ? "border-gold bg-gold/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`text-xs font-medium ${config.engravingPositionId === pos.id ? "text-gold" : "text-text-secondary"}`}>{pos.name}</div>
                <div className="text-text-muted text-[10px] mt-0.5">{pos.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Custom order disclaimer ── */}
      <div className="border border-white/10 bg-bg-primary/50 p-4">
        <p className="text-text-secondary text-sm mb-2">
          Хотите нанести логотип, рисунок или нестандартный текст?
        </p>
        <p className="text-text-muted text-xs mb-3">
          Мы выполняем кастомные заказы — свяжитесь с отделом продаж для обсуждения деталей.
        </p>
        <a
          href="#custom-contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("custom-contact-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-gold hover:text-gold-light text-sm font-medium transition-colors flex items-center gap-1"
        >
          Связаться с нами
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
