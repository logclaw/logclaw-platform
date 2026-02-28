"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  "Git Connect",
  "Tenant Info",
  "Components",
  "Ticketing",
  "LLM",
  "Review",
  "Deploy",
];

interface WizardShellProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export default function WizardShell({
  currentStep,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  children,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-white bg-bujo-dot bg-bujo-dot pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12 overflow-x-auto pb-2">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const done = stepNum < currentStep;
            const active = stepNum === currentStep;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      done
                        ? "bg-black text-white border-black"
                        : active
                        ? "bg-brand-accent text-white border-brand-accent"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : stepNum}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-mono whitespace-nowrap ${
                      active ? "text-black font-bold" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 mx-1 mb-5 transition-colors ${
                      done ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {children}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onBack}
            disabled={currentStep === 1}
            className="px-6 py-3 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="px-6 py-3 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
