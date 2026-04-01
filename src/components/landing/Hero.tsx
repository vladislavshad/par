"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/40 to-bg-primary" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-gold tracking-[0.4em] uppercase text-xs sm:text-sm mb-6">
            Ручная работа &bull; Натуральные материалы &bull; Персонализация
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-6">
            Ваш комплект.
            <br />
            <span className="text-gold">Ваш характер.</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
            Соберите уникальный банный комплект в&nbsp;онлайн&#8209;конструкторе.
            7&nbsp;предметов, 5+&nbsp;материалов, именная вышивка золотом — каждая деталь под&nbsp;вас.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/constructor"
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-bg-primary px-8 py-4 text-lg font-medium tracking-wide transition-colors"
            >
              Создать комплект
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#catalog"
              className="inline-flex items-center justify-center border border-gold/30 hover:border-gold text-gold px-8 py-4 text-lg tracking-wide transition-colors"
            >
              Смотреть каталог
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
