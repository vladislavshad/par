"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/data/products";

export function Catalog() {
  return (
    <section id="catalog" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Каталог
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
            Что входит в комплект
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-bg-secondary border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-gold text-xs tracking-wider uppercase">
                    от{" "}
                    {product.materials[0].price.toLocaleString("ru-RU")}{" "}
                    ₽
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.materials.map((m) => (
                    <span
                      key={m.id}
                      className="text-xs text-text-secondary bg-bg-primary px-2 py-1 border border-white/5"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
