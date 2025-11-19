'use client';

import { Suspense } from 'react';
import { planets, projects } from '@/app/lib/data';
import { Project, Planet } from '@/app/types';
import Planet3D from './Planet3D';
import Astronaut3D from './Astronaut3D';

interface PlanetSystemProps {
  onPlanetSelect: (project: Project | null) => void;
  selectedProject: Project | null;
  onPlanetEnter: (planetId: string) => void;
  hoveredPlanetId: string | null;
  onPlanetHover: (planetId: string | null) => void;
  isMobile: boolean;
  isLaunching?: boolean;
}

export default function PlanetSystem({
  onPlanetSelect,
  selectedProject,
  onPlanetEnter,
  hoveredPlanetId,
  onPlanetHover,
  isMobile,
  isLaunching = false,
}: PlanetSystemProps) {
  const hoveredPlanet = hoveredPlanetId
    ? planets.find(p => p.id === hoveredPlanetId)
    : null;

  const targetPosition: [number, number, number] = hoveredPlanet
    ? hoveredPlanet.position
    : [0, 0, 15];

  const targetPlanetSize = hoveredPlanet ? hoveredPlanet.size : 1;

  const handlePlanetSelect = (planetId: string) => {
    // First click selects, second click enters (same for mobile and desktop)
    if (hoveredPlanetId === planetId) {
      // Already selected, enter the planet
      const planet = planets.find(p => p.id === planetId);
      if (planet?.projectId) {
        const project = projects.find(p => p.id === planet.projectId);
        if (project) {
          onPlanetEnter(planetId);
          setTimeout(() => {
            onPlanetSelect(project);
          }, 800);
        }
      }
    } else {
      // First click, select the planet
      onPlanetHover(planetId);
    }
  };

  const handlePlanetHover = (planetId: string, hovered: boolean) => {
    // Hover only shows cursor change, doesn't trigger camera movement
    // Camera movement is triggered by click selection
  };

  return (
    <group>
      {/* Astronaut */}
      <Astronaut3D
        targetPosition={targetPosition}
        isMoving={hoveredPlanetId !== null}
        isLaunching={isLaunching}
        targetPlanetSize={targetPlanetSize}
      />

      {/* Planets */}
      {planets.map((planet) => {
        const project = planet.projectId
          ? projects.find(p => p.id === planet.projectId)
          : undefined;

        const isSelected = selectedProject?.id === planet.projectId;
        const isHovered = hoveredPlanetId === planet.id;

        return (
          <Suspense key={planet.id} fallback={null}>
            <Planet3D
              planet={planet}
              project={project}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelect={() => handlePlanetSelect(planet.id)}
              onHover={(hovered) => handlePlanetHover(planet.id, hovered)}
            />
          </Suspense>
        );
      })}
    </group>
  );
}
