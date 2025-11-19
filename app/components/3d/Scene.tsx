"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceBackground from "./SpaceBackground";
import PlanetSystem from "./PlanetSystem";
import CameraController from "./CameraController";
import CardDetailContent from "../ui/CardDetailContent";
import LanguageToggle from "../ui/LanguageToggle";
import type { Project } from "@/app/types";
import { planets, projects } from "@/app/lib/data";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Scene() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [enteringPlanetId, setEnteringPlanetId] = useState<string | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePlanetEnter = (planetId: string) => {
    setIsEntering(true);
    setEnteringPlanetId(planetId);
  };

  const handleClose = () => {
    setSelectedProject(null);
    setIsEntering(false);
    setEnteringPlanetId(null);
    setHoveredPlanetId(null);
  };

  // Get hovered planet and project info for preview
  const hoveredPlanet = hoveredPlanetId
    ? planets.find(p => p.id === hoveredPlanetId)
    : null;

  const hoveredProject = hoveredPlanet?.projectId
    ? projects.find(p => p.id === hoveredPlanet.projectId)
    : null;

  // Get entering planet for effect
  const enteringPlanet = enteringPlanetId
    ? planets.find(p => p.id === enteringPlanetId)
    : null;

  return (
    <>
      {/* Language Toggle */}
      <LanguageToggle />

      {/* Instructions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm pointer-events-none text-center px-4">
        {language === 'ko'
          ? "드래그하여 탐색 • 행성 클릭하여 선택 • 다시 클릭하여 진입"
          : "Drag to explore • Click planet to select • Click again to enter"}
      </div>

      {/* Project Preview Panel - shows when hovering over planet */}
      <AnimatePresence>
        {hoveredProject && !selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-30 w-80 max-w-[calc(100vw-3rem)]"
          >
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-5 border border-white/10">
              {/* Planet name */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-white/60 text-sm">
                  {hoveredPlanet?.name_ko} • {hoveredPlanet?.name}
                </span>
              </div>

              {/* Project title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'ko' ? hoveredProject.title_ko : hoveredProject.title_en}
              </h3>

              {/* Project description */}
              <p className="text-white/70 text-sm mb-4 line-clamp-3">
                {language === 'ko' ? hoveredProject.description_ko : hoveredProject.description_en}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hoveredProject.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/80"
                  >
                    {tech}
                  </span>
                ))}
                {hoveredProject.technologies.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-white/50">
                    +{hoveredProject.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Click hint */}
              <div className="text-center text-white/50 text-xs">
                {language === 'ko' ? "다시 클릭하여 진입" : "Click again to enter"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Selected planet indicator */}
      {isMobile && hoveredPlanetId && !selectedProject && !hoveredProject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2 text-white/80 text-sm">
            {hoveredPlanet?.name_ko} - {language === 'ko' ? '준비 중' : 'Coming Soon'}
          </div>
        </motion.div>
      )}

      {/* Planet entry transition effect */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 50, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
          >
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(100,150,255,0.6) 50%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={canvasContainerRef} className="fixed inset-0">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, isMobile ? 1.5 : 2]}
          onPointerMissed={() => {
            // Click on empty space deselects planet
            if (hoveredPlanetId && !selectedProject) {
              setHoveredPlanetId(null);
            }
          }}
        >
          <color attach="background" args={['#020010']} />
          <fog attach="fog" args={['#020010', 80, 250]} />

          <PerspectiveCamera
            makeDefault
            position={[0, 5, 35]}
            fov={60}
          />

          {/* Camera auto-movement on hover */}
          <CameraController
            targetPosition={hoveredPlanet?.position || null}
            isActive={hoveredPlanetId !== null && !selectedProject}
          />

          {/* Space Lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />

          {/* Sun-like main light */}
          <directionalLight
            position={[50, 30, 50]}
            intensity={1.5}
            color="#fff5e0"
            castShadow
          />

          {/* Subtle fill lights */}
          <pointLight position={[-30, -20, -30]} intensity={0.4} color="#4488ff" />
          <pointLight position={[20, -10, 20]} intensity={0.3} color="#ff8844" />

          {/* Rim light for planets */}
          <directionalLight
            position={[-30, 10, -20]}
            intensity={0.5}
            color="#88aaff"
          />

          <Suspense fallback={null}>
            <SpaceBackground />
            <PlanetSystem
              onPlanetSelect={setSelectedProject}
              selectedProject={selectedProject}
              onPlanetEnter={handlePlanetEnter}
              hoveredPlanetId={hoveredPlanetId}
              onPlanetHover={setHoveredPlanetId}
              isMobile={isMobile}
            />
          </Suspense>

          {/* Camera Controls - disabled when hovering for smooth auto-movement */}
          <OrbitControls
            enableZoom={!hoveredPlanetId}
            enablePan={!hoveredPlanetId}
            enableRotate={!hoveredPlanetId}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={10}
            maxDistance={80}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
          />
        </Canvas>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-40"
              style={{
                background: `radial-gradient(circle at center, rgba(20,30,60,0.95) 0%, rgba(0,0,0,0.98) 100%)`,
                backdropFilter: 'blur(10px)',
              }}
            />

            {/* Detail Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.2,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-10"
            >
              <div className="pointer-events-auto w-full max-w-[800px] h-full max-h-[700px]">
                <CardDetailContent
                  project={selectedProject}
                  onClose={handleClose}
                />
              </div>
            </motion.div>

            {/* Planet name indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-white/80 text-lg font-light tracking-widest"
            >
              {enteringPlanet && (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                  {enteringPlanet.name_ko} {language === 'ko' ? '탐사 중' : 'Exploring'}
                </span>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
