"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Planet } from "@/src/types";
import { PLANET_SURFACE_CONFIG } from "@/src/constants/3d-config";

interface TerrainMeshProps {
  planet: Planet;
  geometryDetail: "low" | "medium" | "high";
  enableShadows: boolean;
  isMobile: boolean;
  particleMultiplier: number;
}

export default function TerrainMesh({
  planet,
  geometryDetail,
  enableShadows,
  isMobile,
  particleMultiplier,
}: TerrainMeshProps) {
  // Generate circular terrain with height variation
  const terrainGeometry = useMemo(() => {
    const segments =
      geometryDetail === "low"
        ? PLANET_SURFACE_CONFIG.TERRAIN_SEGMENTS_LOW
        : geometryDetail === "medium"
        ? PLANET_SURFACE_CONFIG.TERRAIN_SEGMENTS_MEDIUM
        : PLANET_SURFACE_CONFIG.TERRAIN_SEGMENTS_HIGH;
    const geometry = new THREE.CircleGeometry(
      PLANET_SURFACE_CONFIG.TERRAIN_RADIUS,
      segments,
      0,
      Math.PI * 2
    );
    geometry.rotateX(-Math.PI / 2);

    // Add height variation to vertices
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const distance = Math.sqrt(x * x + z * z);

      // Create gentle rolling hills
      const noise =
        Math.sin(x * PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE * 3) *
          Math.cos(z * PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE * 3) *
          0.5 +
        Math.sin(
          x * PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE +
            z * PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE
        ) *
          0.3;

      // Fade out at edges
      const edgeFade = Math.max(0, 1 - distance / 45);
      positions.setY(
        i,
        noise * edgeFade - PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE
      );
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [geometryDetail]);

  // Generate hills/mounds
  const hills = useMemo(() => {
    const hillData: {
      position: [number, number, number];
      scale: [number, number, number];
    }[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 20;
      hillData.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        scale: [
          2 + Math.random() * 3,
          0.5 + Math.random() * 1.5,
          2 + Math.random() * 3,
        ],
      });
    }
    return hillData;
  }, []);

  // Generate rocks/features based on planet - more rocks in circular pattern
  const rocks = useMemo(() => {
    const rockData: {
      position: [number, number, number];
      scale: number;
      rotation: number;
    }[] = [];
    const rockCount = isMobile
      ? PLANET_SURFACE_CONFIG.ROCK_COUNT_MOBILE
      : Math.floor(
          PLANET_SURFACE_CONFIG.ROCK_COUNT_DESKTOP * particleMultiplier
        );
    for (let i = 0; i < rockCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 25;
      rockData.push({
        position: [
          Math.cos(angle) * radius,
          Math.random() * 0.1,
          Math.sin(angle) * radius,
        ],
        scale: 0.2 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    return rockData;
  }, [isMobile, particleMultiplier]);

  // Generate small pebbles for detail
  const pebbles = useMemo(() => {
    const pebbleData: { position: [number, number, number]; scale: number }[] =
      [];
    const pebbleCount = isMobile
      ? PLANET_SURFACE_CONFIG.PEBBLE_COUNT_MOBILE
      : Math.floor(
          PLANET_SURFACE_CONFIG.PEBBLE_COUNT_DESKTOP * particleMultiplier
        );
    for (let i = 0; i < pebbleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 30;
      pebbleData.push({
        position: [
          Math.cos(angle) * radius,
          PLANET_SURFACE_CONFIG.GROUND_LEVEL,
          Math.sin(angle) * radius,
        ],
        scale: 0.05 + Math.random() * 0.15,
      });
    }
    return pebbleData;
  }, [isMobile, particleMultiplier]);

  return (
    <>
      {/* Circular ground with terrain variation */}
      <mesh geometry={terrainGeometry} receiveShadow={enableShadows}>
        <meshStandardMaterial
          color={planet.environment.groundColor}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Hills/mounds for depth */}
      {hills.map((hill, i) => (
        <mesh
          key={`hill-${i}`}
          position={hill.position}
          scale={hill.scale}
          castShadow={enableShadows}
        >
          <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Rocks/terrain features */}
      {rocks.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={rock.position}
          rotation={[0, rock.rotation, Math.random() * 0.3]}
          castShadow={enableShadows}
        >
          <dodecahedronGeometry args={[rock.scale, 0]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Small pebbles for ground detail */}
      {pebbles.map((pebble, i) => (
        <mesh key={`pebble-${i}`} position={pebble.position}>
          <sphereGeometry args={[pebble.scale, 6, 6]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.9}
          />
        </mesh>
      ))}
    </>
  );
}
