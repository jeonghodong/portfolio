'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { planets } from '@/app/lib/data';

interface CameraAnimatorProps {
  selectedPlanetId: string | null;
}

export default function CameraAnimator({ selectedPlanetId }: CameraAnimatorProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(0, 0, 10));
  const originalPosition = useRef(new Vector3(0, 0, 10));
  const isAnimating = useRef(false);

  // Screen positions from HologramDisplaySystem
  const screenPositions = [
    { x: -7, y: 4, z: -5 },
    { x: 0, y: 5, z: -9 },
    { x: 7, y: 4, z: -6 },
    { x: -6, y: 0, z: -10 },
    { x: 0, y: 0, z: -4 },
    { x: 6, y: 0, z: -8 },
    { x: -7, y: -4, z: -7 },
    { x: 0, y: -5, z: -10 },
    { x: 7, y: -4, z: -5 },
  ];

  useEffect(() => {
    if (selectedPlanetId) {
      // Find screen position
      const planetIndex = planets.findIndex((p) => p.id === selectedPlanetId);
      if (planetIndex !== -1 && screenPositions[planetIndex]) {
        const screenPos = screenPositions[planetIndex];
        // Position camera closer and centered on the screen
        targetPosition.current.set(
          screenPos.x,
          screenPos.y,
          screenPos.z + 6 // 6 units in front of the screen
        );
        isAnimating.current = true;
      }
    } else {
      // Return to original position
      targetPosition.current.copy(originalPosition.current);
      isAnimating.current = true;
    }
  }, [selectedPlanetId]);

  useFrame(() => {
    if (isAnimating.current) {
      // Smooth lerp animation
      camera.position.lerp(targetPosition.current, 0.1);

      // Stop animating when close enough
      const distance = camera.position.distanceTo(targetPosition.current);
      if (distance < 0.01) {
        camera.position.copy(targetPosition.current);
        isAnimating.current = false;
      }
    }
  });

  return null;
}
