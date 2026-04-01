"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
};

const TOWEL_IMAGE = "/images/product-towel.png";

type OverlayPosition = { top: string; left: string };

const HAT_OVERLAY_POSITIONS: Record<string, OverlayPosition> = {
  kolpak: { top: "55%", left: "48%" },
  budenovka: { top: "44%", left: "48%" },
  ushanka: { top: "40%", left: "48%" },
  panama: { top: "38%", left: "48%" },
};

const TOWEL_OVERLAY_POSITIONS: Record<string, OverlayPosition> = {
  corner: { top: "72%", left: "75%" },
  "center-edge": { top: "48%", left: "50%" },
  "wide-border": { top: "85%", left: "50%" },
};

const FONT_SIZE_BY_TYPE: Record<string, { hat: string; towel: string }> = {
  monogram: { hat: "clamp(2rem, 5vw, 3.5rem)", towel: "clamp(1.8rem, 4.5vw, 2.8rem)" },
  name: { hat: "clamp(1.1rem, 3vw, 1.8rem)", towel: "clamp(1rem, 2.8vw, 1.5rem)" },
  phrase: { hat: "clamp(0.75rem, 2vw, 1.1rem)", towel: "clamp(0.7rem, 2vw, 1rem)" },
};

const FONT_CLASSES: Record<string, string> = {
  serif: "font-serif",
  script: "italic font-serif",
  sans: "font-sans",
  oldrus: "font-serif tracking-[0.2em]",
};

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

type Props = {
  productId: "hat" | "towel";
  variantId: string;
  colorId: string;
  text: string;
  typeId: string;
  fontId: string;
  threadColor: string;
  positionId: string;
};

export function ProductPreview({
  productId,
  variantId,
  colorId,
  text,
  typeId,
  fontId,
  threadColor,
  positionId,
}: Props) {
  const isHat = productId === "hat";

  const imageSrc = isHat
    ? HAT_COLOR_IMAGES[`${variantId}-${colorId}`] ?? HAT_IMAGES[variantId] ?? HAT_IMAGES.kolpak
    : TOWEL_IMAGE;

  const imageKey = `${productId}-${variantId}-${colorId}`;

  const overlayPos = isHat
    ? HAT_OVERLAY_POSITIONS[variantId] ?? HAT_OVERLAY_POSITIONS.kolpak
    : TOWEL_OVERLAY_POSITIONS[positionId] ?? TOWEL_OVERLAY_POSITIONS.corner;

  const fontSizes = FONT_SIZE_BY_TYPE[typeId] ?? FONT_SIZE_BY_TYPE.monogram;
  const fontSize = isHat ? fontSizes.hat : fontSizes.towel;
  const fontClass = FONT_CLASSES[fontId] ?? FONT_CLASSES.serif;
  const rgb = hexToRgb(threadColor);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted bg-bg-primary/60 backdrop-blur-sm px-3 py-1.5 border border-white/5">
          Предпросмотр
        </span>
      </div>

      <div className="relative aspect-[4/3] bg-bg-primary overflow-hidden border border-white/5 group">
        <AnimatePresence initial={false}>
          <motion.div
            key={imageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, position: "absolute" as const }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc}
              alt={isHat ? "Банная шапка" : "Банное полотенце"}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {text && (
            <motion.span
              key={`overlay-${text}-${fontId}-${threadColor}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`absolute pointer-events-none select-none font-bold z-10 ${fontClass}`}
              style={{
                top: overlayPos.top,
                left: overlayPos.left,
                transform: "translate(-50%, -50%)",
                color: threadColor,
                fontSize,
                textShadow: `
                  0 0 1px ${threadColor},
                  0 1px 3px rgba(0, 0, 0, 0.4),
                  0 0 12px rgba(${rgb}, 0.2),
                  1px 1px 0 rgba(0, 0, 0, 0.15)
                `,
                letterSpacing: typeId === "monogram" ? "0.15em" : "0.06em",
                lineHeight: 1.1,
                maxWidth: "70%",
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
