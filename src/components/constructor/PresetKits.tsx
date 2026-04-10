"use client";

import { motion } from "framer-motion";
import { PRESET_KITS } from "@/data/products";
import { useConstructor } from "@/store/useConstructor";

export function PresetKits() {
  const { applyPreset } = useConstructor();

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">
          Готовые наборы
        </h3>
        <p className="text-text-muted text-sm">
          Или соберите свой ниже
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRESET_KITS.map((kit, i) => (
          <motion.div
            key={kit.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="border border-white/10 hover:border-gold/30 transition-all duration-200 bg-bg-secondary p-5 flex flex-col"
          >
            <h4 className="font-serif font-bold text-lg">{kit.name}</h4>
            <p className="text-text-muted text-xs mb-3">{kit.subtitle}</p>
            <p className="text-gold text-xl font-semibold mb-1">
              {kit.price.toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-text-muted text-xs mb-4">
              {kit.items.length} предметов
            </p>
            <button
              onClick={() => applyPreset(kit.id)}
              className="mt-auto w-full py-2.5 text-sm font-medium bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors cursor-pointer"
            >
              Выбрать
            </button>
          </motion.div>
        ))}
      </div>

      <div className="border-b border-white/5 my-8" />
    </div>
  );
}
