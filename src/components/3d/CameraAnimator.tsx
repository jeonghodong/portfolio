"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { planets } from "@/src/lib/data";
import { useMobileOptimization } from "@/src/hooks/useMobileOptimization";
import { CAMERA_CONFIG, HOLOGRAM_CONFIG } from "@/src/constants/3d-config";
import { HOLOGRAM_SCREEN_POSITIONS } from "@/src/constants/ui-config";

interface CameraAnimatorProps {
  selectedPlanetId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const initialZ = isMobile
    ? CAMERA_CONFIG.INITIAL_Z_MOBILE
    : CAMERA_CONFIG.INITIAL_Z_DESKTOP;
  const targetPosition = useRef(new Vector3(0, 0, initialZ));
  const originalPosition = useRef(new Vector3(0, 0, initialZ));
  const targetLookAt = useRef(new Vector3(...CAMERA_CONFIG.INITIAL_LOOK_AT));
  const originalLookAt = useRef(new Vector3(...CAMERA_CONFIG.INITIAL_LOOK_AT));
  const isAnimating = useRef(false);

  // Screen positions from HologramDisplaySystem - match spacing
  const spacing = isMobile
    ? HOLOGRAM_CONFIG.SPACING_MOBILE
    : HOLOGRAM_CONFIG.SPACING_DESKTOP;
  const screenPositions = HOLOGRAM_SCREEN_POSITIONS.POSITIONS.map((pos) => ({
    x: pos.x * spacing,
    y: pos.y * spacing,
    z: pos.z,
  }));

  useEffect(() => {
    if (selectedPlanetId) {
      // Find screen position
      const planetIndex = planets.findIndex((p) => p.id === selectedPlanetId);
      if (planetIndex !== -1 && screenPositions[planetIndex]) {
        const screenPos = screenPositions[planetIndex];

        // Adjust zoom distance based on device
        const zoomDistance = isMobile
          ? CAMERA_CONFIG.ZOOM_DISTANCE_MOBILE
          : CAMERA_CONFIG.ZOOM_DISTANCE_DESKTOP;

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
      camera.position.lerp(targetPosition.current, CAMERA_CONFIG.LERP_SPEED);

      // Smooth lerp animation for OrbitControls target (where camera looks)
      if (orbitControlsRef?.current) {
        orbitControlsRef.current.target.lerp(
          targetLookAt.current,
          CAMERA_CONFIG.LERP_SPEED
        );
        orbitControlsRef.current.update();
      }

      // Stop animating when close enough
      const distance = camera.position.distanceTo(targetPosition.current);
      const targetDistance = orbitControlsRef?.current
        ? orbitControlsRef.current.target.distanceTo(targetLookAt.current)
        : 0;

      if (
        distance < CAMERA_CONFIG.ANIMATION_THRESHOLD &&
        targetDistance < CAMERA_CONFIG.ANIMATION_THRESHOLD
      ) {
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
