"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import { planets, projects } from "@/app/lib/data";
import type { Planet, Project } from "@/app/types";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import CardDetailContent from "../ui/CardDetailContent";
import LanguageToggle from "../ui/LanguageToggle";
import TVShutoffOverlay from "../ui/TVShutoffOverlay";
import TVTurnonOverlay from "../ui/TVTurnonOverlay";
import CameraAnimator from "./CameraAnimator";
import HologramDisplaySystem from "./HologramDisplaySystem";
import MouseCameraController from "./MouseCameraController";
import PlanetSurface from "./PlanetSurface";
import SpaceBackground from "./SpaceBackground";
import WarpJump from "./WarpJump";

type SceneMode = "spaceship" | "surface";

export default function Scene() {
  const [sceneMode, setSceneMode] = useState<SceneMode>("spaceship");
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [isWarpActive, setIsWarpActive] = useState(false);
  const [isTVShutoffActive, setIsTVShutoffActive] = useState(false);
  const [isTVTurnonActive, setIsTVTurnonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const { language } = useLanguage();

  // Hide loading after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else if (sceneMode === "surface" && !isExiting) {
          handleBackToShip();
        } else if (sceneMode === "spaceship" && selectedPlanetId) {
          setSelectedPlanetId(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sceneMode, selectedProject, isExiting, selectedPlanetId]);

  const handlePlanetSelect = (planetId: string) => {
    setSelectedPlanetId(planetId);
    setHoveredPlanetId(planetId);
  };

  const handlePlanetEnter = (planetId: string) => {
    const planet = planets.find((p) => p.id === planetId);
    if (!planet) return;

    // Find project if exists (some planets don't have projects)
    const project = projects.find((p) => p.id === planetId) || null;

    // Start warp jump animation
    setIsWarpActive(true);
    setCurrentPlanet(planet);
    setCurrentProject(project);
  };

  const handleWarpComplete = () => {
    // Start TV shutoff effect after warp completes
    setIsWarpActive(false);
    setIsTVShutoffActive(true);
  };

  const handleTVShutoffComplete = () => {
    // Change scene mode first (so new scene can render)
    setSceneMode("surface");
    setIsTransitioning(false);
    setSelectedPlanetId(null);
    setHoveredPlanetId(null);

    // Wait a bit for new scene to render, then start turnon effect
    setTimeout(() => {
      setIsTVShutoffActive(false);
      setIsTVTurnonActive(true);
    }, 300);
  };

  const handleTVTurnonComplete = () => {
    setIsTVTurnonActive(false);
  };

  const handleBackToShip = () => {
    // Start exit animation
    setIsExiting(true);

    // After astronaut launches, start TV shutoff effect
    setTimeout(() => {
      setIsTransitioning(true);
      setIsTVShutoffActive(true);
    }, 1000);

    // After TV shutoff completes, return to spaceship
    setTimeout(() => {
      // Change scene mode first
      setSceneMode("spaceship");
      setCurrentPlanet(null);
      setCurrentProject(null);
      setIsTransitioning(false);
      setIsExiting(false);

      // Wait a bit for spaceship scene to render, then start turnon effect
      setTimeout(() => {
        setIsTVShutoffActive(false);
        setIsTVTurnonActive(true);
      }, 300);
    }, 2500); // 1000ms exit + 1000ms TV effect + 500ms buffer
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
    ? planets.find((p) => p.id === hoveredPlanetId)
    : null;

  const hoveredProject = hoveredPlanetId
    ? projects.find((p) => p.id === hoveredPlanetId)
    : null;

  return (
    <>
      {/* TV Shutoff Effect Overlay */}
      <TVShutoffOverlay
        isActive={isTVShutoffActive}
        duration={1.0}
        onComplete={handleTVShutoffComplete}
      />

      {/* TV Turnon Effect Overlay */}
      <TVTurnonOverlay
        isActive={isTVTurnonActive}
        duration={sceneMode === "spaceship" ? 0.8 : 2.0}
        onComplete={handleTVTurnonComplete}
        skipTwoStage={sceneMode === "spaceship"}
      />

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-[#0a0a1e] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full mb-4"
            />
            <p className="text-white/80 text-lg">
              {language === "ko"
                ? "미션 컨트롤 부팅 중..."
                : "Initializing Mission Control..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Toggle */}
      <LanguageToggle />

      {/* Back button when on surface */}
      {sceneMode === "surface" && !selectedProject && !isExiting && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={handleBackToShip}
          className="fixed top-6 left-6 z-30 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-black/70 transition-colors flex items-center gap-2"
          aria-label={language === "ko" ? "우주선으로 복귀" : "Return to Ship"}
        >
          <span aria-hidden="true">←</span>
          <span>
            {language === "ko" ? "우주선으로 복귀" : "Return to Ship"}
          </span>
        </motion.button>
      )}

      {/* Guide message for spaceship mode */}
      {sceneMode === "spaceship" && !isWarpActive && !selectedPlanetId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-30 text-white/90 text-lg font-medium tracking-wide"
          role="status"
        >
          <span className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30">
            {language === "ko"
              ? isMobile
                ? "📡 미션을 탭하여 선택!"
                : "📡 미션을 클릭하여 선택!"
              : isMobile
              ? "📡 Tap a mission to select!"
              : "📡 Click a mission to select!"}
          </span>
        </motion.div>
      )}

      {/* Warp activation indicator */}
      {isWarpActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white text-2xl font-bold tracking-widest"
        >
          {language === "ko" ? "🚀 워프 점프!" : "🚀 Warp Jump!"}
        </motion.div>
      )}

      {/* Exit indicator */}
      {isExiting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white text-2xl font-bold tracking-widest"
        >
          {language === "ko" ? "🚀 발사!" : "🚀 Launch!"}
        </motion.div>
      )}

      {/* Planet name indicator when on surface */}
      {sceneMode === "surface" && currentPlanet && !selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-30 text-white/80 text-lg font-light tracking-widest"
        >
          <span className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: currentPlanet.environment.particleColor,
              }}
            />
            {currentPlanet.name_ko}{" "}
            {language === "ko" ? "탐사 중" : "Exploring"}
          </span>
        </motion.div>
      )}

      {/* Instructions */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm pointer-events-none text-center px-4"
        role="status"
        aria-live="polite"
      >
        {sceneMode === "spaceship"
          ? language === "ko"
            ? isMobile
              ? "드래그하여 탐색 • 스크린 탭하여 선택 • 다시 탭하여 출발"
              : "드래그하여 탐색 • 스크린 클릭하여 선택 • 다시 클릭하여 출발"
            : isMobile
            ? "Drag to explore • Tap screen to select • Tap again to launch"
            : "Drag to explore • Click to select • Click again to launch"
          : language === "ko"
          ? isMobile
            ? "드래그하여 주변 탐색 • 깃발 탭하여 프로젝트 보기"
            : "드래그하여 주변 탐색 • 깃발 클릭하여 프로젝트 보기 • ESC로 우주선 복귀"
          : isMobile
          ? "Drag to look around • Tap flag to view project"
          : "Drag to look around • Click flag to view project • ESC to return"}
      </div>

      {/* Mission Preview Panel - spaceship mode only */}
      <AnimatePresence>
        {sceneMode === "spaceship" &&
          (hoveredProject || hoveredPlanet) &&
          !isWarpActive && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed right-6 top-1/2 -translate-y-1/2 z-30 w-80 max-w-[calc(100vw-3rem)]"
            >
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: hoveredPlanet?.environment.particleColor,
                    }}
                  />
                  <span className="text-white/60 text-sm uppercase tracking-wide">
                    {hoveredProject
                      ? language === "ko"
                        ? "프로젝트 미션"
                        : "Project Mission"
                      : language === "ko"
                      ? "탐사 미션"
                      : "Exploration Mission"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {hoveredProject
                    ? language === "ko"
                      ? hoveredProject.title_ko
                      : hoveredProject.title_en
                    : language === "ko"
                    ? hoveredPlanet?.name_ko
                    : hoveredPlanet?.name_en}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {hoveredProject
                    ? language === "ko"
                      ? hoveredProject.description_ko
                      : hoveredProject.description_en
                    : language === "ko"
                    ? `${hoveredPlanet?.name_ko} 탐사`
                    : `Explore ${hoveredPlanet?.name_en}`}
                </p>
                {hoveredProject && (
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
                )}
                <div className="text-center text-blue-400/80 text-xs">
                  {language === "ko"
                    ? isMobile
                      ? "다시 탭하여 출발"
                      : "다시 클릭하여 출발"
                    : isMobile
                    ? "Tap again to launch"
                    : "Click again to launch"}
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
                  : `radial-gradient(circle, rgba(100,150,255,0.8) 0%, rgba(50,100,200,0.6) 50%, transparent 70%)`,
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
            if (
              sceneMode === "spaceship" &&
              selectedPlanetId &&
              !isWarpActive
            ) {
              setSelectedPlanetId(null);
              setHoveredPlanetId(null);
            }
          }}
        >
          {sceneMode === "spaceship" ? (
            <>
              <color attach="background" args={["#0a0e1a"]} />

              <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

              <Suspense fallback={null}>
                <SpaceBackground />
                <HologramDisplaySystem
                  selectedPlanetId={selectedPlanetId}
                  hoveredPlanetId={hoveredPlanetId}
                  onPlanetSelect={handlePlanetSelect}
                  onPlanetHover={setHoveredPlanetId}
                  onPlanetEnter={handlePlanetEnter}
                />
                <WarpJump
                  isActive={isWarpActive}
                  duration={2.5}
                  onComplete={handleWarpComplete}
                />
                <CameraAnimator selectedPlanetId={selectedPlanetId} />
                <MouseCameraController
                  enabled={!selectedPlanetId && !isWarpActive}
                  maxAngle={70}
                  sensitivity={1}
                  orbitControlsRef={orbitControlsRef}
                />
              </Suspense>

              {/* Camera controls - zoom, pan, and rotate enabled */}
              <OrbitControls
                ref={orbitControlsRef}
                enabled={!selectedPlanetId}
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.6}
                rotateSpeed={0.5}
                panSpeed={0.4}
                minDistance={5}
                maxDistance={25}
                maxPolarAngle={Math.PI / 2 + (70 * Math.PI) / 180}
                minPolarAngle={Math.PI / 2 - (70 * Math.PI) / 180}
                maxAzimuthAngle={(70 * Math.PI) / 180}
                minAzimuthAngle={-(70 * Math.PI) / 180}
                target={[0, 0, -6]}
              />
            </>
          ) : (
            <>
              {currentPlanet && (
                <Suspense fallback={null}>
                  <PlanetSurface
                    planet={currentPlanet}
                    project={currentProject}
                    onFlagClick={handleFlagClick}
                    onBack={handleBackToShip}
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
                backdropFilter: "blur(10px)",
              }}
            />

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
                  onClose={handleCloseProject}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
