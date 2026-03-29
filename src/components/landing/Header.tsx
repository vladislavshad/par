"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-gold text-2xl sm:text-3xl font-serif font-bold tracking-[0.15em]">
              ПАРЪ
            </span>
            <span className="hidden sm:inline text-text-muted text-[10px] tracking-[0.35em] uppercase border-l border-gold/30 pl-3">
              мануфактура
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/#about"
              className="text-text-secondary hover:text-gold transition-colors text-sm tracking-wide"
            >
              О нас
            </a>
            <a
              href="/#catalog"
              className="text-text-secondary hover:text-gold transition-colors text-sm tracking-wide"
            >
              Каталог
            </a>
            <a
              href="/#how-it-works"
              className="text-text-secondary hover:text-gold transition-colors text-sm tracking-wide"
            >
              Как это работает
            </a>
            <a
              href="/#gallery"
              className="text-text-secondary hover:text-gold transition-colors text-sm tracking-wide"
            >
              Коллекции
            </a>
            <Link
              href="/constructor"
              className="bg-gold hover:bg-gold-light text-bg-primary px-5 py-2.5 text-sm font-medium tracking-wide transition-colors"
            >
              Собрать комплект
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-primary p-2"
            aria-label="Меню"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            <a href="/#about" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-gold transition-colors py-2">О нас</a>
            <a href="/#catalog" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-gold transition-colors py-2">Каталог</a>
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-gold transition-colors py-2">Как это работает</a>
            <a href="/#gallery" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-gold transition-colors py-2">Коллекции</a>
            <Link href="/constructor" onClick={() => setMenuOpen(false)} className="block bg-gold hover:bg-gold-light text-bg-primary px-5 py-3 text-center font-medium tracking-wide transition-colors">
              Собрать комплект
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
