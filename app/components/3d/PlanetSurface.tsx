'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Planet, Project } from '@/app/types';
import Flag3D from './Flag3D';
import { useLanguage } from '@/app/contexts/LanguageContext';

// Doge Billboard component for Mars
function DogeBillboard() {
  const texture = useTexture('/textures/easter-eggs/doge-elon.jpg');
  const billboardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (billboardRef.current) {
      // Slight floating animation
      billboardRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[-4, 0, 3]}>
      {/* Billboard stand */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.5} />
      </mesh>
      {/* Billboard frame */}
      <mesh ref={billboardRef} position={[0, 1.5, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      {/* "WOW" text effect - glowing light */}
      <pointLight position={[0, 1.5, 0.5]} color="#ffdd00" intensity={2} distance={4} />
    </group>
  );
}

// Elon Musk Billboard
function ElonBillboard() {
  const texture = useTexture('/textures/easter-eggs/elon-musk.jpg');
  const billboardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (billboardRef.current) {
      billboardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[6, 0, 4]} rotation={[0, -0.5, 0]}>
      {/* Billboard stand */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
      {/* Billboard frame */}
      <mesh ref={billboardRef} position={[0, 1.8, 0]}>
        <planeGeometry args={[1.2, 1.5]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      {/* Spotlight */}
      <spotLight position={[0, 3, 1]} angle={0.5} intensity={3} color="#ffffff" target-position={[0, 1.8, 0]} />
    </group>
  );
}

// SpaceX Logo
function SpaceXSign() {
  const texture = useTexture('/textures/easter-eggs/spacex-logo.png');

  return (
    <group position={[0, 0, 8]} rotation={[0, Math.PI, 0]}>
      {/* Sign posts */}
      <mesh position={[-1, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} />
      </mesh>
      <mesh position={[1, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 1.2, 0]}>
        <planeGeometry args={[2.5, 0.8]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} transparent />
      </mesh>
      {/* Neon glow effect */}
      <pointLight position={[0, 1.2, 0.3]} color="#0066ff" intensity={1.5} distance={3} />
    </group>
  );
}

interface PlanetSurfaceProps {
  planet: Planet;
  project: Project;
  onFlagClick: () => void;
  onBack: () => void;
  isExiting: boolean;
}

export default function PlanetSurface({ planet, project, onFlagClick, onBack, isExiting }: PlanetSurfaceProps) {
  const particlesRef = useRef<THREE.Points>(null);
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
  const { language } = useLanguage();
  const { pointer, camera, raycaster } = useThree();
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Generate terrain particles/dust
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a circular area
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 30;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Generate circular terrain with height variation
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.CircleGeometry(50, 64, 0, Math.PI * 2);
    geometry.rotateX(-Math.PI / 2);

    // Add height variation to vertices
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const distance = Math.sqrt(x * x + z * z);

      // Create gentle rolling hills
      const noise = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5 +
                    Math.sin(x * 0.1 + z * 0.1) * 0.3;

      // Fade out at edges
      const edgeFade = Math.max(0, 1 - distance / 45);
      positions.setY(i, noise * edgeFade - 0.1);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Generate hills/mounds
  const hills = useMemo(() => {
    const hillData: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 20;
      hillData.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ],
        scale: [
          2 + Math.random() * 3,
          0.5 + Math.random() * 1.5,
          2 + Math.random() * 3,
        ],
      });
    }
    return hillData;
  }, []);

  // Animate particles and astronaut landing/exit
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        if (positions[i + 1] > 10) positions[i + 1] = 0;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Astronaut landing animation - descend from above
    if (isLandingRef.current && astronautRef.current && !isExiting) {
      landingProgress.current += delta * 1.5;

      // Start from high up and descend
      const startHeight = 15;
      const targetHeight = 0;

      // Decelerate as approaching ground (easing out)
      const t = Math.min(landingProgress.current / 2, 1);
      const easedT = 1 - Math.pow(1 - t, 3); // Ease out cubic
      const currentHeight = startHeight - (startHeight - targetHeight) * easedT;

      astronautRef.current.position.y = currentHeight;

      // Wobble during descent
      astronautRef.current.rotation.z = Math.sin(landingProgress.current * 8) * 0.15 * (1 - easedT);

      // Landing complete
      if (t >= 1) {
        isLandingRef.current = false;
        setShowLandingFlames(false);
        astronautRef.current.position.y = 0;
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
        const maxRadius = 15;
        const distance = Math.sqrt(intersectPoint.x * intersectPoint.x + intersectPoint.z * intersectPoint.z);
        if (distance > maxRadius) {
          intersectPoint.normalize().multiplyScalar(maxRadius);
        }
        targetPosition.current.set(intersectPoint.x, 0, intersectPoint.z);
      }

      // Move astronaut toward target
      const currentPos = astronautPosition.current;
      const distToTarget = currentPos.distanceTo(targetPosition.current);

      if (distToTarget > 0.1) {
        // Running
        const moveSpeed = 3;
        const direction = targetPosition.current.clone().sub(currentPos).normalize();
        currentPos.add(direction.multiplyScalar(Math.min(moveSpeed * delta, distToTarget)));

        // Face movement direction
        const angle = Math.atan2(direction.x, direction.z);
        astronautRef.current.rotation.y = angle;

        // Run animation
        runAnimationTime.current += delta * 12;
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(runAnimationTime.current) * 0.6;
          rightLegRef.current.rotation.x = Math.sin(runAnimationTime.current + Math.PI) * 0.6;
        }

        // Slight body bob
        astronautRef.current.position.y = Math.abs(Math.sin(runAnimationTime.current)) * 0.1;

        if (!isRunning) setIsRunning(true);
      } else {
        // Standing still
        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = 0;
          rightLegRef.current.rotation.x = 0;
        }
        astronautRef.current.position.y = 0;
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
      astronautRef.current.rotation.z = Math.sin(exitProgress.current * 10) * 0.1;
    }
  });

  // Generate rocks/features based on planet - more rocks in circular pattern
  const rocks = useMemo(() => {
    const rockData: { position: [number, number, number]; scale: number; rotation: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 25;
      rockData.push({
        position: [
          Math.cos(angle) * radius,
          Math.random() * 0.1,
          Math.sin(angle) * radius,
        ],
        scale: 0.2 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    return rockData;
  }, []);

  // Generate small pebbles for detail
  const pebbles = useMemo(() => {
    const pebbleData: { position: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 30;
      pebbleData.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ],
        scale: 0.05 + Math.random() * 0.15,
      });
    }
    return pebbleData;
  }, []);

  return (
    <>
      {/* Camera for surface exploration */}
      <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={60} />

      {/* Sky/atmosphere based on planet */}
      <color attach="background" args={[planet.environment.skyColor]} />
      <fog attach="fog" args={[planet.environment.fogColor, 10, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} color={planet.environment.ambientColor} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color={planet.environment.ambientColor} />

      {/* Circular ground with terrain variation */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          color={planet.environment.groundColor}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Hills/mounds for depth */}
      {hills.map((hill, i) => (
        <mesh key={`hill-${i}`} position={hill.position} scale={hill.scale} castShadow>
          <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Rocks/terrain features */}
      {rocks.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={rock.position}
          rotation={[0, rock.rotation, Math.random() * 0.3]}
          castShadow
        >
          <dodecahedronGeometry args={[rock.scale, 0]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Small pebbles for ground detail */}
      {pebbles.map((pebble, i) => (
        <mesh key={`pebble-${i}`} position={pebble.position}>
          <sphereGeometry args={[pebble.scale, 6, 6]} />
          <meshStandardMaterial
            color={planet.environment.groundColor}
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Floating particles (dust, snow, etc) */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.1}
          color={planet.environment.particleColor}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Flag with project */}
      <Flag3D
        position={[0, 0, -5]}
        onClick={onFlagClick}
        planetName={language === 'ko' ? planet.name_ko : planet.name}
        projectTitle={language === 'ko' ? project.title_ko : project.title_en}
      />

      {/* Easter Eggs based on planet */}
      {planet.name === 'Mars' && (
        <>
          {/* Doge Billboard on Mars */}
          <DogeBillboard />
          {/* Elon Musk Billboard */}
          <ElonBillboard />
          {/* SpaceX Sign */}
          <SpaceXSign />
          {/* Tesla Roadster */}
          <group position={[5, 0.3, -3]} rotation={[0, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[1.2, 0.3, 0.5]} />
              <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Wheels */}
            <mesh position={[0.4, -0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[-0.4, -0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[0.4, -0.1, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[-0.4, -0.1, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
        </>
      )}


      {/* Astronaut on surface */}
      <group ref={astronautRef} position={[2, 0, 0]}>
        {/* Simple astronaut representation */}
        {/* Helmet */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 1.6, 0.15]}>
          <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 1, 0]}>
          <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 1.1, -0.2]}>
          <boxGeometry args={[0.3, 0.4, 0.15]} />
          <meshStandardMaterial color="#cccccc" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Legs with animation refs */}
        <group ref={leftLegRef} position={[-0.1, 0.4, 0]}>
          <mesh>
            <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.25, 0.05]}>
            <boxGeometry args={[0.1, 0.1, 0.18]} />
            <meshStandardMaterial color="#ff6b35" />
          </mesh>
        </group>
        <group ref={rightLegRef} position={[0.1, 0.4, 0]}>
          <mesh>
            <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.25, 0.05]}>
            <boxGeometry args={[0.1, 0.1, 0.18]} />
            <meshStandardMaterial color="#ff6b35" />
          </mesh>
        </group>

        {/* Jetpack flames when landing, exiting, or running */}
        {(isExiting || showLandingFlames || isRunning) && (
          <>
            <pointLight
              position={[0, -0.5, 0]}
              color="#ff4400"
              intensity={isRunning ? 2 : 5}
              distance={isRunning ? 4 : 8}
            />
            <mesh position={[0.08, 0.1, -0.2]}>
              <coneGeometry args={[isRunning ? 0.04 : 0.08, isRunning ? 0.3 : 0.6, 8]} />
              <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
            </mesh>
            <mesh position={[-0.08, 0.1, -0.2]}>
              <coneGeometry args={[isRunning ? 0.04 : 0.08, isRunning ? 0.3 : 0.6, 8]} />
              <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
            </mesh>
            {/* Smoke trail - only for landing/exiting */}
            {!isRunning && (
              <mesh position={[0, -0.3, -0.2]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#888888" transparent opacity={0.5} />
              </mesh>
            )}
          </>
        )}
      </group>

      {/* Camera controls for exploration */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.3}
        minDistance={3}
        maxDistance={20}
        target={[0, 1, 0]}
      />
    </>
  );
}
