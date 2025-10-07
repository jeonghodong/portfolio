'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import CardStack from './CardStack';
import CardDetailContent from '../ui/CardDetailContent';
import type { Project } from '@/app/types';

export default function Scene() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax effect + horizontal scroll
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedProject) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = -(e.clientY / window.innerHeight - 0.5) * 2; // Inverted for camera
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [selectedProject]);

  // Smooth scroll animation based on mouse X position
  useEffect(() => {
    const animate = () => {
      setScrollOffset((prev) => {
        // Mouse X maps to scroll offset: -1 (left) to 1 (right) → scroll range
        const targetOffset = -mousePosition.x * 15; // Multiply by scroll range
        const diff = targetOffset - prev;
        return prev + diff * 0.05; // Smooth lerp
      });
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition.x]);

  return (
    <>
      <div ref={canvasContainerRef} className="fixed inset-0">
        <Canvas
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera
            makeDefault
            position={[
              0, // No horizontal camera movement, cards move instead
              mousePosition.y * 1.0,
              9
            ]}
            fov={65}
          />

          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -5]} intensity={1.2} />
          <spotLight
            position={[0, 10, 5]}
            angle={0.5}
            penumbra={1}
            intensity={1.5}
            castShadow
          />

          <Suspense fallback={null}>
            <ParticleBackground />
            <CardStack
              onCardSelect={setSelectedProject}
              selectedProject={selectedProject}
              scrollOffset={scrollOffset}
            />
          </Suspense>

          {/* Camera Controls - Disabled rotation, only scroll-based horizontal movement */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />

            {/* Detail Content Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto" style={{ width: '750px', height: '650px' }}>
                <CardDetailContent project={selectedProject} onClose={() => setSelectedProject(null)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
