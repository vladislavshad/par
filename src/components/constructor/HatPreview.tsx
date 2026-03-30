"use client";

import Image from "next/image";
import { EMBROIDERY_COLORS, ENGRAVING_FONTS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

const HAT_IMAGES: Record<string, string> = {
  kolpak: "/images/hat-kolpak.png",
  budenovka: "/images/hat-budenovka.png",
  ushanka: "/images/hat-ushanka.png",
  panama: "/images/hat-panama.png",
};

const OVERLAY_POSITIONS: Record<string, { top: string; left: string }> = {
  kolpak: { top: "62%", left: "50%" },
  budenovka: { top: "45%", left: "50%" },
  ushanka: { top: "42%", left: "50%" },
  panama: { top: "40%", left: "50%" },
};

const FONT_SIZE_BY_TYPE: Record<string, string> = {
  monogram: "2.5rem",
  name: "1.5rem",
  phrase: "1rem",
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
  const imageSrc = HAT_IMAGES[variantId] ?? HAT_IMAGES.kolpak;
  const overlayPos = OVERLAY_POSITIONS[variantId] ?? OVERLAY_POSITIONS.kolpak;

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

  const fontClass = FONT_CSS[config.engravingFont ?? "serif"] ?? "";
  const fontSize = FONT_SIZE_BY_TYPE[config.engravingTypeId ?? "monogram"] ?? "2.5rem";

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
        {config.engraving && (
          <span
            className={`absolute pointer-events-none select-none font-bold ${fontClass}`}
            style={{
              top: overlayPos.top,
              left: overlayPos.left,
              transform: "translate(-50%, -50%)",
              color: engravingColor,
              fontSize,
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              letterSpacing: "0.05em",
            }}
          >
            {config.engraving}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
        <span>Цвет: <span className="text-text-secondary">{colorName}</span></span>
        <span>Материал: <span className="text-text-secondary">{materialName}</span></span>
      </div>
    </div>
  );
}
