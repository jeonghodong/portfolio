"use client";

import { useCallback } from "react";
import { planets, projects } from "@/src/lib/data";
import { WARP_CONFIG } from "@/src/constants/3d-config";
import { TRANSITION_TIMING } from "@/src/constants/animation-config";
import type { SceneMode } from "./useSceneState";
import type { Planet, Project } from "@/src/types";

interface UseSceneTransitionsProps {
  // State values
  selectedPlanetId: string | null;

  // State setters
  setSelectedPlanetId: (id: string | null) => void;
  setIsCameraAnimating: (value: boolean) => void;
  setIsWarpActive: (value: boolean) => void;
  setSceneMode: (mode: SceneMode) => void;
  setCurrentPlanet: (planet: Planet | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setIsTransitioning: (value: boolean) => void;
  setIsTVTurnonActive: (value: boolean) => void;
  setIsExiting: (value: boolean) => void;
  setIsTVShutoffActive: (value: boolean) => void;
  setSelectedProject: (project: Project | null) => void;
}

export function useSceneTransitions({
  selectedPlanetId,
  setSelectedPlanetId,
  setIsCameraAnimating,
  setIsWarpActive,
  setSceneMode,
  setCurrentPlanet,
  setCurrentProject,
  setIsTransitioning,
  setIsTVTurnonActive,
  setIsExiting,
  setIsTVShutoffActive,
  setSelectedProject,
}: UseSceneTransitionsProps) {
  // Handle planet selection (zoom in to hologram screen)
  const handlePlanetSelect = useCallback(
    (planetId: string) => {
      setSelectedPlanetId(planetId);
      setIsCameraAnimating(true);
    },
    [setSelectedPlanetId, setIsCameraAnimating]
  );

  // Handle camera animation completion
  const handleCameraAnimationComplete = useCallback(() => {
    setIsCameraAnimating(false);
  }, [setIsCameraAnimating]);

  // Handle planet enter (start warp jump)
  const handlePlanetEnter = useCallback(
    (planetId: string) => {
      const planet = planets.find((p) => p.id === planetId);
      if (!planet) return;

      // Start warp animation
      setIsWarpActive(true);
    },
    [setIsWarpActive]
  );

  // Handle warp completion (transition to planet surface)
  const handleWarpComplete = useCallback(() => {
    const planet = planets.find((p) => p.id === selectedPlanetId);
    if (!planet) return;

    const project = projects.find((p) => p.id === planet.id) || null;

    // End warp and switch to surface mode
    setIsWarpActive(false);
    setSceneMode("surface");
    setCurrentPlanet(planet);
    setCurrentProject(project);
    setSelectedPlanetId(null);
    setIsTransitioning(false);

    // Small delay then show turn-on effect
    setTimeout(() => {
      setIsTVTurnonActive(true);
    }, 100);
  }, [
    selectedPlanetId,
    setIsWarpActive,
    setSceneMode,
    setCurrentPlanet,
    setCurrentProject,
    setSelectedPlanetId,
    setIsTransitioning,
    setIsTVTurnonActive,
  ]);

  // Handle back to spaceship
  const handleBackToShip = useCallback(() => {
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
      }, WARP_CONFIG.TV_TURNON_DELAY);
    }, WARP_CONFIG.TV_TURNOFF_DURATION + TRANSITION_TIMING.PLANET_EXIT_DURATION / 2);
  }, [
    setIsExiting,
    setIsTransitioning,
    setIsTVShutoffActive,
    setSceneMode,
    setCurrentPlanet,
    setCurrentProject,
    setIsTVTurnonActive,
  ]);

  // Handle flag click (open project detail)
  const handleFlagClick = useCallback(
    (currentProject: Project | null) => {
      if (currentProject) {
        setSelectedProject(currentProject);
      }
    },
    [setSelectedProject]
  );

  // Handle close project detail
  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null);
  }, [setSelectedProject]);

  return {
    handlePlanetSelect,
    handleCameraAnimationComplete,
    handlePlanetEnter,
    handleWarpComplete,
    handleBackToShip,
    handleFlagClick,
    handleCloseDetail,
  };
}
