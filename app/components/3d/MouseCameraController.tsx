'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MouseCameraControllerProps {
  enabled: boolean;
  maxAngle?: number; // degrees
  sensitivity?: number;
  orbitControlsRef?: React.RefObject<any>;
}

export default function MouseCameraController({
  enabled,
  maxAngle = 70,
  sensitivity = 1,
  orbitControlsRef,
}: MouseCameraControllerProps) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!enabled) return;

      // Normalize mouse position to -1 ~ 1 range
      // (0, 0) is center of screen
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mousePosition.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  useFrame(() => {
    if (!orbitControlsRef?.current) return;

    if (!enabled) {
      // Reset to center when disabled
      targetRotation.current = { x: 0, y: 0 };
    } else {
      // Calculate target rotation based on mouse position
      // Convert degrees to radians
      const maxAngleRad = (maxAngle * Math.PI) / 180;

      // Horizontal rotation (left-right)
      targetRotation.current.y = mousePosition.current.x * maxAngleRad * sensitivity;

      // Vertical rotation (up-down)
      targetRotation.current.x = mousePosition.current.y * maxAngleRad * sensitivity * 0.5; // Less vertical movement
    }

    // Smooth lerp to target rotation
    const lerpFactor = 0.05;
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

    // Apply rotation offset to OrbitControls target
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const distance = 6; // Distance from camera to target

      // Calculate offset based on mouse-driven rotation
      const offsetX = Math.sin(currentRotation.current.y) * distance;
      const offsetY = Math.sin(currentRotation.current.x) * distance;
      const offsetZ = -Math.cos(currentRotation.current.y) * distance;

      // Update OrbitControls target with smooth offset
      controls.target.set(
        offsetX,
        offsetY,
        -6 + offsetZ
      );
      controls.update();
    }
  });

  return null;
}
