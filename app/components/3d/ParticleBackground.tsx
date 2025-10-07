'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ParticleBackground() {
  const ref = useRef<THREE.Points>(null);

  // Generate particle positions in a sphere distribution
  const [particlesPosition, particlesSizes] = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const sizes = new Float32Array(3000);

    for (let i = 0; i < 3000; i++) {
      const i3 = i * 3;

      // Create a more distributed pattern
      const radius = 15 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random sizes
      sizes[i] = Math.random() * 0.03 + 0.01;
    }

    return [positions, sizes];
  }, []);

  // Animate particles with wave effect
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();

      // Slow rotation
      ref.current.rotation.x = time * 0.015;
      ref.current.rotation.y = time * 0.025;

      // Wave effect on particles
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);
        const wave = Math.sin(distance * 0.3 - time * 0.5) * 0.05;

        positions[i + 1] += wave;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points
      ref={ref}
      positions={particlesPosition}
      sizes={particlesSizes}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
