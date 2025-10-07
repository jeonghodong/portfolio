'use client';

import type { Project } from '@/app/types';
import AudioPlayer from './AudioPlayer';

interface CardDetailContentProps {
  project: Project;
  onClose: () => void;
}

export default function CardDetailContent({ project, onClose }: CardDetailContentProps) {
  return (
    <div className="relative w-full h-full bg-card-bg/95 backdrop-blur-sm border-2 border-card-border rounded-3xl overflow-hidden shadow-2xl">
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-full p-8 md:p-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          {project.featured && (
            <span className="inline-block px-4 py-2 bg-white text-black text-sm font-bold rounded-full">
              ⭐ FEATURED PROJECT
            </span>
          )}

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            {project.title}
          </h2>

          <p className="text-xl text-gray font-medium">
            {project.description}
          </p>
        </div>

        {/* Audio Player */}
        {project.audioUrl && (
          <div className="pt-4">
            <AudioPlayer audioUrl={project.audioUrl} label="Listen to overview" />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Long Description */}
        <div>
          <h3 className="text-2xl font-bold mb-4">About This Project</h3>
          <p className="text-lg leading-relaxed text-gray">
            {project.longDescription}
          </p>
        </div>

        {/* Technologies */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Technologies Used</h3>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-5 py-2 bg-white/10 text-sm font-medium rounded-full border border-white/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-full text-center hover:bg-white/90 transition-colors text-lg"
            >
              View Live Demo →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-8 py-4 bg-white/10 border border-white/20 font-bold rounded-full text-center hover:bg-white/20 transition-colors text-lg"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
