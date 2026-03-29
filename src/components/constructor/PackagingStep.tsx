"use client";

import { motion } from "framer-motion";
import { PACKAGING_OPTIONS } from "@/data/products";
import { useConstructor } from "@/store/useConstructor";

export function PackagingStep() {
  const {
    packagingId,
    setPackaging,
    giftCardText,
    setGiftCardText,
    selectedItems,
    nextStep,
    prevStep,
  } = useConstructor();

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
          Упаковка ПАРЪ
        </h2>
        <p className="text-text-muted">
          Выберите, как будет упакован ваш комплект
        </p>
      </div>

      <div className="space-y-8">
        {/* Packaging */}
        <div>
          <label className="text-sm text-text-secondary font-medium mb-3 block">
            Тип упаковки
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            {PACKAGING_OPTIONS.map((pkg, i) => {
              const isSelected = packagingId === pkg.id;
              const isFree =
                pkg.freeThreshold &&
                selectedItems.length >= pkg.freeThreshold;

              return (
                <motion.button
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  onClick={() => setPackaging(pkg.id)}
                  className={`p-5 text-left border transition-all ${
                    isSelected
                      ? "border-gold bg-gold/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <h3 className="font-serif font-semibold mb-1">{pkg.name}</h3>
                  <p className="text-text-muted text-xs mb-3 leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="text-gold font-serif font-bold text-lg">
                    {isFree ? (
                      <span>
                        Бесплатно{" "}
                        <span className="text-text-muted text-xs font-normal line-through">
                          1 900 ₽
                        </span>
                      </span>
                    ) : pkg.price === 0 ? (
                      <span>
                        {selectedItems.length < (pkg.freeThreshold ?? 0)
                          ? `1 900 ₽`
                          : "Бесплатно"}
                      </span>
                    ) : (
                      `${pkg.price.toLocaleString("ru-RU")} ₽`
                    )}
                  </div>
                  {pkg.freeThreshold && !isFree && (
                    <p className="text-text-muted text-xs mt-1">
                      Бесплатно при {pkg.freeThreshold}+ предметах
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Gift card */}
        <div>
          <label className="text-sm text-text-secondary font-medium mb-2 block">
            Открытка с поздравлением{" "}
            <span className="text-text-muted">(+300 ₽)</span>
          </label>
          <textarea
            value={giftCardText}
            onChange={(e) => setGiftCardText(e.target.value)}
            placeholder="Напишите текст для открытки (необязательно)"
            maxLength={200}
            rows={3}
            className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors resize-none"
          />
          {giftCardText && (
            <p className="text-text-muted text-xs mt-1">
              {giftCardText.length}/200 символов
            </p>
          )}
        </div>
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
