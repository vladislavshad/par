"use client";

import { motion } from "framer-motion";

export function VideoDivider() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative h-[50vh] sm:h-[60vh] overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/products.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-bg-primary/50" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div>
          <p className="text-gold tracking-[0.4em] uppercase text-xs sm:text-sm mb-4">
            Натуральные материалы
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold max-w-2xl">
            Создано с заботой
            <br />
            <span className="text-gold">о каждой детали</span>
          </h2>
        </div>
      </div>
    </motion.section>
  );
}
