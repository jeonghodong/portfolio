'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Astronaut3DProps {
  targetPosition: [number, number, number];
  isMoving: boolean;
  isLaunching?: boolean;
  targetPlanetSize?: number;
}

export default function Astronaut3D({ targetPosition, isMoving, isLaunching = false, targetPlanetSize = 1 }: Astronaut3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPosition = useRef(new THREE.Vector3(0, 0, 15));
  const floatOffset = useRef(0);
  const launchProgress = useRef(0);
  const targetRotation = useRef(new THREE.Quaternion());
  const mousePosition = useRef(new THREE.Vector3(0, 0, 15));
  const previousPosition = useRef(new THREE.Vector3(0, 0, 15));
  const velocityRef = useRef(0);
  const [isBoosterActive, setIsBoosterActive] = useState(false);

  const { pointer, viewport } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Enhanced floating animation (disabled during launch)
    floatOffset.current += delta * 1.5;

    // Multi-layered floating for realistic zero-gravity effect
    const floatY = isLaunching ? 0 :
      Math.sin(floatOffset.current) * 0.4 +
      Math.sin(floatOffset.current * 1.7) * 0.15;
    const floatX = isLaunching ? 0 :
      Math.cos(floatOffset.current * 0.7) * 0.2 +
      Math.sin(floatOffset.current * 1.3) * 0.1;
    const floatZ = isLaunching ? 0 :
      Math.sin(floatOffset.current * 0.5) * 0.15;

    // Calculate mouse position in 3D space
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;
    mousePosition.current.set(mouseX * 1.5, mouseY * 1.5, 15);

    // Determine target based on state
    let finalTarget: THREE.Vector3;

    if (isLaunching) {
      // Go to planet during launch
      const target = new THREE.Vector3(...targetPosition);
      finalTarget = target;
    } else {
      // Always follow mouse cursor
      finalTarget = mousePosition.current.clone();
    }

    // Store previous position for velocity calculation
    previousPosition.current.copy(currentPosition.current);

    if (isLaunching) {
      // Rocket launch - accelerate quickly toward planet
      launchProgress.current += delta * 3;
      const speed = launchProgress.current * launchProgress.current * 5;
      currentPosition.current.lerp(finalTarget, Math.min(speed * delta, 0.3));

      // Wobble during launch
      groupRef.current.rotation.z = Math.sin(launchProgress.current * 15) * 0.15;
    } else {
      // Smooth follow mouse with gentle lerp
      currentPosition.current.lerp(finalTarget, delta * 3);
      launchProgress.current = 0;
    }

    // Calculate velocity for booster effect
    const moved = currentPosition.current.distanceTo(previousPosition.current);
    velocityRef.current = moved / delta;

    // Activate booster when moving fast enough or launching
    const shouldBoost = velocityRef.current > 0.5 || isLaunching;
    if (shouldBoost !== isBoosterActive) {
      setIsBoosterActive(shouldBoost);
    }

    // Apply position with floating
    groupRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z + floatZ
    );

    // Rotate to face movement direction
    const lookDirection = finalTarget.clone().sub(groupRef.current.position).normalize();

    // Create rotation matrix that keeps "up" aligned with world Y
    const rotMatrix = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);

    // Only rotate around Y axis primarily
    const flatDirection = new THREE.Vector3(lookDirection.x, 0, lookDirection.z).normalize();

    if (flatDirection.length() > 0.001) {
      rotMatrix.lookAt(
        groupRef.current.position,
        groupRef.current.position.clone().add(flatDirection),
        up
      );
      targetRotation.current.setFromRotationMatrix(rotMatrix);

      // Smooth rotation interpolation
      groupRef.current.quaternion.slerp(targetRotation.current, delta * 3);
    }

    // Subtle rotation animation for realistic floating (disabled during launch)
    if (!isLaunching) {
      // Multi-axis gentle rotation for zero-gravity feel
      groupRef.current.rotation.x = Math.sin(floatOffset.current * 0.3) * 0.08;
      groupRef.current.rotation.z = Math.sin(floatOffset.current * 0.5) * 0.1 +
        Math.cos(floatOffset.current * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={1.0}>
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
      {isBoosterActive && (
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
