"use client";

const STEPS = [
  { num: 1, label: "Предметы" },
  { num: 2, label: "Кастомизация" },
  { num: 3, label: "Упаковка" },
  { num: 4, label: "Заказ" },
];

export function StepIndicator({
  current,
  onStepClick,
}: {
  current: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {STEPS.map((step, i) => {
        const isCompleted = step.num < current;
        const isCurrent = step.num === current;
        const isClickable = isCompleted && !!onStepClick;

        const circle = (
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-medium transition-colors ${
              isCurrent
                ? "bg-gold text-bg-primary"
                : isCompleted
                  ? "bg-gold/20 text-gold"
                  : "bg-bg-card text-text-muted"
            }`}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.num
            )}
          </div>
        );

        const label = (
          <span
            className={`text-xs sm:text-sm ${
              isCurrent
                ? "text-text-primary"
                : isCompleted
                  ? "text-gold"
                  : "text-text-muted"
            }`}
          >
            {step.label}
          </span>
        );

        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-4">
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick(step.num)}
                className="flex items-center gap-2 cursor-pointer rounded-sm px-1 py-0.5 hover:bg-gold/10 transition-colors"
              >
                {circle}
                {label}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {circle}
                {label}
              </div>
            )}
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px ${
                  isCompleted ? "bg-gold/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
