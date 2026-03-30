import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { VideoDivider } from "@/components/landing/VideoDivider";
import { Catalog } from "@/components/landing/Catalog";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Gallery } from "@/components/landing/Gallery";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <VideoDivider />
      <Catalog />
      <HowItWorks />
      <Gallery />
      <Footer />
    </>
  );
}
