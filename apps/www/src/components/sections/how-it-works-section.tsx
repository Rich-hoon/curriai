"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Target, Brain, BookOpen } from "lucide-react";

export const HowItWorksSection = () => {
  const t = useTranslations();

  const steps = [
    {
      icon: Target,
      title: t("howItWorks.steps.step1.title"),
      description: t("howItWorks.steps.step1.description"),
      step: "01"
    },
    {
      icon: Brain,
      title: t("howItWorks.steps.step2.title"),
      description: t("howItWorks.steps.step2.description"),
      step: "02"
    },
    {
      icon: BookOpen,
      title: t("howItWorks.steps.step3.title"),
      description: t("howItWorks.steps.step3.description"),
      step: "03"
    }
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <AnimatedContainer className="max-w-3xl">
            <p className="mb-2 font-medium text-gray-600">
              {t("howItWorks.sectionTitle")}
            </p>
            <h2 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl text-gray-950">
              {t("howItWorks.title")
                .split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t("howItWorks.title").split("\n").length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
            </h2>
            <p className="text-lg font-light text-gray-600">
              {t("howItWorks.description")}
            </p>
          </AnimatedContainer>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -translate-y-1/2" />
          
          <AnimatedContainer
            delay={0.4}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                className="relative"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold z-10">
                  {step.step}
                </div>
                
                {/* Step card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>["className"];
  children: React.ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
