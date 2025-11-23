"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { planets } from "@/app/lib/data";
import { useMobileOptimization } from "@/app/hooks/useMobileOptimization";

interface CameraAnimatorProps {
  selectedPlanetId: string | null;
  orbitControlsRef?: React.RefObject<any>;
  onAnimationComplete?: () => void;
}

export default function CameraAnimator({
  selectedPlanetId,
  orbitControlsRef,
  onAnimationComplete,
}: CameraAnimatorProps) {
  const { camera } = useThree();
  const { isMobile } = useMobileOptimization();

  // Mobile uses different camera distance
  const initialZ = isMobile ? 12 : 10;
  const targetPosition = useRef(new Vector3(0, 0, initialZ));
  const originalPosition = useRef(new Vector3(0, 0, initialZ));
  const targetLookAt = useRef(new Vector3(0, 0, -6));
  const originalLookAt = useRef(new Vector3(0, 0, -6));
  const isAnimating = useRef(false);

  // Screen positions from HologramDisplaySystem - match spacing
  const spacing = isMobile ? 0.6 : 1.0;
  const screenPositions = [
    { x: -7 * spacing, y: 4 * spacing, z: -5 },
    { x: 0, y: 5 * spacing, z: -9 },
    { x: 7 * spacing, y: 4 * spacing, z: -6 },
    { x: -6 * spacing, y: 0, z: -10 },
    { x: 0, y: 0, z: -4 },
    { x: 6 * spacing, y: 0, z: -8 },
    { x: -7 * spacing, y: -4 * spacing, z: -7 },
    { x: 0, y: -5 * spacing, z: -10 },
    { x: 7 * spacing, y: -4 * spacing, z: -5 },
  ];

  useEffect(() => {
    if (selectedPlanetId) {
      // Find screen position
      const planetIndex = planets.findIndex((p) => p.id === selectedPlanetId);
      if (planetIndex !== -1 && screenPositions[planetIndex]) {
        const screenPos = screenPositions[planetIndex];

        // Adjust zoom distance based on device
        const zoomDistance = isMobile ? 8 : 10;

        // Position camera at same x, y as screen, but in front on z-axis
        targetPosition.current.set(
          screenPos.x, // Same x as screen
          screenPos.y, // Same y as screen
          screenPos.z + zoomDistance // Closer on mobile for tighter view
        );

        // Set look at target to screen center
        targetLookAt.current.set(screenPos.x, screenPos.y, screenPos.z);

        isAnimating.current = true;
      }
    } else {
      // Return to original position and look at
      targetPosition.current.copy(originalPosition.current);
      targetLookAt.current.copy(originalLookAt.current);
      isAnimating.current = true;
    }
  }, [selectedPlanetId, isMobile, screenPositions]);

  useFrame(() => {
    if (isAnimating.current) {
      // Smooth lerp animation for camera position
      camera.position.lerp(targetPosition.current, 0.1);

      // Smooth lerp animation for OrbitControls target (where camera looks)
      if (orbitControlsRef?.current) {
        orbitControlsRef.current.target.lerp(targetLookAt.current, 0.1);
        orbitControlsRef.current.update();
      }

      // Stop animating when close enough
      const distance = camera.position.distanceTo(targetPosition.current);
      const targetDistance = orbitControlsRef?.current
        ? orbitControlsRef.current.target.distanceTo(targetLookAt.current)
        : 0;

      if (distance < 0.01 && targetDistance < 0.01) {
        camera.position.copy(targetPosition.current);
        if (orbitControlsRef?.current) {
          orbitControlsRef.current.target.copy(targetLookAt.current);
          orbitControlsRef.current.update();
        }
        isAnimating.current = false;

        // Notify that animation is complete
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }
  });

  return null;
}
