'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpaceBackground() {
  const starsRef = useRef<THREE.Points>(null);
  const distantStarsRef = useRef<THREE.Points>(null);

  // Main stars - closer, brighter
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Spherical distribution
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white with hints of blue/yellow
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // White stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        // Blue-ish stars
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else {
        // Yellow-ish stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geometry;
  }, []);

  // Distant stars - farther, dimmer, more numerous
  const distantStarsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 150 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return geometry;
  }, []);

  // Subtle rotation for parallax effect
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.002;
      starsRef.current.rotation.x += delta * 0.001;
    }
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += delta * 0.001;
    }
  });

  return (
    <>
      {/* Main stars */}
      <points ref={starsRef} geometry={starsGeometry}>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Distant stars */}
      <points ref={distantStarsRef} geometry={distantStarsGeometry}>
        <pointsMaterial
          size={0.08}
          color="#aaaaff"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Subtle nebula clouds */}
      <mesh position={[30, 20, -80]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#1a0a3e"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[-40, -15, -100]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial
          color="#0a1a3e"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[0, -40, -60]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial
          color="#2a0a2e"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
