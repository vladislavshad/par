"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { useConstructor } from "@/store/useConstructor";
import { HatPreview } from "@/components/constructor/HatPreview";
import { HatOptionsPanel } from "@/components/constructor/HatOptionsPanel";

const hatProduct = PRODUCTS.find((p) => p.id === "hat")!;

export default function HatConstructorPage() {
  const router = useRouter();
  const {
    itemConfigs,
    getItemPrice,
    setStep,
  } = useConstructor();

  useEffect(() => {
    const state = useConstructor.getState();
    if (!state.selectedItems.includes("hat")) {
      state.toggleItem("hat");
    }
  }, []);

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
  const selectedColor = hatProduct.colors.find((c) => c.id === config.colorId);
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

        {/* Custom order contact form */}
        <CustomContactForm />
      </div>
    </div>
  );
}

function CustomContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: name.trim(),
          contactPhone: phone.trim(),
          contactMethod: "telegram",
          items: [{ name: "Кастомный запрос", material: "-", color: "-", price: 0 }],
          packaging: "-",
          giftCardText: message.trim() || undefined,
          total: 0,
        }),
      });
      setSent(true);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div id="custom-contact-form" className="mt-16 border border-gold/20 bg-bg-secondary p-8 text-center">
        <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">Заявка отправлена!</h3>
        <p className="text-text-muted text-sm">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div id="custom-contact-form" className="mt-16 border border-white/10 bg-bg-secondary p-6 sm:p-8">
      <h3 className="font-serif text-xl font-bold mb-2">Кастомный заказ</h3>
      <p className="text-text-muted text-sm mb-6">
        Логотип компании, нестандартный рисунок, корпоративный тираж — обсудим любой запрос.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">Имя *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
            className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary mb-1 block">Телефон *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-sm text-text-secondary mb-1 block">Опишите ваш запрос</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Например: хотим нанести логотип компании на 50 шапок для корпоратива"
          rows={3}
          className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors resize-none"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={sending || !name.trim() || !phone.trim()}
        className="bg-gold hover:bg-gold-light disabled:opacity-50 text-bg-primary px-8 py-3 font-medium tracking-wide transition-colors"
      >
        {sending ? "Отправка..." : "Отправить заявку"}
      </button>
    </div>
  );
}
