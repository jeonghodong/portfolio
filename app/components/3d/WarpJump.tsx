"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface WarpJumpProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

export default function WarpJump({
  isActive,
  duration = 2.5,
  onComplete,
}: WarpJumpProps) {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Points>(null);
  const startTimeRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);

  // Create star field for warp effect
  const { positions, velocities } = useMemo(() => {
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random position in a cylinder around the camera
      const theta = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 30;
      // Spread stars closer - some near, some far
      const z = -15 - Math.random() * 150; // Changed from -100~-300 to -15~-165

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(theta) * radius;
      positions[i3 + 2] = z;

      velocities[i] = 2 + Math.random() * 3;
    }

    return { positions, velocities };
  }, []);

  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  useFrame((state) => {
    if (!isActive) {
      hasCompletedRef.current = false;
      return;
    }

    const time = state.clock.elapsedTime;

    // Initialize start time
    if (startTimeRef.current === 0) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Accelerating speed
    const speed = progress < 0.3 ? progress * 100 : 30;

    // Move stars towards camera (creating streak effect)
    if (starsRef.current) {
      const posArray = starsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < posArray.length / 3; i++) {
        const i3 = i * 3;
        posArray[i3 + 2] += velocities[i] * speed * 0.016; // Move forward

        // Reset star if it passes the camera
        if (posArray[i3 + 2] > 10) {
          posArray[i3 + 2] = -165; // Reset closer to maintain star density
        }
      }

      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Camera shake
    if (progress < 0.9) {
      const shakeIntensity = progress < 0.3 ? progress : 0.3;
      camera.position.x += (Math.random() - 0.5) * shakeIntensity * 0.5;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.3;
    }

    // Complete animation
    if (progress >= 1 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      startTimeRef.current = 0;
      if (onComplete) {
        onComplete();
      }
    }
  });

  if (!isActive) {
    return null;
  }

  return (
    <group>
      {/* Warp stars */}
      <points ref={starsRef}>
        <bufferGeometry attach="geometry" {...starsGeometry} />
        <pointsMaterial
          size={0.2}
          color="#aaccff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Flash effect */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.000001}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
