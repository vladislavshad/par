"use client";

import { useReducer } from "react";
import Link from "next/link";
import { EMBROIDERY_COLORS } from "@/data/products";
import { ProductPreview } from "@/components/engraving/ProductPreview";
import { EngravingPanel } from "@/components/engraving/EngravingPanel";

// ─── State ────────────────────────────────────────────

export type EngravingState = {
  productId: "hat" | "towel";
  variantId: string;
  colorId: string;
  text: string;
  typeId: string;
  fontId: string;
  threadColorId: string;
  positionId: string;
};

export type EngravingAction =
  | { type: "SET_PRODUCT"; productId: "hat" | "towel" }
  | { type: "SET_VARIANT"; variantId: string }
  | { type: "SET_COLOR"; colorId: string }
  | { type: "SET_TEXT"; text: string }
  | { type: "SET_TYPE"; typeId: string }
  | { type: "SET_FONT"; fontId: string }
  | { type: "SET_THREAD_COLOR"; threadColorId: string }
  | { type: "SET_POSITION"; positionId: string };

const INITIAL_STATE: EngravingState = {
  productId: "hat",
  variantId: "kolpak",
  colorId: "snow",
  text: "",
  typeId: "monogram",
  fontId: "serif",
  threadColorId: "gold",
  positionId: "front-center",
};

const MAX_LENGTHS: Record<string, number> = {
  monogram: 3,
  name: 15,
  phrase: 30,
};

function reducer(state: EngravingState, action: EngravingAction): EngravingState {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        productId: action.productId,
        variantId: action.productId === "hat" ? "kolpak" : "standard",
        colorId: action.productId === "hat" ? "snow" : "snow",
        positionId: action.productId === "hat" ? "front-center" : "corner",
      };
    case "SET_VARIANT":
      return { ...state, variantId: action.variantId };
    case "SET_COLOR":
      return { ...state, colorId: action.colorId };
    case "SET_TEXT": {
      const maxLen = MAX_LENGTHS[state.typeId] ?? 3;
      return { ...state, text: action.text.slice(0, maxLen) };
    }
    case "SET_TYPE": {
      const maxLen = MAX_LENGTHS[action.typeId] ?? 3;
      return {
        ...state,
        typeId: action.typeId,
        text: state.text.slice(0, maxLen),
      };
    }
    case "SET_FONT":
      return { ...state, fontId: action.fontId };
    case "SET_THREAD_COLOR":
      return { ...state, threadColorId: action.threadColorId };
    case "SET_POSITION":
      return { ...state, positionId: action.positionId };
    default:
      return state;
  }
}

// ─── Page ─────────────────────────────────────────────

export default function EngravingPage() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const threadColor =
    EMBROIDERY_COLORS.find((c) => c.id === state.threadColorId)?.hex ?? "#C9A96E";

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-gold text-sm transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            На главную
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
            Именная вышивка
          </h1>
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
            Добавьте инициалы, имя или фразу — они сразу появятся на товаре
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-12">
          {/* Left: Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductPreview
              productId={state.productId}
              variantId={state.variantId}
              colorId={state.colorId}
              text={state.text}
              typeId={state.typeId}
              fontId={state.fontId}
              threadColor={threadColor}
              positionId={state.positionId}
            />

            {/* Subtle info bar below preview */}
            {state.text && (
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: threadColor }}
                  />
                  {EMBROIDERY_COLORS.find((c) => c.id === state.threadColorId)?.name}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>
                  {state.typeId === "monogram"
                    ? "Монограмма"
                    : state.typeId === "name"
                      ? "Имя"
                      : "Фраза"}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>«{state.text}»</span>
              </div>
            )}
          </div>

          {/* Right: Options panel */}
          <div>
            <EngravingPanel state={state} dispatch={dispatch} />

            {/* Bottom CTA */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <button className="w-full bg-gold hover:bg-gold-light text-bg-primary py-4 font-medium tracking-wide transition-colors text-lg">
                Добавить в комплект
              </button>
              <p className="text-center text-text-muted text-xs mt-3">
                Или{" "}
                <Link href="/constructor" className="text-gold hover:text-gold-light transition-colors">
                  перейти в конструктор комплекта
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
