"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GET_STARTED_LINK } from "@/constants/links";

interface TabContentData {
  badge: string;
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  personas: string[];
  buttonLink: string;
}

interface TabContentProps {
  content: TabContentData;
  index?: number;
}

export const TabContent = ({ content, index = 0 }: TabContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        delay: index * 0.1,
      }}
      className="grid gap-12 place-items-center lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col gap-6">
        <h3 className="text-3xl font-medium leading-tight text-gray-950 lg:text-4xl">
          {content.title}
        </h3>
        <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line lg:text-xl">
          {content.description}
        </p>

        <div className="hidden mt-4 space-y-3 lg:block">
          {content.personas.map((persona, personaIndex) => (
            <div key={personaIndex} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-1 h-1 mt-3 bg-gray-400 rounded-full"></div>
              <span className="font-light text-gray-600">{persona}</span>
            </div>
          ))}
        </div>

        <Link 
          href={content.buttonLink}
          className="mt-6 w-fit inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/75 h-10 rounded-md px-6 no-underline"
          target={content.buttonLink === GET_STARTED_LINK ? "_self" : "_blank"}
          rel={content.buttonLink === GET_STARTED_LINK ? "" : "noopener noreferrer"}
        >
          {content.buttonText}
        </Link>
      </div>
      <Image
        src={content.imageSrc}
        alt={content.imageAlt}
        width={400}
        height={300}
        className="w-full max-w-md row-start-1 shadow-lg rounded-xl lg:max-w-full"
      />
    </motion.div>
  );
};
