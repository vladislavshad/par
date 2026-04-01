"use client";

import Image from "next/image";
import { EMBROIDERY_COLORS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

const HAT_IMAGES: Record<string, string> = {
  kolpak: "/images/hat-kolpak.png",
  budenovka: "/images/hat-budenovka.png",
  ushanka: "/images/hat-ushanka.png",
  panama: "/images/hat-panama.png",
};

const HAT_COLOR_IMAGES: Record<string, string> = {
  "kolpak-snow": "/images/hat-kolpak.png",
  "kolpak-cream": "/images/hats/kolpak-cream.png",
  "kolpak-anthracite": "/images/hats/kolpak-anthracite.png",
  "budenovka-snow": "/images/hat-budenovka.png",
  "budenovka-cream": "/images/hats/budenovka-cream.png",
  "budenovka-anthracite": "/images/hats/budenovka-anthracite.png",
  "ushanka-snow": "/images/hat-ushanka.png",
  "ushanka-cream": "/images/hats/ushanka-cream.png",
  "ushanka-anthracite": "/images/hats/ushanka-anthracite.png",
  "panama-snow": "/images/hat-panama.png",
  "panama-cream": "/images/hats/panama-cream.png",
  "panama-anthracite": "/images/hats/panama-anthracite.png",
};

const DARK_COLORS = new Set(["anthracite", "graphite", "burgundy", "cognac"]);

function getEngravingImage(colorId: string, threadColorId: string, positionId: string): string {
  const tone = DARK_COLORS.has(colorId) ? "dark" : "light";
  const thread = threadColorId === "silver" ? "silver" : "gold";
  const pos = positionId === "front-side" ? "side" : "center";
  return `/images/hats/engraving/hat-${tone}-${thread}-${pos}.png`;
}

type Props = {
  config: ItemConfig;
  colorName: string;
  materialName: string;
};

export function HatPreview({ config, colorName, materialName }: Props) {
  const variantId = config.variantId ?? "kolpak";
  const colorId = config.colorId ?? "snow";
  const colorKey = `${variantId}-${colorId}`;

  const hasEngraving = !!config.engraving;

  const shapeImage = HAT_COLOR_IMAGES[colorKey] ?? HAT_IMAGES[variantId] ?? HAT_IMAGES.kolpak;
  const engravingImage = getEngravingImage(
    colorId,
    config.engravingColorId ?? "gold",
    config.engravingPositionId ?? "front-center"
  );

  const imageSrc = hasEngraving ? engravingImage : shapeImage;

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

  return (
    <div>
      <div className="relative aspect-[4/3] bg-bg-primary overflow-hidden border border-white/5">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt="Банная шапка"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
        {hasEngraving && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
            <p className="text-[10px] text-white/70 tracking-wide uppercase">
              Пример вышивки «АБ» — ваши инициалы будут выполнены в выбранном стиле
            </p>
          </div>
        )}
      </div>

      {/* Embroidery summary */}
      {hasEngraving && (
        <div className="mt-3 border border-gold/20 bg-bg-secondary p-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
              style={{ backgroundColor: engravingColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary">
                Вышивка:{" "}
                <span className="text-gold font-medium">«{config.engraving}»</span>
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {config.engravingPositionId === "front-side" ? "Спереди сбоку" : "Спереди по центру"}
                {" · "}
                {EMBROIDERY_COLORS.find((c) => c.id === config.engravingColorId)?.name}
              </p>
            </div>
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
