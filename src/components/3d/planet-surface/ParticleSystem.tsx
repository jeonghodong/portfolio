"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Planet } from "@/src/types";
import { PLANET_SURFACE_PARTICLES } from "@/src/constants/particle-config";

interface ParticleSystemProps {
  planet: Planet;
  particleMultiplier: number;
}

export default function ParticleSystem({
  planet,
  particleMultiplier,
}: ParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate terrain particles/dust
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = Math.floor(
      PLANET_SURFACE_PARTICLES.PARTICLE_COUNT_BASE * particleMultiplier
    );
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a circular area
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * PLANET_SURFACE_PARTICLES.PARTICLE_RADIUS;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] =
        Math.random() *
        (PLANET_SURFACE_PARTICLES.PARTICLE_HEIGHT_MAX /
          PLANET_SURFACE_PARTICLES.PARTICLE_SIZE_MAX);
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [particleMultiplier]);

  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        if (positions[i + 1] > 10) positions[i + 1] = 0;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.05}
        color={planet.environment.particleColor}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
