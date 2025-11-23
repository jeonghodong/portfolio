"use client";

import { Planet, Project } from "@/app/types";
import { planets, projects } from "@/app/lib/data";
import HologramScreen from "./HologramScreen";
import { useMobileOptimization } from "@/app/hooks/useMobileOptimization";

interface HologramDisplaySystemProps {
  selectedPlanetId: string | null;
  hoveredPlanetId: string | null;
  isWarpActive: boolean;
  onPlanetSelect: (planetId: string) => void;
  onPlanetHover: (planetId: string | null) => void;
  onPlanetEnter: (planetId: string) => void;
}

export default function HologramDisplaySystem({
  selectedPlanetId,
  hoveredPlanetId,
  isWarpActive,
  onPlanetSelect,
  onPlanetHover,
  onPlanetEnter,
}: HologramDisplaySystemProps) {
  const { isMobile } = useMobileOptimization();

  // All planets in a single grid on front wall
  const allPlanets = planets.map((planet) => {
    const project = projects.find((p) => p.id === planet.id) || null;
    return { planet, project };
  });

  // 3D spatial arrangement - screens floating in space with depth
  // Mobile: tighter spacing to fit all screens in view
  const spacing = isMobile ? 0.6 : 1.0; // 60% spacing on mobile

  const screenPositions = [
    // Top row - varying depths
    { x: -7 * spacing, y: 4 * spacing, z: -5 },
    { x: 0, y: 5 * spacing, z: -9 },
    { x: 7 * spacing, y: 4 * spacing, z: -6 },

    // Middle row - varying depths
    { x: -6 * spacing, y: 0, z: -10 },
    { x: 0, y: 0, z: -4 },
    { x: 6 * spacing, y: 0, z: -8 },

    // Bottom row - varying depths
    { x: -7 * spacing, y: -4 * spacing, z: -7 },
    { x: 0, y: -5 * spacing, z: -10 },
    { x: 7 * spacing, y: -4 * spacing, z: -5 },
  ];

  const frontWallScreens = allPlanets.map(({ planet, project }, index) => {
    const pos = screenPositions[index];

    return {
      planet,
      project,
      position: [pos.x, pos.y, pos.z] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    };
  });

  const allScreens = frontWallScreens;

  return (
    <group>
      {allScreens.map((screen, index) => (
        <HologramScreen
          key={screen.planet.id}
          planet={screen.planet}
          project={screen.project}
          position={screen.position}
          rotation={screen.rotation}
          isSelected={selectedPlanetId === screen.planet.id}
          isHovered={hoveredPlanetId === screen.planet.id}
          isWarpActive={isWarpActive}
          onSelect={() => onPlanetSelect(screen.planet.id)}
          onHover={(hovered) =>
            onPlanetHover(hovered ? screen.planet.id : null)
          }
          onEnter={() => onPlanetEnter(screen.planet.id)}
        />
      ))}
    </group>
  );
}
