"use client";

import type { Project } from "@/app/types";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Image from "next/image";

interface CardDetailContentProps {
  project: Project;
  onClose: () => void;
}

export default function CardDetailContent({
  project,
  onClose,
}: CardDetailContentProps) {
  const { language, t } = useLanguage();

  const displayTitle = language === "ko" ? project.title_ko : project.title_en;
  const displayDescription =
    language === "ko" ? project.description_ko : project.description_en;
  const displayLongDescription =
    language === "ko" ? project.longDescription_ko : project.longDescription_en;

  return (
    <div className="relative w-full h-full bg-card-bg/95 backdrop-blur-sm border-2 border-card-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl !p-4 sm:!p-6 md:!p-8">
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Scrollable Content with Custom Scrollbar */}
      <div className="overflow-y-auto h-full space-y-6 sm:space-y-8 md:space-y-12 custom-scrollbar">
        {/* Header */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {project.featured && (
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-full">
              ⭐ {t("주요 프로젝트", "FEATURED PROJECT")}
            </span>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight">
            {displayTitle}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white font-medium">
            {displayDescription}
          </p>

          {/* Project Info */}
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{project.period}</span>
            </div>
            {project.teamSize && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{project.teamSize}</span>
              </div>
            )}
          </div>
        </div>

        {/* Project Image */}
        {project.imageUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-white/5">
            <Image
              src={project.imageUrl}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Long Description */}
        <div>
          <h3 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6 md:mb-8">
            {t("프로젝트 소개", "About This Project")}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed">
            {displayLongDescription}
          </p>
        </div>

        {/* Technologies */}
        <div>
          <h3 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6 md:mb-8">
            {t("기술 스택", "Technologies Used")}
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 bg-white/10 text-xs sm:text-sm font-medium rounded-full border border-white/20 hover:bg-white/15 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 sm:px-8 sm:py-4 bg-white text-black font-bold rounded-full text-center hover:bg-white/90 transition-colors text-sm sm:text-base md:text-lg"
            >
              {t("라이브 데모 보기", "View Live Demo")} →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 border border-white/20 font-bold rounded-full text-center hover:bg-white/20 transition-colors text-sm sm:text-base md:text-lg"
            >
              {t("GitHub에서 보기", "View on GitHub")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
