'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ParticleBackground() {
  const goldStarsRef = useRef<THREE.Points>(null);
  const purpleStarsRef = useRef<THREE.Points>(null);
  const cyanStarsRef = useRef<THREE.Points>(null);

  // Generate particle positions in a sphere distribution
  const [goldPositions, goldSizes, purplePositions, purpleSizes, cyanPositions, cyanSizes] = useMemo(() => {
    // Gold stars (bright, medium size)
    const goldPos = new Float32Array(800 * 3);
    const goldSize = new Float32Array(800);

    // Purple stars (mystical, varied size)
    const purplePos = new Float32Array(1200 * 3);
    const purpleSize = new Float32Array(1200);

    // Cyan stars (ethereal, small)
    const cyanPos = new Float32Array(1000 * 3);
    const cyanSize = new Float32Array(1000);

    // Gold particles
    for (let i = 0; i < 800; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      goldPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      goldPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      goldPos[i3 + 2] = radius * Math.cos(phi);
      goldSize[i] = Math.random() * 0.05 + 0.02; // Bigger, brighter
    }

    // Purple particles
    for (let i = 0; i < 1200; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      purplePos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      purplePos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      purplePos[i3 + 2] = radius * Math.cos(phi);
      purpleSize[i] = Math.random() * 0.04 + 0.015;
    }

    // Cyan particles
    for (let i = 0; i < 1000; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      cyanPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      cyanPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      cyanPos[i3 + 2] = radius * Math.cos(phi);
      cyanSize[i] = Math.random() * 0.03 + 0.01; // Smaller, ethereal
    }

    return [goldPos, goldSize, purplePos, purpleSize, cyanPos, cyanSize];
  }, []);

  // Animate particles with twinkling and rotation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gold stars - slow rotation + twinkle
    if (goldStarsRef.current) {
      goldStarsRef.current.rotation.x = time * 0.01;
      goldStarsRef.current.rotation.y = time * 0.015;

      // Twinkle effect via opacity material (handled by shader)
    }

    // Purple stars - medium rotation
    if (purpleStarsRef.current) {
      purpleStarsRef.current.rotation.x = time * 0.012;
      purpleStarsRef.current.rotation.y = time * 0.02;
    }

    // Cyan stars - fast rotation
    if (cyanStarsRef.current) {
      cyanStarsRef.current.rotation.x = time * 0.018;
      cyanStarsRef.current.rotation.y = time * 0.025;
    }
  });

  return (
    <group>
      {/* Gold mystical particles */}
      <Points
        ref={goldStarsRef}
        positions={goldPositions}
        sizes={goldSizes}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffd700"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Purple arcana particles */}
      <Points
        ref={purpleStarsRef}
        positions={purplePositions}
        sizes={purpleSizes}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#b19cd9"
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Cyan ethereal particles */}
      <Points
        ref={cyanStarsRef}
        positions={cyanPositions}
        sizes={cyanSizes}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#00ffff"
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
