'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface ScrollReactiveGeometryProps {
  position: [number, number, number];
  scrollProgress: number;
}

export default function ScrollReactiveGeometry({ position, scrollProgress }: ScrollReactiveGeometryProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on scroll
      meshRef.current.rotation.x = scrollProgress * Math.PI * 2;
      meshRef.current.rotation.y = scrollProgress * Math.PI * 4;

      // Scale based on scroll
      const scale = 0.5 + Math.sin(scrollProgress * Math.PI * 2) * 0.3;
      meshRef.current.scale.set(scale, scale, scale);

      // Move based on scroll
      meshRef.current.position.z = position[2] + Math.sin(scrollProgress * Math.PI) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial
        color="#000000"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}
