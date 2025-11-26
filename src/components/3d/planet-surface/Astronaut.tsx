"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Planet, Project } from "@/src/types";
import { PLANET_SURFACE_CONFIG } from "@/src/constants/3d-config";

interface AstronautProps {
  planet: Planet;
  isExiting: boolean;
  selectedProject: Project | null;
}

export default function Astronaut({ isExiting, selectedProject }: AstronautProps) {
  const astronautRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const exitProgress = useRef(0);
  const landingProgress = useRef(0);
  const isLandingRef = useRef(true);
  const astronautPosition = useRef(new THREE.Vector3(2, 0, 0));
  const targetPosition = useRef(new THREE.Vector3(2, 0, 0));
  const runAnimationTime = useRef(0);
  const landingCompleteTime = useRef<number | null>(null);
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
        // Record landing complete time
        if (landingCompleteTime.current === null) {
          landingCompleteTime.current = state.clock.elapsedTime;
        }
      }
    }

    // Astronaut mouse following or flag watching - only when landed and not exiting
    if (!isLandingRef.current && !isExiting && astronautRef.current) {
      // If project is selected, move to flag and watch it (ignore all mouse/touch input)
      if (selectedProject) {
        const flagPosition = new THREE.Vector3(-1.5, PLANET_SURFACE_CONFIG.GROUND_LEVEL, 0);
        const currentPos = astronautPosition.current;
        const distToFlag = currentPos.distanceTo(flagPosition);

        if (distToFlag > 0.05) {
          // Move toward flag position
          const moveSpeed = PLANET_SURFACE_CONFIG.MOON_WALK_SPEED;
          const direction = flagPosition.clone().sub(currentPos).normalize();
          currentPos.add(
            direction.multiplyScalar(Math.min(moveSpeed * delta, distToFlag))
          );

          // Face the flag (at [0, 0, 0])
          const flagLookAt = new THREE.Vector3(0, 0, 0);
          const lookDirection = flagLookAt.clone().sub(currentPos).normalize();
          const angle = Math.atan2(lookDirection.x, lookDirection.z);
          astronautRef.current.rotation.y = angle;

          // Walking animation while moving to flag
          runAnimationTime.current +=
            delta * PLANET_SURFACE_CONFIG.MOON_WALK_STEP_FREQUENCY;

          const leftLegCycle = Math.sin(runAnimationTime.current);
          const rightLegCycle = Math.sin(runAnimationTime.current + Math.PI);

          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = leftLegCycle * 0.5;
            rightLegRef.current.rotation.x = rightLegCycle * 0.5;
          }

          const leftFootLanded = leftLegCycle < 0;
          const rightFootLanded = rightLegCycle < 0;
          const bounceFactor = Math.max(
            leftFootLanded ? 0 : Math.abs(leftLegCycle),
            rightFootLanded ? 0 : Math.abs(rightLegCycle)
          );

          const baseHeight = PLANET_SURFACE_CONFIG.GROUND_LEVEL;
          const maxBounce = PLANET_SURFACE_CONFIG.MOON_WALK_STEP_HEIGHT /
                            PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE;
          astronautRef.current.position.y = baseHeight + (bounceFactor * maxBounce * 1.5);

          if (!isRunning) setIsRunning(true);
        } else {
          // Arrived at flag - stand still and watch
          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = 0;
            rightLegRef.current.rotation.x = 0;
          }
          astronautRef.current.position.y = PLANET_SURFACE_CONFIG.GROUND_LEVEL;

          // Keep facing the flag
          const flagLookAt = new THREE.Vector3(0, 0, 0);
          const lookDirection = flagLookAt.clone().sub(currentPos).normalize();
          const angle = Math.atan2(lookDirection.x, lookDirection.z);
          astronautRef.current.rotation.y = angle;

          if (isRunning) setIsRunning(false);
        }

        // Update astronaut position
        astronautRef.current.position.x = currentPos.x;
        astronautRef.current.position.z = currentPos.z;
      } else {
        // Wait 2 seconds after landing before following mouse
        if (landingCompleteTime.current !== null) {
          const timeSinceLanding = state.clock.elapsedTime - landingCompleteTime.current;
          if (timeSinceLanding < 2) {
            // Standing still during wait period
            if (leftLegRef.current && rightLegRef.current) {
              leftLegRef.current.rotation.x = 0;
              rightLegRef.current.rotation.x = 0;
            }
            astronautRef.current.position.y = PLANET_SURFACE_CONFIG.GROUND_LEVEL;
            astronautRef.current.position.x = astronautPosition.current.x;
            astronautRef.current.position.z = astronautPosition.current.z;
            if (isRunning) setIsRunning(false);
            return;
          }
        }

        // Normal mouse following behavior
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

        // Moon walk animation - slower, bouncier with realistic step timing
        runAnimationTime.current +=
          delta * PLANET_SURFACE_CONFIG.MOON_WALK_STEP_FREQUENCY;

        const leftLegCycle = Math.sin(runAnimationTime.current);
        const rightLegCycle = Math.sin(runAnimationTime.current + Math.PI);

        if (leftLegRef.current && rightLegRef.current) {
          // Alternating legs with slower swing
          leftLegRef.current.rotation.x = leftLegCycle * 0.5;
          rightLegRef.current.rotation.x = rightLegCycle * 0.5;
        }

        // Body bounces when each foot lands (deduced from leg swing)
        // When leg swings back (negative rotation), foot lands - body should be down
        // When leg swings forward (positive rotation), foot lifts - body should be up
        const leftFootLanded = leftLegCycle < 0; // Left foot on ground
        const rightFootLanded = rightLegCycle < 0; // Right foot on ground

        // Create bouncing effect: body is highest when foot just leaves ground
        // Use abs to make it always positive, then invert for landing
        const bounceFactor = Math.max(
          leftFootLanded ? 0 : Math.abs(leftLegCycle),
          rightFootLanded ? 0 : Math.abs(rightLegCycle)
        );

        // Body height: low when foot lands, high when foot lifts
        const baseHeight = PLANET_SURFACE_CONFIG.GROUND_LEVEL;
        const maxBounce = PLANET_SURFACE_CONFIG.MOON_WALK_STEP_HEIGHT /
                          PLANET_SURFACE_CONFIG.TERRAIN_NOISE_SCALE;
        astronautRef.current.position.y = baseHeight + (bounceFactor * maxBounce * 1.5);

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
      renderOrder={999}
    >
      {/* Head - higher quality */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.4}
          roughness={0.6}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Helmet visor - glass effect */}
      <mesh position={[0, 1.5, 0.22]} castShadow>
        <sphereGeometry args={[0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#4da6ff"
          transparent
          opacity={0.4}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Helmet ring */}
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[0.32, 0.04, 16, 32]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Body - torso with better shape */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.9, 16]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Chest panel details */}
      <mesh position={[0, 1.0, 0.4]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Control panel lights */}
      <mesh position={[-0.08, 1.0, 0.43]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0, 1.0, 0.43]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0.08, 1.0, 0.43]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Backpack/Life support - more detailed */}
      <group position={[0, 0.9, -0.35]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.7, 0.25]} />
          <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Oxygen tanks */}
        <mesh position={[-0.12, 0.1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, 0.1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Backpack light */}
        <pointLight position={[0, 0.3, 0.15]} color="#4da6ff" intensity={0.5} distance={2} />
      </group>

      {/* Arms - upper and lower sections */}
      <group position={[-0.5, 1.1, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.4, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <cylinderGeometry args={[0.10, 0.11, 0.4, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.78, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ff6600" roughness={0.6} />
        </mesh>
      </group>

      <group position={[0.5, 1.1, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.4, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <cylinderGeometry args={[0.10, 0.11, 0.4, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.78, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ff6600" roughness={0.6} />
        </mesh>
      </group>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.15, 0.3, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.13, 0.5, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.92, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -1.05, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.15, 0.3]} />
          <meshStandardMaterial color="#333333" roughness={0.8} />
        </mesh>
        {/* Boot sole */}
        <mesh position={[0, -1.13, 0.12]}>
          <boxGeometry args={[0.2, 0.03, 0.35]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.15, 0.3, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.13, 0.5, 12]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.7} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.92, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -1.05, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.15, 0.3]} />
          <meshStandardMaterial color="#333333" roughness={0.8} />
        </mesh>
        {/* Boot sole */}
        <mesh position={[0, -1.13, 0.12]}>
          <boxGeometry args={[0.2, 0.03, 0.35]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* Jetpack flames when landing or exiting */}
      {(showLandingFlames || isExiting) && (
        <>
          {/* Left thruster - outer flame */}
          <mesh position={[0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.1, 0.7, 8]} />
            <meshBasicMaterial color="#ff4400" transparent opacity={0.8} />
          </mesh>
          {/* Left thruster - inner flame */}
          <mesh position={[0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.06, 0.5, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          {/* Left thruster - core */}
          <mesh position={[0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.03, 0.3, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Left thruster glow */}
          <pointLight position={[0.12, 0.15, -0.25]} color="#ff6600" intensity={2} distance={3} />

          {/* Right thruster - outer flame */}
          <mesh position={[-0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.1, 0.7, 8]} />
            <meshBasicMaterial color="#ff4400" transparent opacity={0.8} />
          </mesh>
          {/* Right thruster - inner flame */}
          <mesh position={[-0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.06, 0.5, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          {/* Right thruster - core */}
          <mesh position={[-0.12, 0.15, -0.25]}>
            <coneGeometry args={[0.03, 0.3, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Right thruster glow */}
          <pointLight position={[-0.12, 0.15, -0.25]} color="#ff6600" intensity={2} distance={3} />

          {/* Smoke/exhaust clouds */}
          <mesh position={[0.12, -0.2, -0.25]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#666666" transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.12, -0.2, -0.25]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#666666" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, -0.4, -0.25]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#555555" transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}
