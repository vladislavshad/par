"use client";

import { useConstructor } from "@/store/useConstructor";
import { StepIndicator } from "@/components/constructor/StepIndicator";
import { ItemSelector } from "@/components/constructor/ItemSelector";
import { ItemCustomizer } from "@/components/constructor/ItemCustomizer";
import { PackagingStep } from "@/components/constructor/PackagingStep";
import { OrderSummary } from "@/components/constructor/OrderSummary";
import { StickyPriceBar } from "@/components/constructor/StickyPriceBar";
import { AnimatePresence, motion } from "framer-motion";

export default function ConstructorPage() {
  const { step, setStep } = useConstructor();

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepIndicator current={step} onStepClick={setStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <ItemSelector />}
            {step === 2 && <ItemCustomizer />}
            {step === 3 && <PackagingStep />}
            {step === 4 && <OrderSummary />}
          </motion.div>
        </AnimatePresence>
      </div>

      <StickyPriceBar />
    </div>
  );
}
