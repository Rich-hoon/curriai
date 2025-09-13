"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Star, Quote } from "lucide-react";

export const SocialProofSection = () => {
  const t = useTranslations();

  const testimonials = [
    {
      name: t("socialProof.testimonials.testimonial1.name"),
      role: t("socialProof.testimonials.testimonial1.role"),
      content: t("socialProof.testimonials.testimonial1.content"),
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: t("socialProof.testimonials.testimonial2.name"),
      role: t("socialProof.testimonials.testimonial2.role"),
      content: t("socialProof.testimonials.testimonial2.content"),
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: t("socialProof.testimonials.testimonial3.name"),
      role: t("socialProof.testimonials.testimonial3.role"),
      content: t("socialProof.testimonials.testimonial3.content"),
      rating: 5,
      avatar: "👨‍🎨"
    }
  ];

  const stats = [
    {
      number: t("socialProof.stats.users"),
      label: t("socialProof.stats.usersLabel")
    },
    {
      number: t("socialProof.stats.curriculums"),
      label: t("socialProof.stats.curriculumsLabel")
    },
    {
      number: t("socialProof.stats.completionRate"),
      label: t("socialProof.stats.completionRateLabel")
    }
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="text-center mb-16">
          <AnimatedContainer className="max-w-3xl mx-auto mb-12">
            <p className="mb-2 font-medium text-gray-600">
              {t("socialProof.sectionTitle")}
            </p>
            <h2 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl text-gray-950">
              {t("socialProof.title")}
            </h2>
            <p className="text-lg font-light text-gray-600">
              {t("socialProof.description")}
            </p>
          </AnimatedContainer>

          {/* Stats Grid */}
          <AnimatedContainer
            delay={0.3}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </AnimatedContainer>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
