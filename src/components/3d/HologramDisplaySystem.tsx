"use client";

import { planets, projects } from "@/src/lib/data";
import HologramScreen from "./HologramScreen";
import { useMobileOptimization } from "@/src/hooks/useMobileOptimization";
import { HOLOGRAM_CONFIG } from "@/src/constants/3d-config";
import { HOLOGRAM_SCREEN_POSITIONS } from "@/src/constants/ui-config";

interface HologramDisplaySystemProps {
  selectedPlanetId: string | null;
  hoveredPlanetId: string | null;
  isWarpActive: boolean;
  onPlanetSelect: (planetId: string) => void;
  onPlanetHover: (planetId: string | null) => void;
  onPlanetEnter: (planetId: string) => void;
  onShowSnackbar: (planetName: string) => void;
}

export default function HologramDisplaySystem({
  selectedPlanetId,
  hoveredPlanetId,
  isWarpActive,
  onPlanetSelect,
  onPlanetHover,
  onPlanetEnter,
  onShowSnackbar,
}: HologramDisplaySystemProps) {
  const { isMobile } = useMobileOptimization();

  // All planets in a single grid on front wall
  const allPlanets = planets.map((planet) => {
    const project = projects.find((p) => p.id === planet.id) || null;
    return { planet, project };
  });

  // 3D spatial arrangement - screens floating in space with depth
  // Mobile: tighter spacing to fit all screens in view
  const spacing = isMobile
    ? HOLOGRAM_CONFIG.SPACING_MOBILE
    : HOLOGRAM_CONFIG.SPACING_DESKTOP;

  const screenPositions = HOLOGRAM_SCREEN_POSITIONS.POSITIONS.map((pos) => ({
    x: pos.x * spacing,
    y: pos.y * spacing,
    z: pos.z,
  }));

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
      {allScreens.map((screen) => (
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
          onShowSnackbar={onShowSnackbar}
        />
      ))}
    </group>
  );
}
