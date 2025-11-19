"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import CardStack from "./CardStack";
import CardDetailContent from "../ui/CardDetailContent";
import LanguageToggle from "../ui/LanguageToggle";
import type { Project } from "@/app/types";

export default function Scene() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, time: 0 });
  const velocityRef = useRef(0);
  const isMobileRef = useRef(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse parallax effect + horizontal scroll (Desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (selectedProject) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = -(e.clientY / window.innerHeight - 0.5) * 2; // Inverted for camera
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [selectedProject, isMobile]);

  // Touch events for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (selectedProject) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        time: Date.now(),
      };
      velocityRef.current = 0; // Reset velocity on new touch
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (selectedProject) return;

      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Calculate velocity for inertia
      velocityRef.current = deltaX / (deltaTime || 1);

      // Update scroll offset
      setScrollOffset((prev) => {
        const newOffset = prev + deltaX * 0.02;
        return Math.max(-30, Math.min(30, newOffset));
      });

      touchStartRef.current = {
        x: e.touches[0].clientX,
        time: Date.now(),
      };
    };

    const handleTouchEnd = () => {
      if (selectedProject) return;
      // Apply inertia scrolling
      const applyInertia = () => {
        if (Math.abs(velocityRef.current) > 0.01) {
          setScrollOffset((prev) => {
            const newOffset = prev + velocityRef.current * 2;
            return Math.max(-30, Math.min(30, newOffset));
          });
          velocityRef.current *= 0.95; // Decay
          requestAnimationFrame(applyInertia);
        }
      };
      applyInertia();
    };

    const container = canvasContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [selectedProject, isMobile]);

  // Smooth scroll animation based on mouse X position (Desktop only)
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      // Check if mobile inside the animation loop
      if (!isMobileRef.current) {
        setScrollOffset((prev) => {
          // Mouse X maps to scroll offset: -1 (left) to 1 (right) → scroll range
          const targetOffset = -mousePosition.x * 15; // Multiply by scroll range
          const diff = targetOffset - prev;
          return prev + diff * 0.05; // Smooth lerp
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition.x]); // Only re-run when mousePosition.x changes

  return (
    <>
      {/* Language Toggle */}
      <LanguageToggle />

      <div ref={canvasContainerRef} className="fixed inset-0">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0a0118']} />
          <PerspectiveCamera
            makeDefault
            position={[
              0, // No horizontal camera movement, cards move instead
              isMobile ? 0 : mousePosition.y * 1.0, // Disable Y parallax on mobile
              9,
            ]}
            fov={65}
          />

          {/* Arcana-themed Lighting */}
          <ambientLight intensity={0.4} color="#b19cd9" />
          <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffd700" />
          <pointLight position={[-10, -10, -5]} intensity={0.8} color="#b19cd9" />
          <pointLight position={[10, -5, 5]} intensity={0.6} color="#00ffff" />
          <spotLight
            position={[0, 10, 5]}
            angle={0.5}
            penumbra={1}
            intensity={1.0}
            color="#ffd700"
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
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.1,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ padding: '60px' }}
            >
              <div
                className="pointer-events-auto w-full max-w-[750px] h-full max-h-[650px]"
              >
                <CardDetailContent
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
