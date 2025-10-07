'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Project } from '@/app/types';
import AudioPlayer from './AudioPlayer';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-8">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, rotateY: -15, opacity: 0, z: -100 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1, z: 0 }}
              exit={{ scale: 0.8, rotateY: 15, opacity: 0, z: -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Left: Visual */}
                <div className="space-y-6">
                  {/* Image Area */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray/20 to-transparent rounded-2xl overflow-hidden">
                    {project.imageUrl ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-9xl opacity-10 font-bold">{project.id}</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-9xl opacity-10 font-bold">{project.id}</span>
                      </div>
                    )}
                  </div>

                  {/* Audio Player */}
                  {project.audioUrl && (
                    <div className="pt-4">
                      <AudioPlayer audioUrl={project.audioUrl} label="Listen to project overview" />
                    </div>
                  )}
                </div>

                {/* Right: Details */}
                <div className="space-y-6 overflow-y-auto max-h-[70vh]">
                  {/* Featured Badge */}
                  {project.featured && (
                    <span className="inline-block px-4 py-2 bg-white text-black text-sm font-bold rounded-full">
                      ⭐ FEATURED PROJECT
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    {project.title}
                  </h2>

                  {/* Short Description */}
                  <p className="text-xl text-gray font-medium">
                    {project.description}
                  </p>

                  {/* Long Description */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-base leading-relaxed text-gray">
                      {project.longDescription}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-white/10 text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 pt-6">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-full text-center hover:bg-white/90 transition-colors"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 font-bold rounded-full text-center hover:bg-white/20 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
