"use client";

import Image from "next/image";
import { EMBROIDERY_COLORS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

// Default hat images by shape
const HAT_IMAGES: Record<string, string> = {
  kolpak: "/images/hat-kolpak.png",
  budenovka: "/images/hat-budenovka.png",
  ushanka: "/images/hat-ushanka.png",
  panama: "/images/hat-panama.png",
};

// Color-specific images (kolpak only for now)
const HAT_COLOR_IMAGES: Record<string, string> = {
  "kolpak-snow": "/images/hat-kolpak.png",
  "kolpak-cream": "/images/hats/kolpak-cream.png",
  "kolpak-anthracite": "/images/hats/kolpak-anthracite.png",
};

const FONT_SIZE_BY_TYPE: Record<string, string> = {
  monogram: "3rem",
  name: "1.75rem",
  phrase: "1.15rem",
};

const FONT_CSS: Record<string, string> = {
  serif: "font-serif",
  script: "italic font-serif",
  sans: "",
  oldrus: "font-serif tracking-[0.2em]",
};

type Props = {
  config: ItemConfig;
  colorName: string;
  materialName: string;
};

export function HatPreview({ config, colorName, materialName }: Props) {
  const variantId = config.variantId ?? "kolpak";
  const colorId = config.colorId ?? "snow";
  const colorKey = `${variantId}-${colorId}`;
  const imageSrc = HAT_COLOR_IMAGES[colorKey] ?? HAT_IMAGES[variantId] ?? HAT_IMAGES.kolpak;

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

  const fontClass = FONT_CSS[config.engravingFont ?? "serif"] ?? "";
  const fontSize = FONT_SIZE_BY_TYPE[config.engravingTypeId ?? "monogram"] ?? "3rem";

  return (
    <div>
      <div className="relative aspect-[4/3] bg-bg-primary overflow-hidden border border-white/5">
        <Image
          src={imageSrc}
          alt="Банная шапка"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Embroidery preview */}
      {config.engraving ? (
        <div className="mt-3 border border-gold/20 bg-bg-secondary">
          <div className="px-3 py-1.5 border-b border-white/5">
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase">Именная вышивка</span>
          </div>
          <div className="flex gap-4 p-4">
            {/* Reference photo */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden border border-white/10">
              <Image
                src="/images/hats/embroidery-example.png"
                alt="Пример именной вышивки"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            {/* User's selection */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-xl font-bold mb-2 ${fontClass}`}
                style={{
                  color: engravingColor,
                  letterSpacing: "0.1em",
                }}
              >
                «{config.engraving}»
              </p>
              <div className="space-y-1 text-xs text-text-muted">
                <p>
                  Цвет нити:{" "}
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                      style={{ backgroundColor: engravingColor }}
                    />
                    <span className="text-text-secondary">
                      {EMBROIDERY_COLORS.find((c) => c.id === config.engravingColorId)?.name}
                    </span>
                  </span>
                </p>
                <p>Расположение: <span className="text-text-secondary">{config.engravingPositionId === "front-side" ? "Спереди сбоку" : "Спереди по центру"}</span></p>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3">
            <p className="text-[10px] text-text-muted italic">Пример вышивки на фото — ваши инициалы будут выполнены в выбранном стиле</p>
          </div>
        </div>
      ) : (
        <div className="mt-3 border border-dashed border-white/10 bg-bg-secondary/50">
          <div className="flex items-center justify-center py-6 px-4">
            <span className="text-text-muted text-sm">Введите текст вышивки справа →</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
        <span>Цвет: <span className="text-text-secondary">{colorName}</span></span>
        <span>Материал: <span className="text-text-secondary">{materialName}</span></span>
      </div>
    </div>
  );
}
