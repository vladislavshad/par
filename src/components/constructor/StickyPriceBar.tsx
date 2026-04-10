"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useConstructor } from "@/store/useConstructor";

const stepCta: Record<number, string> = {
  1: "Далее — настроить",
  2: "Далее — упаковка",
  3: "Далее — оформить",
};

export function StickyPriceBar() {
  const { step, selectedItems, getTotal, nextStep, prevStep } =
    useConstructor();

  if (step === 4) return null;

  const total = getTotal();
  const count = selectedItems.length;
  const isDisabled = step === 1 && count === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="text-text-muted hover:text-text-primary text-sm transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Назад</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-text-muted flex-shrink-0">
            <span className="bg-gold/10 text-gold text-xs font-medium px-2 py-0.5">
              {count}
            </span>
            <span className="hidden sm:inline">
              {count === 1
                ? "предмет"
                : count >= 2 && count <= 4
                  ? "предмета"
                  : "предметов"}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.span
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-gold font-serif font-bold text-lg sm:text-xl"
            >
              {total.toLocaleString("ru-RU")} ₽
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={nextStep}
          disabled={isDisabled}
          className="bg-gold hover:bg-gold-light disabled:bg-bg-card disabled:text-text-muted text-bg-primary px-4 sm:px-6 py-2.5 text-sm font-medium tracking-wide transition-colors flex items-center gap-2 flex-shrink-0"
        >
          {stepCta[step]}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
