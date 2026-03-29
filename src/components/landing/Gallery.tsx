"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PRESET_KITS } from "@/data/products";
import Link from "next/link";

export function Gallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Коллекции ПАРЪ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Готовые комплекты
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Не хотите собирать сами? Выберите одну из наших коллекций
            или используйте как отправную точку для конструктора.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRESET_KITS.map((kit, i) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="group bg-bg-secondary border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/hero-bath-set-flatlay.png"
                  alt={kit.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/30 to-transparent" />
                {kit.id === "master" && (
                  <div className="absolute top-4 right-4 bg-gold text-bg-primary text-xs font-medium px-3 py-1 tracking-wider uppercase">
                    Хит продаж
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-gold text-xs tracking-[0.2em] uppercase mb-1">{kit.subtitle}</p>
                <h3 className="font-serif text-2xl font-bold mb-2">{kit.name}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{kit.description}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-gold text-2xl font-serif font-bold">
                      {kit.price.toLocaleString("ru-RU")}
                    </span>
                    <span className="text-text-muted text-sm ml-1">₽</span>
                  </div>
                  <Link
                    href="/constructor"
                    className="text-gold hover:text-gold-light text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Выбрать
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
