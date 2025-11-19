'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Planet, Project } from '@/app/types';
import Flag3D from './Flag3D';
import { useLanguage } from '@/app/contexts/LanguageContext';

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
  const exitProgress = useRef(0);
  const landingProgress = useRef(0);
  const isLandingRef = useRef(true);
  const [showLandingFlames, setShowLandingFlames] = useState(true);
  const { language } = useLanguage();

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
        {/* Legs */}
        <mesh position={[-0.1, 0.4, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 0.4, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Jetpack flames when landing or exiting */}
        {(isExiting || showLandingFlames) && (
          <>
            <pointLight position={[0, -0.5, 0]} color="#ff4400" intensity={5} distance={8} />
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
