'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface InteractiveSphereProps {
  position: [number, number, number];
  mousePosition: { x: number; y: number };
}

export default function InteractiveSphere({ position, mousePosition }: InteractiveSphereProps) {
  const meshRef = useRef<Mesh>(null);

  // Spring animation for smooth movement
  const { scale } = useSpring({
    scale: 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on time
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

      // Follow mouse with parallax effect
      const targetX = position[0] + mousePosition.x * 2;
      const targetY = position[1] + mousePosition.y * 2;

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    }
  });

  return (
    <animated.mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.2}
      />
    </animated.mesh>
  );
}
