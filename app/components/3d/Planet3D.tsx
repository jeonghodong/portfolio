'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Planet, Project } from '@/app/types';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface Planet3DProps {
  planet: Planet;
  project?: Project;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export default function Planet3D({
  planet,
  project,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Planet3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { language } = useLanguage();

  // Load planet texture
  const texture = useLoader(THREE.TextureLoader, planet.textureUrl);

  // Load ring texture - always call useTexture but with fallback
  const ringTexturePath = planet.ringTextureUrl || planet.textureUrl;
  const ringTexture = useTexture(ringTexturePath);

  // Spring animation for hover/select effects
  const { scale } = useSpring({
    scale: isSelected ? 2.5 : isHovered ? 1.3 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Target emissive intensity
  const targetEmissive = isSelected ? 0.3 : isHovered ? 0.15 : 0;

  // Rotation animation and emissive update
  useFrame(() => {
    if (meshRef.current && !isSelected) {
      meshRef.current.rotation.y += planet.rotationSpeed;
    }
    if (ringRef.current && !isSelected) {
      ringRef.current.rotation.z += planet.rotationSpeed * 0.5;
    }
    // Smooth emissive intensity update
    if (materialRef.current) {
      materialRef.current.emissiveIntensity +=
        (targetEmissive - materialRef.current.emissiveIntensity) * 0.1;
    }
  });

  // Get display text
  const planetName = language === 'ko' ? planet.name_ko : planet.name;
  const projectTitle = project
    ? (language === 'ko' ? project.title_ko : project.title_en)
    : (language === 'ko' ? '준비 중' : 'Coming Soon');

  return (
    <animated.group
      position={planet.position}
      scale={scale}
    >
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          emissive="#ffffff"
          emissiveIntensity={0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Saturn ring */}
      {planet.hasRing && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2.5, 0, 0]}
        >
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet name label */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, planet.size + 0.8, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {planetName}
        </Text>
      )}

      {/* Project title label */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, planet.size + 0.4, 0]}
          fontSize={0.25}
          color={project ? "#ffd700" : "#888888"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {projectTitle}
        </Text>
      )}

      {/* Glow effect when hovered */}
      {isHovered && !isSelected && (
        <mesh>
          <sphereGeometry args={[planet.size * 1.1, 32, 32]} />
          <meshBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </animated.group>
  );
}
