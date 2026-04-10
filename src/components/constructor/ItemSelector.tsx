"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { useConstructor } from "@/store/useConstructor";

export function ItemSelector() {
  const { selectedItems, toggleItem } = useConstructor();

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
          Выберите предметы
        </h2>
        <p className="text-text-muted">
          Отметьте, что войдёт в ваш комплект (минимум 1 предмет)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PRODUCTS.map((product, i) => {
          const isSelected = selectedItems.includes(product.id);
          return (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => toggleItem(product.id)}
              className={`relative text-left bg-bg-secondary border overflow-hidden transition-all duration-200 group ${
                isSelected
                  ? "border-gold ring-1 ring-gold/30"
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 to-transparent" />

                <div
                  className={`absolute top-3 right-3 w-6 h-6 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-gold text-bg-primary"
                      : "bg-bg-primary/60 border border-white/20 text-transparent"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="text-gold text-xs tracking-wider">
                    от {product.materials[0].price.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold mb-1">
                  {product.name}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-text-muted text-sm">
          Выбрано: <span className="text-gold font-medium">{selectedItems.length}</span> из {PRODUCTS.length}
        </p>
      </div>
    </div>
  );
}
