"use client";

import { useState, useRef } from "react";
import type { Planet, Project } from "@/src/types";

export type SceneMode = "spaceship" | "surface";

export function useSceneState() {
  // Scene mode
  const [sceneMode, setSceneMode] = useState<SceneMode>("spaceship");

  // Planet and project states
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Planet selection states
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isWarpActive, setIsWarpActive] = useState(false);
  const [isCameraAnimating, setIsCameraAnimating] = useState(false);

  // TV effects states
  const [isTVShutoffActive, setIsTVShutoffActive] = useState(false);
  const [isTVTurnonActive, setIsTVTurnonActive] = useState(false);

  // Refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);

  return {
    // Scene mode
    sceneMode,
    setSceneMode,

    // Planet and project
    currentPlanet,
    setCurrentPlanet,
    currentProject,
    setCurrentProject,
    selectedProject,
    setSelectedProject,

    // Planet selection
    selectedPlanetId,
    setSelectedPlanetId,
    hoveredPlanetId,
    setHoveredPlanetId,

    // Transitions
    isTransitioning,
    setIsTransitioning,
    isExiting,
    setIsExiting,
    isWarpActive,
    setIsWarpActive,
    isCameraAnimating,
    setIsCameraAnimating,

    // TV effects
    isTVShutoffActive,
    setIsTVShutoffActive,
    isTVTurnonActive,
    setIsTVTurnonActive,

    // Refs
    orbitControlsRef,
  };
}
