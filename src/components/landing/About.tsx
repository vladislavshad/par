"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
              Философия ПАРЪ
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8">
              Каждый комплект —
              <br />
              <span className="text-gold">произведение</span>
            </h2>
            <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
              <p>
                ПАРЪ — это мануфактура банных комплектов, где каждая деталь
                создаётся под вас. Мы используем только натуральные материалы:
                лён, бамбук, мериносовая шерсть, натуральная кожа.
              </p>
              <p>
                Онлайн-конструктор позволяет настроить всё: от материала
                и цвета до именной вышивки золотом и формы шапки. 
                Это не масс-маркет — это ваш персональный комплект.
              </p>
              <p>
                Упаковка — часть подарка. От льняной сумки с тиснением
                до VIP-кейса из полированной кожи с бархатной подкладкой.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
                { number: "7", label: "предметов\nв конструкторе" },
                { number: "5+", label: "материалов\nна каждый предмет" },
                { number: "100%", label: "натуральные\nматериалы" },
                { number: "∞", label: "вариантов\nвашего комплекта" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-bg-primary border border-white/5 p-6 sm:p-8 text-center"
                >
                  <div className="text-gold text-3xl sm:text-4xl font-serif font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-muted text-sm whitespace-pre-line">
                    {stat.label}
                  </div>
                </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
