"use client";

const STEPS = [
  { num: 1, label: "Предметы" },
  { num: 2, label: "Кастомизация" },
  { num: 3, label: "Упаковка" },
  { num: 4, label: "Заказ" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                step.num === current
                  ? "bg-gold text-bg-primary"
                  : step.num < current
                    ? "bg-gold/20 text-gold"
                    : "bg-bg-card text-text-muted"
              }`}
            >
              {step.num < current ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`hidden sm:inline text-sm ${
                step.num === current
                  ? "text-text-primary"
                  : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-px ${
                step.num < current ? "bg-gold/40" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
