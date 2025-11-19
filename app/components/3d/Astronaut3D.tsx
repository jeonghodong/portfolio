'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Astronaut3DProps {
  targetPosition: [number, number, number];
  isMoving: boolean;
  isLaunching?: boolean;
}

export default function Astronaut3D({ targetPosition, isMoving, isLaunching = false }: Astronaut3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPosition = useRef(new THREE.Vector3(0, 0, 15));
  const floatOffset = useRef(0);
  const launchProgress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Floating animation (disabled during launch)
    floatOffset.current += delta * 2;
    const floatY = isLaunching ? 0 : Math.sin(floatOffset.current) * 0.3;
    const floatX = isLaunching ? 0 : Math.cos(floatOffset.current * 0.7) * 0.15;

    // Smooth movement towards target
    const target = new THREE.Vector3(...targetPosition);
    // Position astronaut slightly in front of the planet
    const direction = target.clone().sub(currentPosition.current).normalize();
    const offsetDistance = isLaunching ? 0 : 5; // Go directly to planet when launching
    const finalTarget = target.clone().sub(direction.multiplyScalar(offsetDistance));

    if (isLaunching) {
      // Rocket launch - accelerate quickly toward planet
      launchProgress.current += delta * 3;
      const speed = launchProgress.current * launchProgress.current * 5; // Accelerating
      currentPosition.current.lerp(finalTarget, Math.min(speed * delta, 0.3));

      // Wobble during launch
      groupRef.current.rotation.z = Math.sin(launchProgress.current * 15) * 0.15;
    } else if (isMoving) {
      currentPosition.current.lerp(finalTarget, delta * 2);
      launchProgress.current = 0; // Reset launch progress
    }

    // Apply position with floating
    groupRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z
    );

    // Rotate to face target
    if (isMoving || isLaunching) {
      const lookTarget = new THREE.Vector3(...targetPosition);
      groupRef.current.lookAt(lookTarget);
    }

    // Subtle rotation animation (disabled during launch)
    if (!isLaunching) {
      groupRef.current.rotation.z = Math.sin(floatOffset.current * 0.5) * 0.1;
    }
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
      {(isMoving || isLaunching) && (
        <>
          <pointLight
            position={[0, -1.5, -0.5]}
            color="#ff4400"
            intensity={isLaunching ? 8 : 2}
            distance={isLaunching ? 10 : 3}
          />
          {/* Main flames */}
          <mesh position={[0.15, -1.2, -0.5]}>
            <coneGeometry args={[isLaunching ? 0.2 : 0.1, isLaunching ? 1.2 : 0.4, 8]} />
            <meshBasicMaterial color={isLaunching ? "#ffaa00" : "#ff6600"} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.15, -1.2, -0.5]}>
            <coneGeometry args={[isLaunching ? 0.2 : 0.1, isLaunching ? 1.2 : 0.4, 8]} />
            <meshBasicMaterial color={isLaunching ? "#ffaa00" : "#ff6600"} transparent opacity={0.9} />
          </mesh>
          {/* Extra flames and smoke during launch */}
          {isLaunching && (
            <>
              {/* Inner hot flames */}
              <mesh position={[0.15, -1.5, -0.5]}>
                <coneGeometry args={[0.12, 0.8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
              </mesh>
              <mesh position={[-0.15, -1.5, -0.5]}>
                <coneGeometry args={[0.12, 0.8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
              </mesh>
              {/* Smoke trail */}
              <mesh position={[0, -2, -0.5]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color="#888888" transparent opacity={0.4} />
              </mesh>
              <mesh position={[0, -2.8, -0.5]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshBasicMaterial color="#666666" transparent opacity={0.3} />
              </mesh>
            </>
          )}
        </>
      )}
    </group>
  );
}
