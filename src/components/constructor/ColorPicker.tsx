"use client";

import type { Color } from "@/data/products";

type Props = {
  colors: Color[];
  selected: string;
  onSelect: (id: string) => void;
};

export function ColorPicker({ colors, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onSelect(color.id)}
          title={color.name}
          className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full border-2 transition-[border-color,transform] duration-150 relative ${
            selected === color.id
              ? "border-gold scale-110"
              : "border-transparent hover:border-white/30"
          }`}
        >
          <span
            className="absolute inset-1 rounded-full"
            style={{ backgroundColor: color.hex }}
          />
        </button>
      ))}
    </div>
  );
}
