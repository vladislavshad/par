"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  PRODUCTS,
  FELT_COLORS,
  EMBROIDERY_COLORS,
  EMBROIDERY_TYPES,
  ENGRAVING_FONTS,
} from "@/data/products";
import type { EngravingState, EngravingAction } from "@/app/engraving/page";

const hatProduct = PRODUCTS.find((p) => p.id === "hat")!;
const towelProduct = PRODUCTS.find((p) => p.id === "towel")!;

const HAT_POSITIONS = [
  { id: "front-center", name: "По центру", desc: "Крупно спереди" },
  { id: "front-side", name: "Сбоку", desc: "Мелко сбоку" },
];

const TOWEL_POSITIONS = [
  { id: "corner", name: "В углу", desc: "Элегантно в углу" },
  { id: "center-edge", name: "По центру", desc: "Вдоль края" },
  { id: "wide-border", name: "Бордюр", desc: "Вдоль нижнего края" },
];

const MAX_LENGTHS: Record<string, number> = {
  monogram: 3,
  name: 15,
  phrase: 30,
};

const PLACEHOLDERS: Record<string, string> = {
  monogram: "АБ",
  name: "Александр",
  phrase: "С лёгким паром!",
};

type Props = {
  state: EngravingState;
  dispatch: React.Dispatch<EngravingAction>;
};

export function EngravingPanel({ state, dispatch }: Props) {
  const isHat = state.productId === "hat";
  const positions = isHat ? HAT_POSITIONS : TOWEL_POSITIONS;
  const maxLen = MAX_LENGTHS[state.typeId] ?? 3;
  const charCount = state.text.length;
  const charRatio = charCount / maxLen;

  return (
    <div className="space-y-10">
      {/* ── Product switcher ── */}
      <div>
        <div className="flex border border-white/10 overflow-hidden">
          {(["hat", "towel"] as const).map((pid) => {
            const active = state.productId === pid;
            return (
              <button
                key={pid}
                onClick={() => dispatch({ type: "SET_PRODUCT", productId: pid })}
                className={`flex-1 relative py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? "text-gold bg-gold/5"
                    : "text-text-muted hover:text-text-secondary bg-transparent"
                }`}
              >
                {pid === "hat" ? "Шапка" : "Полотенце"}
                {active && (
                  <motion.div
                    layoutId="product-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Shape (hat only) ── */}
      {isHat && (
        <div>
          <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
            Форма
          </label>
          <div className="grid grid-cols-4 gap-2">
            {hatProduct.variants?.map((v) => {
              const active = state.variantId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => dispatch({ type: "SET_VARIANT", variantId: v.id })}
                  className={`text-center border transition-all duration-200 overflow-hidden ${
                    active
                      ? "border-gold ring-1 ring-gold/30"
                      : "border-white/10 hover:border-white/25"
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
                  <div className={`py-2 text-[11px] font-medium transition-colors ${
                    active ? "text-gold" : "text-text-secondary"
                  }`}>
                    {v.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Color (hat only) ── */}
      {isHat && (
        <div>
          <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
            Цвет войлока{" "}
            <span className="text-text-secondary normal-case tracking-normal">
              — {FELT_COLORS.find((c) => c.id === state.colorId)?.name}
            </span>
          </label>
          <div className="flex gap-2.5">
            {FELT_COLORS.slice(0, 5).map((color) => {
              const active = state.colorId === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => dispatch({ type: "SET_COLOR", colorId: color.id })}
                  className={`w-9 h-9 rounded-full transition-all duration-200 ${
                    active
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-bg-primary scale-110"
                      : "ring-1 ring-white/15 hover:ring-white/30"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="border-t border-white/5" />

      {/* ── Embroidery section header ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-serif font-semibold">Именная вышивка</h3>
          <span className="text-gold text-sm font-medium">
            +{isHat ? hatProduct.engravingPrice : towelProduct.engravingPrice} ₽
          </span>
        </div>
        <p className="text-text-muted text-xs">
          Введите текст — он сразу появится на товаре
        </p>
      </div>

      {/* ── Embroidery type ── */}
      <div>
        <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
          Тип
        </label>
        <div className="flex gap-2">
          {EMBROIDERY_TYPES.map((type) => {
            const active = state.typeId === type.id;
            return (
              <button
                key={type.id}
                onClick={() => dispatch({ type: "SET_TYPE", typeId: type.id })}
                className={`flex-1 py-2.5 px-3 text-xs font-medium border transition-all duration-200 ${
                  active
                    ? "border-gold bg-gold/8 text-gold"
                    : "border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary"
                }`}
              >
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Text input ── */}
      <div>
        <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
          Текст вышивки
        </label>
        <div className="relative">
          <input
            type="text"
            value={state.text}
            onChange={(e) => dispatch({ type: "SET_TEXT", text: e.target.value })}
            placeholder={PLACEHOLDERS[state.typeId] ?? "АБ"}
            maxLength={maxLen}
            className="w-full bg-bg-primary border border-white/10 px-5 py-4 text-base text-text-primary placeholder:text-text-muted/40 focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all duration-200"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span
              className={`text-xs tabular-nums transition-colors duration-300 ${
                charRatio >= 1
                  ? "text-red-400"
                  : charRatio >= 0.8
                    ? "text-amber-400"
                    : "text-text-muted"
              }`}
            >
              {charCount}/{maxLen}
            </span>
          </div>
        </div>
      </div>

      {/* ── Font ── */}
      <div>
        <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
          Шрифт
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ENGRAVING_FONTS.map((font) => {
            const active = state.fontId === font.id;
            return (
              <button
                key={font.id}
                onClick={() => dispatch({ type: "SET_FONT", fontId: font.id })}
                className={`py-3 px-4 border transition-all duration-200 text-left ${
                  active
                    ? "border-gold bg-gold/8"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <span className={`text-lg block mb-0.5 ${font.css} ${
                  active ? "text-gold" : "text-text-primary"
                }`}>
                  АБВ
                </span>
                <span className={`text-[10px] transition-colors ${
                  active ? "text-gold/70" : "text-text-muted"
                }`}>
                  {font.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Thread color ── */}
      <div>
        <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
          Цвет нити{" "}
          <span className="text-text-secondary normal-case tracking-normal">
            — {EMBROIDERY_COLORS.find((c) => c.id === state.threadColorId)?.name}
          </span>
        </label>
        <div className="flex gap-3">
          {EMBROIDERY_COLORS.map((color) => {
            const active = state.threadColorId === color.id;
            return (
              <button
                key={color.id}
                onClick={() => dispatch({ type: "SET_THREAD_COLOR", threadColorId: color.id })}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                  active
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-bg-primary scale-110"
                    : "ring-1 ring-white/15 hover:ring-white/30"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      {/* ── Position ── */}
      <div>
        <label className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3 block">
          Расположение
        </label>
        <div className={`grid gap-2 ${positions.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {positions.map((pos) => {
            const active = state.positionId === pos.id;
            return (
              <button
                key={pos.id}
                onClick={() => dispatch({ type: "SET_POSITION", positionId: pos.id })}
                className={`py-3 px-3 border transition-all duration-200 text-center ${
                  active
                    ? "border-gold bg-gold/8"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <div className={`text-xs font-medium transition-colors ${
                  active ? "text-gold" : "text-text-secondary"
                }`}>
                  {pos.name}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">{pos.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
