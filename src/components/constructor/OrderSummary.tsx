"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PRODUCTS,
  PACKAGING_OPTIONS,
  EMBROIDERY_COLORS,
  EMBROIDERY_TYPES,
} from "@/data/products";
import { useConstructor } from "@/store/useConstructor";

export function OrderSummary() {
  const {
    selectedItems,
    itemConfigs,
    packagingId,
    giftCardText,
    contactName,
    contactPhone,
    contactMethod,
    setContactName,
    setContactPhone,
    setContactMethod,
    getItemPrice,
    getTotal,
    prevStep,
  } = useConstructor();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const selectedProducts = PRODUCTS.filter((p) =>
    selectedItems.includes(p.id)
  );
  const packaging = PACKAGING_OPTIONS.find((p) => p.id === packagingId);
  const total = getTotal();

  const handleSubmit = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      setError("Пожалуйста, заполните имя и телефон");
      return;
    }
    setError("");
    setSubmitting(true);

    const items = selectedProducts.map((product) => {
      const config = itemConfigs[product.id];
      const material = product.materials.find((m) => m.id === config?.materialId);
      const color = product.colors.find((c) => c.id === config?.colorId);
      const size = product.sizes?.find((s) => s.id === config?.sizeId);
      const variant = product.variants?.find((v) => v.id === config?.variantId);
      const trimColor = product.trimColors?.find((c) => c.id === config?.trimColorId);
      const embColor = EMBROIDERY_COLORS.find((c) => c.id === config?.engravingColorId);
      const embType = EMBROIDERY_TYPES.find((t) => t.id === config?.engravingTypeId);
      const embPos = product.engravingPositions?.find((p) => p.id === config?.engravingPositionId);

      return {
        name: product.name,
        material: material?.name ?? "",
        color: color?.name ?? "",
        size: size?.name,
        variant: variant?.name,
        trimColor: trimColor?.name,
        engraving: config?.engraving || undefined,
        engravingColor: embColor?.name,
        engravingType: embType?.name,
        engravingPosition: embPos?.name,
        price: getItemPrice(product.id),
      };
    });

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          contactMethod,
          items,
          packaging: packaging?.name ?? "Не выбрано",
          giftCardText: giftCardText || undefined,
          total,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Ошибка при отправке. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 bg-gold/10 text-gold flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
          Заказ принят!
        </h2>
        <p className="text-text-muted text-lg mb-2">
          Мы свяжемся с вами в ближайшее время через{" "}
          {contactMethod === "telegram" ? "Telegram" : "WhatsApp"}.
        </p>
        <p className="text-gold text-xl font-serif font-bold">
          Итого: {total.toLocaleString("ru-RU")} ₽
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
          Ваш комплект ПАРЪ
        </h2>
        <p className="text-text-muted">
          Проверьте состав и оформите заказ
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-3">
          {selectedProducts.map((product) => {
            const config = itemConfigs[product.id];
            const material = product.materials.find((m) => m.id === config?.materialId);
            const color = product.colors.find((c) => c.id === config?.colorId);
            const size = product.sizes?.find((s) => s.id === config?.sizeId);
            const variant = product.variants?.find((v) => v.id === config?.variantId);
            const trimColor = product.trimColors?.find((c) => c.id === config?.trimColorId);

            return (
              <div
                key={product.id}
                className="bg-bg-secondary border border-white/5 p-4 flex justify-between items-start"
              >
                <div>
                  <h4 className="font-serif font-semibold">{product.name}</h4>
                  <div className="text-text-muted text-sm mt-1 space-y-0.5">
                    <p>{material?.name}</p>
                    <p className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block border border-white/20"
                        style={{ backgroundColor: color?.hex }}
                      />
                      {color?.name}
                    </p>
                    {variant && <p>Форма: {variant.name}</p>}
                    {size && <p>Размер: {size.name}</p>}
                    {trimColor && <p>Кант: {trimColor.name}</p>}
                    {config?.engraving && (
                      <p className="text-gold">
                        Вышивка: «{config.engraving}»
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-gold font-serif font-bold text-right whitespace-nowrap">
                  {getItemPrice(product.id).toLocaleString("ru-RU")} ₽
                </div>
              </div>
            );
          })}

          <div className="bg-bg-secondary border border-white/5 p-4 flex justify-between items-start">
            <div>
              <h4 className="font-serif font-semibold">Упаковка</h4>
              <p className="text-text-muted text-sm mt-1">{packaging?.name}</p>
            </div>
            <div className="text-gold font-serif font-bold text-right">
              {packaging?.freeThreshold && selectedItems.length >= packaging.freeThreshold
                ? "Бесплатно"
                : packaging?.price === 0
                  ? selectedItems.length < (packaging.freeThreshold ?? 0) ? "1 900 ₽" : "Бесплатно"
                  : `${packaging?.price.toLocaleString("ru-RU")} ₽`}
            </div>
          </div>

          {giftCardText && (
            <div className="bg-bg-secondary border border-white/5 p-4 flex justify-between items-start">
              <div>
                <h4 className="font-serif font-semibold">Открытка</h4>
                <p className="text-text-muted text-sm mt-1 italic">«{giftCardText}»</p>
              </div>
              <div className="text-gold font-serif font-bold">300 ₽</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bg-secondary border border-white/5 p-6 sticky top-24">
            <div className="text-center mb-6 pb-6 border-b border-white/5">
              <p className="text-text-muted text-sm mb-1">Итого</p>
              <p className="text-gold text-3xl font-serif font-bold">
                {total.toLocaleString("ru-RU")} ₽
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Ваше имя *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Иван"
                  className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Телефон *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Как с вами связаться?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setContactMethod("telegram")}
                    className={`py-2.5 text-sm border transition-colors ${
                      contactMethod === "telegram"
                        ? "border-gold bg-gold/5 text-gold"
                        : "border-white/10 text-text-secondary hover:border-white/20"
                    }`}
                  >
                    Telegram
                  </button>
                  <button
                    onClick={() => setContactMethod("whatsapp")}
                    className={`py-2.5 text-sm border transition-colors ${
                      contactMethod === "whatsapp"
                        ? "border-gold bg-gold/5 text-gold"
                        : "border-white/10 text-text-secondary hover:border-white/20"
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-bg-primary py-4 font-medium tracking-wide transition-colors text-lg"
              >
                {submitting ? "Отправка..." : "Оформить заказ"}
              </button>

              <p className="text-text-muted text-xs text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={prevStep}
          className="border border-white/10 hover:border-white/20 text-text-secondary px-6 py-3 font-medium tracking-wide transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
      </div>
    </div>
  );
}
