'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  isActive: boolean;
  isEntering?: boolean;
  targetPlanetSize?: number;
}

export default function CameraController({ targetPosition, isActive, isEntering = false, targetPlanetSize = 1 }: CameraControllerProps) {
  const { camera } = useThree();
  const defaultPosition = useRef(new THREE.Vector3(0, 5, 35));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const wasActive = useRef(false);
  const returningToDefault = useRef(false);

  useFrame(() => {
    // When entering a planet - zoom in dramatically
    if (isEntering && targetPosition) {
      const target = new THREE.Vector3(...targetPosition);

      // Move camera very close to the planet center
      camera.position.lerp(target, 0.08);
      currentTarget.current.lerp(target, 0.1);
      camera.lookAt(currentTarget.current);
      return;
    }

    // Only move camera when a planet is selected
    if (isActive && targetPosition) {
      wasActive.current = true;
      returningToDefault.current = false;

      // Move camera towards the target planet
      const target = new THREE.Vector3(...targetPosition);

      // Calculate camera position based on planet size
      const direction = target.clone().normalize();
      // Larger planets need more distance, smaller planets can be closer
      const cameraDistance = 8 + targetPlanetSize * 2;
      const cameraOffset = target.clone().sub(direction.multiplyScalar(cameraDistance));

      // Add height offset scaled with planet size
      cameraOffset.y += 2 + targetPlanetSize * 0.5;

      // Smooth camera movement
      camera.position.lerp(cameraOffset, 0.03);

      // Look at the planet
      currentTarget.current.lerp(target, 0.05);
      camera.lookAt(currentTarget.current);
    } else {
      // When planet is deselected, return to default position
      if (wasActive.current) {
        wasActive.current = false;
        returningToDefault.current = true;
      }

      // Smoothly return to default position after deselection
      if (returningToDefault.current) {
        camera.position.lerp(defaultPosition.current, 0.03);
        currentTarget.current.lerp(new THREE.Vector3(0, 0, 0), 0.03);
        camera.lookAt(currentTarget.current);

        // Stop returning when close enough to default
        if (camera.position.distanceTo(defaultPosition.current) < 0.5) {
          returningToDefault.current = false;
        }
      }
    }
  });

  return null;
}
