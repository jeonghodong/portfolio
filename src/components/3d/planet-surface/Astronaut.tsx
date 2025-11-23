"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Planet } from "@/src/types";
import { PLANET_SURFACE_CONFIG } from "@/src/constants/3d-config";

interface AstronautProps {
  planet: Planet;
  isExiting: boolean;
}

export default function Astronaut({ isExiting }: AstronautProps) {
  const astronautRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const exitProgress = useRef(0);
  const landingProgress = useRef(0);
  const isLandingRef = useRef(true);
  const astronautPosition = useRef(new THREE.Vector3(2, 0, 0));
  const targetPosition = useRef(new THREE.Vector3(2, 0, 0));
  const runAnimationTime = useRef(0);
  const [showLandingFlames, setShowLandingFlames] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const { pointer, camera, raycaster } = useThree();
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Astronaut animations (landing, movement, exit)
  useFrame((state, delta) => {
    // Astronaut landing animation - descend from above
    if (isLandingRef.current && astronautRef.current && !isExiting) {
      landingProgress.current += delta * 1.5;

      // Start from high up and descend
      const startHeight = PLANET_SURFACE_CONFIG.ASTRONAUT_SPAWN_HEIGHT;
      const targetHeight = PLANET_SURFACE_CONFIG.GROUND_LEVEL;

      // Decelerate as approaching ground (easing out)
      const t = Math.min(landingProgress.current / 2, 1);
      const easedT = 1 - Math.pow(1 - t, 3); // Ease out cubic
      const currentHeight = startHeight - (startHeight - targetHeight) * easedT;

      astronautRef.current.position.y = currentHeight;

      // Wobble during descent
      astronautRef.current.rotation.z =
        Math.sin(landingProgress.current * 8) * 0.15 * (1 - easedT);

      // Landing complete
      if (t >= 1) {
        isLandingRef.current = false;
        setShowLandingFlames(false);
        astronautRef.current.position.y = PLANET_SURFACE_CONFIG.GROUND_LEVEL;
        astronautRef.current.rotation.z = 0;
      }
    }

    // Astronaut mouse following - only when landed and not exiting
    if (!isLandingRef.current && !isExiting && astronautRef.current) {
      // Raycast to ground plane
      raycaster.setFromCamera(pointer, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane.current, intersectPoint);

      if (intersectPoint) {
        // Limit to terrain bounds
        const maxRadius = PLANET_SURFACE_CONFIG.MOVEMENT_BOUNDARY_RADIUS;
        const distance = Math.sqrt(
          intersectPoint.x * intersectPoint.x +
            intersectPoint.z * intersectPoint.z
        );
        if (distance > maxRadius) {
          intersectPoint.normalize().multiplyScalar(maxRadius);
        }
        targetPosition.current.set(
          intersectPoint.x,
          PLANET_SURFACE_CONFIG.GROUND_LEVEL,
          intersectPoint.z
        );
      }

      // Move astronaut toward target
      const currentPos = astronautPosition.current;
      const distToTarget = currentPos.distanceTo(targetPosition.current);

      if (distToTarget > 0.1) {
        // Moon walking - slow bouncing movement
        const moveSpeed = PLANET_SURFACE_CONFIG.MOON_WALK_SPEED;
        const direction = targetPosition.current
          .clone()
          .sub(currentPos)
          .normalize();
        currentPos.add(
          direction.multiplyScalar(Math.min(moveSpeed * delta, distToTarget))
        );

        // Face movement direction
        const angle = Math.atan2(direction.x, direction.z);
        astronautRef.current.rotation.y = angle;

        // Moon walk animation - slower, bouncier
        runAnimationTime.current +=
          delta * PLANET_SURFACE_CONFIG.MOON_WALK_STEP_FREQUENCY;
        if (leftLegRef.current && rightLegRef.current) {
          // Alternating legs with slower swing
          leftLegRef.current.rotation.x =
            Math.sin(runAnimationTime.current) * 0.4;
          rightLegRef.current.rotation.x =
            Math.sin(runAnimationTime.current + Math.PI) * 0.4;
        }

        // Bouncy hop - like moon gravity
        const hopCycle = Math.sin(runAnimationTime.current);
        astronautRef.current.position.y =
          hopCycle > 0
            ? hopCycle *
              (PLANET_SURFACE_CONFIG.MOON_WALK_STEP_HEIGHT /
                PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE)
            : PLANET_SURFACE_CONFIG.GROUND_LEVEL;

        if (!isRunning) setIsRunning(true);
      } else {
        // Standing still
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = 0;
          rightLegRef.current.rotation.x = 0;
        }
        astronautRef.current.position.y = PLANET_SURFACE_CONFIG.GROUND_LEVEL;
        if (isRunning) setIsRunning(false);
      }

      // Update astronaut position
      astronautRef.current.position.x = currentPos.x;
      astronautRef.current.position.z = currentPos.z;
    }

    // Astronaut exit animation - rocket launch!
    if (isExiting && astronautRef.current) {
      isLandingRef.current = false;
      exitProgress.current += delta * 2;
      // Accelerate upwards like a rocket
      const height = exitProgress.current * exitProgress.current * 3;
      astronautRef.current.position.y = height;
      // Slight wobble during launch
      astronautRef.current.rotation.z =
        Math.sin(exitProgress.current * 10) * 0.1;
    }
  });

  return (
    <group
      ref={astronautRef}
      position={[2, PLANET_SURFACE_CONFIG.ASTRONAUT_SPAWN_HEIGHT, 0]}
    >
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Helmet visor */}
      <mesh position={[0, 1.5, 0.2]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Backpack/Life support */}
      <mesh position={[0, 0.9, -0.3]}>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.15, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#444444" roughness={0.9} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.15, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#444444" roughness={0.9} />
        </mesh>
      </group>

      {/* Jetpack flames when landing or exiting */}
      {(showLandingFlames || isExiting) && (
        <>
          <mesh position={[0.08, 0.1, -0.2]}>
            <coneGeometry args={[0.08, 0.6, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.08, 0.1, -0.2]}>
            <coneGeometry args={[0.08, 0.6, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
          </mesh>
          {/* Smoke trail */}
          <mesh position={[0, -0.3, -0.2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#888888" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}
