"use client";

import { useLanguage } from "@/src/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50">
      <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-0.5 sm:p-1">
        <button
          onClick={() => setLanguage("ko")}
          className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            language === "ko" ? "text-black" : "text-white hover:text-white/80"
          }`}
        >
          {language === "ko" && (
            <motion.div
              layoutId="language-indicator"
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">한글</span>
        </button>

        <button
          onClick={() => setLanguage("en")}
          className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            language === "en" ? "text-black" : "text-white hover:text-white/80"
          }`}
        >
          {language === "en" && (
            <motion.div
              layoutId="language-indicator"
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">English</span>
        </button>
      </div>
    </div>
  );
}
