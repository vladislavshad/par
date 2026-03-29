"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Выберите предметы",
    description:
      "Отметьте, что войдёт в ваш комплект: от шапки и полотенца до полного набора из 7 предметов.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Настройте под себя",
    description:
      "Для каждого предмета выберите материал, цвет и размер. Добавьте именную вышивку — имя, инициалы или фразу.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Получите комплект",
    description:
      "Выберите упаковку, добавьте открытку — и мы доставим ваш уникальный комплект в лучшем виде.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Просто
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
            Как это работает
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/30 text-gold mb-6">
                {step.icon}
              </div>
              <div className="text-gold/30 text-6xl font-serif font-bold absolute -top-4 right-4 select-none">
                {step.number}
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/constructor"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-bg-primary px-8 py-4 text-lg font-medium tracking-wide transition-colors"
          >
            Начать сборку
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
