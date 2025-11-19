'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Astronaut3DProps {
  targetPosition: [number, number, number];
  isMoving: boolean;
}

export default function Astronaut3D({ targetPosition, isMoving }: Astronaut3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPosition = useRef(new THREE.Vector3(0, 0, 15));
  const floatOffset = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Floating animation
    floatOffset.current += delta * 2;
    const floatY = Math.sin(floatOffset.current) * 0.3;
    const floatX = Math.cos(floatOffset.current * 0.7) * 0.15;

    // Smooth movement towards target
    const target = new THREE.Vector3(...targetPosition);
    // Position astronaut slightly in front of the planet
    const direction = target.clone().sub(currentPosition.current).normalize();
    const offsetDistance = 5; // Distance from planet center
    const finalTarget = target.clone().sub(direction.multiplyScalar(offsetDistance));

    if (isMoving) {
      currentPosition.current.lerp(finalTarget, delta * 2);
    }

    // Apply position with floating
    groupRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z
    );

    // Rotate to face target
    if (isMoving) {
      const lookTarget = new THREE.Vector3(...targetPosition);
      groupRef.current.lookAt(lookTarget);
    }

    // Subtle rotation animation
    groupRef.current.rotation.z = Math.sin(floatOffset.current * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} scale={0.4}>
      {/* Helmet (head) */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Helmet visor */}
      <mesh position={[0, 1.2, 0.3]}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.3, -0.5]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#cccccc" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Left arm */}
      <group position={[-0.55, 0.4, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.55, 0.4, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Left leg */}
      <group position={[-0.2, -0.7, 0]} rotation={[0.2, 0, 0.1]}>
        <mesh>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.45, 0.1]}>
          <boxGeometry args={[0.2, 0.2, 0.35]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.2, -0.7, 0]} rotation={[-0.2, 0, -0.1]}>
        <mesh>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.45, 0.1]}>
          <boxGeometry args={[0.2, 0.2, 0.35]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Oxygen tubes */}
      <mesh position={[0.3, 0.8, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#4488ff" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.8, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#4488ff" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Jetpack flames when moving */}
      {isMoving && (
        <>
          <pointLight position={[0, -1.5, -0.5]} color="#ff4400" intensity={2} distance={3} />
          <mesh position={[0.15, -1.2, -0.5]}>
            <coneGeometry args={[0.1, 0.4, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.15, -1.2, -0.5]}>
            <coneGeometry args={[0.1, 0.4, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}
