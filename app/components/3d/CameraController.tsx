'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  isActive: boolean;
  isEntering?: boolean;
  targetSize?: number;
  mode?: 'space' | 'spaceship';
}

export default function CameraController({
  targetPosition,
  isActive,
  isEntering = false,
  targetSize = 1,
  mode = 'space',
}: CameraControllerProps) {
  const { camera } = useThree();

  // Different default positions for different modes
  const spaceDefaultPosition = useRef(new THREE.Vector3(0, 5, 35));
  const shipDefaultPosition = useRef(new THREE.Vector3(0, 4, 10));

  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const wasActive = useRef(false);
  const returningToDefault = useRef(false);

  useFrame(() => {
    const defaultPosition = mode === 'spaceship' ? shipDefaultPosition.current : spaceDefaultPosition.current;

    // When entering a planet/capsule - zoom in dramatically
    if (isEntering && targetPosition) {
      const target = new THREE.Vector3(...targetPosition);

      // Move camera very close to the target center
      camera.position.lerp(target, 0.08);
      currentTarget.current.lerp(target, 0.1);
      camera.lookAt(currentTarget.current);
      return;
    }

    // Only move camera when a target is selected
    if (isActive && targetPosition) {
      wasActive.current = true;
      returningToDefault.current = false;

      // Move camera towards the target
      const target = new THREE.Vector3(...targetPosition);

      if (mode === 'spaceship') {
        // Spaceship mode - closer camera for capsules
        const cameraDistance = 4 + targetSize * 1.5;
        const cameraPosition = new THREE.Vector3(
          target.x,
          target.y + 1.5,
          target.z + cameraDistance
        );

        // Smooth camera movement
        camera.position.lerp(cameraPosition, 0.05);

        // Look at the capsule
        currentTarget.current.lerp(target, 0.08);
        camera.lookAt(currentTarget.current);
      } else {
        // Space mode - original behavior for planets
        const direction = target.clone().normalize();
        const cameraDistance = 8 + targetSize * 2;
        const cameraOffset = target.clone().sub(direction.multiplyScalar(cameraDistance));

        // Add height offset scaled with target size
        cameraOffset.y += 2 + targetSize * 0.5;

        // Smooth camera movement
        camera.position.lerp(cameraOffset, 0.03);

        // Look at the target
        currentTarget.current.lerp(target, 0.05);
        camera.lookAt(currentTarget.current);
      }
    } else {
      // When target is deselected, return to default position
      if (wasActive.current) {
        wasActive.current = false;
        returningToDefault.current = true;
      }

      // Smoothly return to default position after deselection
      if (returningToDefault.current) {
        camera.position.lerp(defaultPosition, 0.03);

        const defaultTarget = mode === 'spaceship'
          ? new THREE.Vector3(0, 0, -3)
          : new THREE.Vector3(0, 0, 0);

        currentTarget.current.lerp(defaultTarget, 0.03);
        camera.lookAt(currentTarget.current);

        // Stop returning when close enough to default
        if (camera.position.distanceTo(defaultPosition) < 0.5) {
          returningToDefault.current = false;
        }
      }
    }
  });

  return null;
}
