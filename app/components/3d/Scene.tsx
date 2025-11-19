"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceBackground from "./SpaceBackground";
import PlanetSystem from "./PlanetSystem";
import PlanetSurface from "./PlanetSurface";
import CameraController from "./CameraController";
import CardDetailContent from "../ui/CardDetailContent";
import LanguageToggle from "../ui/LanguageToggle";
import type { Project, Planet } from "@/app/types";
import { planets, projects } from "@/app/lib/data";
import { useLanguage } from "@/app/contexts/LanguageContext";

type SceneMode = 'space' | 'surface';

export default function Scene() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('space');
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
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

  // Handle ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (sceneMode === 'surface' && !isExiting) {
          handleBackToSpace();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneMode, selectedProject, isExiting]);

  const handlePlanetEnter = (planetId: string) => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet?.projectId) return;

    const project = projects.find(p => p.id === planet.projectId);
    if (!project) return;

    setIsTransitioning(true);
    setCurrentPlanet(planet);
    setCurrentProject(project);

    // Transition to surface after animation
    setTimeout(() => {
      setSceneMode('surface');
      setIsTransitioning(false);
      setHoveredPlanetId(null);
    }, 800);
  };

  const handleBackToSpace = () => {
    // Start exit animation
    setIsExiting(true);

    // After astronaut launches, transition to space
    setTimeout(() => {
      setIsTransitioning(true);
    }, 1000);

    setTimeout(() => {
      setSceneMode('space');
      setCurrentPlanet(null);
      setCurrentProject(null);
      setIsTransitioning(false);
      setIsExiting(false);
    }, 1500);
  };

  const handleFlagClick = () => {
    if (currentProject) {
      setSelectedProject(currentProject);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  // Get hovered planet info for preview
  const hoveredPlanet = hoveredPlanetId
    ? planets.find(p => p.id === hoveredPlanetId)
    : null;

  const hoveredProject = hoveredPlanet?.projectId
    ? projects.find(p => p.id === hoveredPlanet.projectId)
    : null;

  return (
    <>
      {/* Language Toggle */}
      <LanguageToggle />

      {/* Back button when on surface */}
      {sceneMode === 'surface' && !selectedProject && !isExiting && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={handleBackToSpace}
          className="fixed top-6 left-6 z-30 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-black/70 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>{language === 'ko' ? '우주로 돌아가기' : 'Back to Space'}</span>
        </motion.button>
      )}

      {/* Guide message for space mode */}
      {sceneMode === 'space' && !isTransitioning && !hoveredPlanetId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-30 text-white/90 text-lg font-medium tracking-wide"
        >
          <span className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            {language === 'ko' ? '🪐 행성을 클릭하여 탐험해보세요!' : '🪐 Click a planet to explore!'}
          </span>
        </motion.div>
      )}

      {/* Launch indicator when entering or exiting */}
      {(isExiting || isTransitioning) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white text-2xl font-bold tracking-widest"
        >
          {language === 'ko' ? '🚀 발사!' : '🚀 Launch!'}
        </motion.div>
      )}

      {/* Planet name indicator when on surface */}
      {sceneMode === 'surface' && currentPlanet && !selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-30 text-white/80 text-lg font-light tracking-widest"
        >
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: currentPlanet.environment.particleColor }} />
            {currentPlanet.name_ko} {language === 'ko' ? '탐사 중' : 'Exploring'}
          </span>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm pointer-events-none text-center px-4">
        {sceneMode === 'space'
          ? (language === 'ko'
            ? "드래그하여 탐색 • 행성 클릭하여 선택 • 다시 클릭하여 진입"
            : "Drag to explore • Click planet to select • Click again to enter")
          : (language === 'ko'
            ? "드래그하여 주변 탐색 • 깃발 클릭하여 프로젝트 보기 • ESC로 우주 복귀"
            : "Drag to look around • Click flag to view project • ESC to return")}
      </div>

      {/* Project Preview Panel - space mode only */}
      <AnimatePresence>
        {sceneMode === 'space' && hoveredProject && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-30 w-80 max-w-[calc(100vw-3rem)]"
          >
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-white/60 text-sm">
                  {hoveredPlanet?.name_ko} • {hoveredPlanet?.name}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'ko' ? hoveredProject.title_ko : hoveredProject.title_en}
              </h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-3">
                {language === 'ko' ? hoveredProject.description_ko : hoveredProject.description_en}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hoveredProject.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/80">
                    {tech}
                  </span>
                ))}
                {hoveredProject.technologies.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-white/50">
                    +{hoveredProject.technologies.length - 4}
                  </span>
                )}
              </div>
              <div className="text-center text-white/50 text-xs">
                {language === 'ko' ? "다시 클릭하여 탐사 시작" : "Click again to start exploration"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition effect */}
      <AnimatePresence>
        {isTransitioning && (
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
                background: currentPlanet
                  ? `radial-gradient(circle, ${currentPlanet.environment.ambientColor} 0%, ${currentPlanet.environment.fogColor} 50%, transparent 70%)`
                  : `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(100,150,255,0.6) 50%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div ref={canvasContainerRef} className="fixed inset-0">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, isMobile ? 1.5 : 2]}
          onPointerMissed={() => {
            if (sceneMode === 'space' && hoveredPlanetId && !isTransitioning) {
              setHoveredPlanetId(null);
            }
          }}
        >
          {sceneMode === 'space' ? (
            <>
              <color attach="background" args={['#020010']} />
              <fog attach="fog" args={['#020010', 80, 250]} />

              <PerspectiveCamera makeDefault position={[0, 5, 35]} fov={60} />

              <CameraController
                targetPosition={hoveredPlanet?.position || null}
                isActive={hoveredPlanetId !== null && !isTransitioning}
                isEntering={isTransitioning}
              />

              <ambientLight intensity={0.4} color="#ffffff" />
              <directionalLight position={[50, 30, 50]} intensity={1.5} color="#fff5e0" castShadow />
              <pointLight position={[-30, -20, -30]} intensity={0.4} color="#4488ff" />
              <pointLight position={[20, -10, 20]} intensity={0.3} color="#ff8844" />
              <directionalLight position={[-30, 10, -20]} intensity={0.5} color="#88aaff" />

              <Suspense fallback={null}>
                <SpaceBackground />
                <PlanetSystem
                  onPlanetSelect={() => {}}
                  selectedProject={null}
                  onPlanetEnter={handlePlanetEnter}
                  hoveredPlanetId={hoveredPlanetId}
                  onPlanetHover={setHoveredPlanetId}
                  isMobile={isMobile}
                  isLaunching={isTransitioning}
                />
              </Suspense>

              {/* Space exploration controls */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.5}
                panSpeed={0.5}
                rotateSpeed={0.3}
                minDistance={10}
                maxDistance={100}
                maxPolarAngle={Math.PI * 0.85}
                minPolarAngle={Math.PI * 0.15}
              />
            </>
          ) : (
            <>
              {currentPlanet && currentProject && (
                <Suspense fallback={null}>
                  <PlanetSurface
                    planet={currentPlanet}
                    project={currentProject}
                    onFlagClick={handleFlagClick}
                    onBack={handleBackToSpace}
                    isExiting={isExiting}
                  />
                </Suspense>
              )}
            </>
          )}
        </Canvas>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseProject}
              className="fixed inset-0 z-40"
              style={{
                background: `radial-gradient(circle at center, rgba(20,30,60,0.95) 0%, rgba(0,0,0,0.98) 100%)`,
                backdropFilter: 'blur(10px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-10"
            >
              <div className="pointer-events-auto w-full max-w-[800px] h-full max-h-[700px]">
                <CardDetailContent project={selectedProject} onClose={handleCloseProject} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
