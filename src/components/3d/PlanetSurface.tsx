"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Planet, Project } from "@/src/types";
import Flag3D from "./Flag3D";
import { useMobileOptimization } from "@/src/hooks/useMobileOptimization";
import {
  PLANET_SURFACE_CONFIG,
  CAMERA_CONFIG,
} from "@/src/constants/3d-config";
import Astronaut from "./planet-surface/Astronaut";
import TerrainMesh from "./planet-surface/TerrainMesh";
import ParticleSystem from "./planet-surface/ParticleSystem";
import PlanetEasterEggs from "./planet-surface/PlanetEasterEggs";

interface PlanetSurfaceProps {
  planet: Planet;
  project: Project | null;
  onFlagClick: () => void;
  onBack: () => void;
  isExiting: boolean;
}

export default function PlanetSurface({
  planet,
  project,
  onFlagClick,
  onBack,
  isExiting,
}: PlanetSurfaceProps) {
  const {
    particleMultiplier,
    geometryDetail,
    enableShadows,
    isMobile,
    cameraFOV,
  } = useMobileOptimization();

  return (
    <>
      {/* Camera for surface exploration (wider FOV on mobile: 75° vs 60°) */}
      <PerspectiveCamera
        makeDefault
        position={PLANET_SURFACE_CONFIG.CAMERA_INITIAL_POSITION}
        fov={cameraFOV}
      />

      {/* Sky/atmosphere based on planet */}
      <color attach="background" args={[planet.environment.skyColor]} />
      <fog attach="fog" args={[planet.environment.fogColor, 10, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} color={planet.environment.ambientColor} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow={enableShadows}
      />
      <pointLight
        position={[-10, 10, -10]}
        intensity={0.5}
        color={planet.environment.ambientColor}
      />

      {/* Terrain Components */}
      <TerrainMesh
        planet={planet}
        geometryDetail={geometryDetail}
        enableShadows={enableShadows}
        isMobile={isMobile}
        particleMultiplier={particleMultiplier}
      />

      {/* Floating dust particles */}
      <ParticleSystem planet={planet} particleMultiplier={particleMultiplier} />

      {/* Astronaut */}
      <Astronaut planet={planet} isExiting={isExiting} />

      {/* Easter Eggs */}
      <PlanetEasterEggs planet={planet} />

      {/* Flag at center */}
      <Flag3D
        onClick={onFlagClick}
        position={[0, 0, 0]}
        planetName={planet.name}
        projectTitle={project?.title || ""}
      />

      {/* Back button - floating text */}
      <mesh position={[-8, 3, 0]} onClick={onBack}>
        <planeGeometry args={[2, 0.8]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.8} />
      </mesh>

      {/* Camera controls for exploration - touch-optimized */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        zoomSpeed={isMobile ? CAMERA_CONFIG.ZOOM_SPEED_MOBILE : 1.0}
        rotateSpeed={isMobile ? CAMERA_CONFIG.ROTATE_SPEED_MOBILE : 1.0}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.3}
        minDistance={3}
        maxDistance={20}
        target={[0, 1, 0]}
        enableDamping={true}
        dampingFactor={CAMERA_CONFIG.DAMPING_FACTOR}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
}
