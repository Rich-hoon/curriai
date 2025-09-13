"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@myapp/ui/components/badge";
import { Input } from "@myapp/ui/components/input";
import { ArrowRight, Play, Target, Sparkles } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import Image from "next/image";
// import { useTheme } from "next-themes"; // Not used in this component
import { cn } from "@myapp/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

export const CurriAIHero = () => {
  const t = useTranslations();
  // Theme is available but not used in this component
  const [learningGoal, setLearningGoal] = useState("");

  // Removed click handlers for build compatibility

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLearningGoal(e.target.value);
  };

  const exampleGoals = [
    "Next.js 프론트엔드 취업",
    "React Native 앱 개발",
    "Python 데이터 사이언스",
    "AWS 클라우드 아키텍트"
  ];

  return (
    <>
      <section className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden pb-0"
      )}>
        <div className="flex flex-col max-w-6xl gap-12 pt-6 mx-auto sm:gap-24">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="gap-2 scale-125 bg-blue-50 border-blue-200 text-blue-700"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t("hero.badge")}</span>
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 inline-block text-4xl font-semibold leading-tight text-transparent whitespace-pre-line bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text drop-shadow-2xl sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight xl:text-8xl xl:leading-tight"
            >
              {t("hero.title")}
            </motion.h1>

            <div className="flex flex-col gap-4">
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-md relative z-10 max-w-[550px] font-medium text-muted-foreground/70 sm:text-xl whitespace-pre-line"
              >
                {t("hero.description")}
              </motion.p>
            </div>

            {/* Interactive Learning Goal Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 w-full max-w-md"
            >
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="예: Next.js 프론트엔드 취업"
                  value={learningGoal}
                  onChange={handleInputChange}
                  className="pl-10 pr-4 py-3 text-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </div>
              
              {/* Example Goals */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {exampleGoals.map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => setLearningGoal(goal)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex justify-center gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ArrowRight className="w-5 h-5" />
                  {t("common.getStarted")}
                </Link>
              </div>

              {/* Tutorial Button */}
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium transition-all duration-200 text-muted-foreground border border-muted-foreground/30 rounded-lg hover:bg-muted/50 hover:text-blue-600 hover:border-blue-200"
              >
                <Play className="w-4 h-4 text-blue-500" />
                {t("hero.tutorial")}
              </a>
            </motion.div>

            {/* Image with Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative pt-2"
            >
              <MockupFrame size="small">
                <Mockup type="responsive">
                  <Image
                    src="/images/preview.png"
                    alt={t("hero.imageAlt")}
                    width={1248}
                    height={765}
                    priority
                  />
                </Mockup>
              </MockupFrame>
              <Glow variant="top" />
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
};
