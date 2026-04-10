"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { EMBROIDERY_COLORS, ENGRAVING_FONTS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

const MATERIAL_LABELS: Record<string, string> = {
  "felt-standard": "felt",
  "felt-premium": "premium",
  "felt-merino": "merino",
  "felt-fetl": "fetr",
};

function getBaseImage(variantId: string, colorId: string, materialId: string): string {
  const mat = MATERIAL_LABELS[materialId];
  if (mat) {
    return `/images/hats/base/${variantId}-${colorId}-${mat}.png`;
  }
  return `/images/hats/base/${variantId}-${colorId}.png`;
}

type Props = {
  config: ItemConfig;
  colorName: string;
  materialName: string;
};

export function HatPreview({ config, colorName, materialName }: Props) {
  const variantId = config.variantId ?? "kolpak";
  const colorId = config.colorId ?? "snow";
  const materialId = config.materialId ?? "felt-standard";

  const isNone = config.engravingTypeId === "none";
  const isLogo = config.engravingTypeId === "logo";
  const hasCustomEngraving = !isNone && !isLogo && !!config.engraving;
  const hasEngraving = isLogo || hasCustomEngraving;

  // Always use the base image — embroidery is rendered as CSS overlay
  const baseImage = getBaseImage(variantId, colorId, materialId);

  // Track which image is currently displayed (loaded) vs which is requested
  const [displayedSrc, setDisplayedSrc] = useState(baseImage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingSrcRef = useRef(baseImage);

  // When the base image changes, preload then swap
  useEffect(() => {
    if (baseImage === displayedSrc) return;
    pendingSrcRef.current = baseImage;
    setIsTransitioning(true);

    const targetSrc = baseImage;
    const img = new window.Image();
    img.src = baseImage;
    img.onload = () => {
      if (pendingSrcRef.current === targetSrc) {
        setDisplayedSrc(targetSrc);
        setIsTransitioning(false);
      }
    };
    img.onerror = () => {
      if (pendingSrcRef.current === targetSrc) {
        setDisplayedSrc(targetSrc);
        setIsTransitioning(false);
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [baseImage, displayedSrc]);

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

  const engravingFontCss = ENGRAVING_FONTS.find(
    (f) => f.id === config.engravingFont
  )?.css ?? "font-serif";

  // Determine text size based on engraving type
  const isMonogram = config.engravingTypeId === "monogram";
  const textSizeClass = isMonogram ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl";

  // Determine horizontal position based on engravingPositionId
  const isFrontSide = config.engravingPositionId === "front-side";

  return (
    <div>
      <div className="relative aspect-[4/3] bg-bg-primary overflow-hidden border border-white/5">
        <Image
          src={displayedSrc}
          alt="Банная шапка"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-200 ${isTransitioning ? "opacity-60" : "opacity-100"}`}
          priority
        />

        {/* Logo overlay: gold "ПАРЪ" text */}
        {isLogo && (
          <div
            className="absolute inset-x-0 flex items-center pointer-events-none"
            style={{ top: "55%" }}
            data-testid="logo-overlay"
          >
            <span
              className="font-serif font-bold text-2xl sm:text-3xl mx-auto"
              style={{
                color: engravingColor,
                textShadow: `0 1px 3px rgba(0,0,0,0.4), 0 0 8px ${engravingColor}40`,
                letterSpacing: "0.15em",
              }}
            >
              ПАРЪ
            </span>
          </div>
        )}

        {/* Custom engraving overlay: user text */}
        {hasCustomEngraving && (
          <div
            className={`absolute inset-x-0 flex items-center pointer-events-none ${isFrontSide ? "justify-start pl-[20%]" : "justify-center"}`}
            style={{ top: "55%" }}
            data-testid="engraving-overlay"
          >
            <span
              className={`${textSizeClass} ${engravingFontCss} drop-shadow-lg`}
              style={{
                color: engravingColor,
                textShadow: `0 1px 2px rgba(0,0,0,0.3)`,
              }}
            >
              {config.engraving}
            </span>
          </div>
        )}

        {hasEngraving && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
            <p className="text-[10px] text-white/70 tracking-wide uppercase">
              {isLogo
                ? "Фирменная вышивка ПАРЪ"
                : `Пример вышивки «${config.engraving}» — ваш текст будет выполнен в выбранном стиле`}
            </p>
          </div>
        )}
      </div>

      {hasEngraving && (
        <div className="mt-3 border border-gold/20 bg-bg-secondary p-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
              style={{ backgroundColor: engravingColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary">
                {isLogo ? (
                  <>Вышивка: <span className="text-gold font-medium">Логотип ПАРЪ</span></>
                ) : (
                  <>Вышивка: <span className="text-gold font-medium">«{config.engraving}»</span></>
                )}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {isLogo
                  ? "По центру"
                  : config.engravingPositionId === "front-side" ? "Спереди сбоку" : "Спереди по центру"}
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
