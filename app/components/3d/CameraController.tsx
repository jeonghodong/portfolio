'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  isActive: boolean;
}

export default function CameraController({ targetPosition, isActive }: CameraControllerProps) {
  const { camera } = useThree();
  const defaultPosition = useRef(new THREE.Vector3(0, 5, 35));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!isActive || !targetPosition) {
      // Return to default position smoothly
      camera.position.lerp(defaultPosition.current, 0.02);
      currentTarget.current.lerp(new THREE.Vector3(0, 0, 0), 0.02);
    } else {
      // Move camera towards the target planet
      const target = new THREE.Vector3(...targetPosition);

      // Calculate camera position - closer to the planet but with offset
      const direction = target.clone().normalize();
      const cameraDistance = 12; // Distance from planet
      const cameraOffset = target.clone().sub(direction.multiplyScalar(cameraDistance));

      // Add some height offset for better viewing angle
      cameraOffset.y += 3;

      // Smooth camera movement
      camera.position.lerp(cameraOffset, 0.03);

      // Look at the planet
      currentTarget.current.lerp(target, 0.05);
    }

    camera.lookAt(currentTarget.current);
  });

  return null;
}
