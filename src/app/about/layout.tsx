import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О мануфактуре — ПАРЪ",
  description:
    "Ручная работа, натуральные материалы, персональный подход. Узнайте, как мы создаём премиальные банные комплекты.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
