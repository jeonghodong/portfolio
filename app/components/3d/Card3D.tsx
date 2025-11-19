"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import type { Project } from "@/app/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface Card3DProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: number;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (isHovering: boolean) => void;
  onClick: () => void;
  onClose: () => void;
}

export default function Card3D({
  project,
  index,
  position,
  rotation,
  isSelected,
  isHovered,
  onHover,
  onClick,
}: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { language } = useLanguage();

  const displayTitle = language === 'ko' ? project.title_ko : project.title_en;

  // Spring animation for selection
  // Modal size is ~900px, card is 2.5 units → scale to ~2.8 to match modal
  const { scale, positionX, positionY, positionZ, rotationY } = useSpring({
    scale: isSelected ? 2.8 : isHovered ? 1.05 : 1,
    positionX: isSelected ? 0 : isHovered ? position[0] + 0.3 : position[0],
    positionY: isSelected ? 0 : 0,
    positionZ: isSelected ? 5 : position[2],
    rotationY: isSelected ? 0 : rotation,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  return (
    <animated.group
      position-x={positionX}
      position-y={positionY}
      position-z={positionZ}
      rotation-y={rotationY}
      scale={scale}
    >
      <RoundedBox
        ref={meshRef}
        args={[3.8, 5.2, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerOver={() => !isSelected && onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        {/* Card Material */}
        <meshStandardMaterial
          color={isSelected ? "#0a0a0a" : "#2a2a2a"}
          metalness={0.5}
          roughness={0.3}
          emissive={isHovered ? "#444444" : "#1a1a1a"}
          emissiveIntensity={isSelected ? 0.2 : 0.5}
          transparent={isSelected}
          opacity={isSelected ? 0.95 : 1}
        />
      </RoundedBox>

      {/* Project Number - Hide when selected */}
      {!isSelected && (
        <Text
          position={[0, 1.9, 0.06]}
          fontSize={1.2}
          color={"#ffffff"}
          anchorX="center"
          anchorY="middle"
        >
          {String(index + 1).padStart(2, "0")}
        </Text>
      )}

      {/* Project Title - Hide when selected */}
      {!isSelected && (
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.28}
          color={"#cccccc"}
          anchorX="center"
          anchorY="middle"
          maxWidth={3.4}
          textAlign="center"
        >
          {displayTitle}
        </Text>
      )}

      {/* Featured Badge - Hide when selected */}
      {project.featured && !isSelected && (
        <Text
          position={[0, -2.0, 0.06]}
          fontSize={0.18}
          color={"#ffff00"}
          anchorX="center"
          anchorY="middle"
        >
          ★ {language === 'ko' ? '주요 프로젝트' : 'FEATURED'}
        </Text>
      )}

      {/* Card Border/Edge */}
      <RoundedBox args={[3.8, 5.2, 0.1]} radius={0.1} smoothness={4}>
        <meshBasicMaterial
          color={isHovered ? "#ffffff" : "#333333"}
          wireframe
          transparent
          opacity={0.3}
        />
      </RoundedBox>
    </animated.group>
  );
}
