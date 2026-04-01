"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { EMBROIDERY_COLORS } from "@/data/products";
import type { ItemConfig } from "@/store/useConstructor";

const DARK_COLORS = new Set(["anthracite", "graphite", "burgundy", "cognac"]);

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

function getLogoImage(variantId: string, colorId: string, threadColorId: string): string {
  const tone = DARK_COLORS.has(colorId) ? "dark" : "light";
  const thread = threadColorId === "silver" ? "silver" : "gold";
  return `/images/hats/logo/${variantId}-${tone}-${thread}.png`;
}

function getEngravingImage(variantId: string, colorId: string, threadColorId: string, positionId: string): string {
  const tone = DARK_COLORS.has(colorId) ? "dark" : "light";
  const thread = threadColorId === "silver" ? "silver" : "gold";
  const pos = positionId === "front-side" ? "side" : "center";
  return `/images/hats/engraving/hat-${variantId}-${tone}-${thread}-${pos}.png`;
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

  const baseImage = getBaseImage(variantId, colorId, materialId);
  const logoImage = getLogoImage(variantId, colorId, config.engravingColorId ?? "gold");
  const engravingImage = getEngravingImage(
    variantId,
    colorId,
    config.engravingColorId ?? "gold",
    config.engravingPositionId ?? "front-center"
  );

  let imageSrc: string;
  if (isNone) {
    imageSrc = baseImage;
  } else if (isLogo) {
    imageSrc = logoImage;
  } else if (hasCustomEngraving) {
    imageSrc = engravingImage;
  } else {
    imageSrc = baseImage;
  }

  // Track which image is currently displayed (loaded) vs which is requested
  const [displayedSrc, setDisplayedSrc] = useState(imageSrc);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingSrcRef = useRef(imageSrc);

  // When the desired image changes, start loading it in background
  useEffect(() => {
    if (imageSrc === displayedSrc) return;
    pendingSrcRef.current = imageSrc;
    setIsTransitioning(true);

    // Preload the new image via a plain <img> to avoid unmounting Next/Image
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      // Only apply if this is still the latest requested src
      if (pendingSrcRef.current === img.src) {
        setDisplayedSrc(img.src);
        setIsTransitioning(false);
      }
    };
    img.onerror = () => {
      if (pendingSrcRef.current === img.src) {
        setDisplayedSrc(img.src);
        setIsTransitioning(false);
      }
    };
  }, [imageSrc, displayedSrc]);

  const engravingColor = EMBROIDERY_COLORS.find(
    (c) => c.id === config.engravingColorId
  )?.hex ?? "#C9A96E";

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
        {hasEngraving && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
            <p className="text-[10px] text-white/70 tracking-wide uppercase">
              {isLogo
                ? "Фирменная вышивка ПАРЪ"
                : "Пример вышивки «АБ» — ваши инициалы будут выполнены в выбранном стиле"}
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
