'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Capsule, Project } from '@/app/types';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface Capsule3DProps {
  capsule: Capsule;
  project?: Project;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onEnter: () => void;
}

export default function Capsule3D({
  capsule,
  project,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onEnter,
}: Capsule3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { language } = useLanguage();

  // Track click timing for double-click detection
  const lastClickTime = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  // Spring animation for hover/select effects
  const { scale, positionY } = useSpring({
    scale: isSelected ? 1.4 : isHovered ? 1.15 : 1,
    positionY: isSelected ? 0.3 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Target emissive intensity
  const targetEmissive = isSelected ? 0.6 : isHovered ? 0.3 : 0.1;

  // Floating and rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const time = state.clock.elapsedTime;
      const floatY = Math.sin(time * 0.8 + floatOffset.current) * 0.15;
      groupRef.current.position.y = capsule.position[1] + floatY;

      // Gentle rotation
      if (capsuleRef.current && !isSelected) {
        capsuleRef.current.rotation.y += 0.005;
      }
    }

    // Smooth emissive intensity update
    if (materialRef.current) {
      materialRef.current.emissiveIntensity +=
        (targetEmissive - materialRef.current.emissiveIntensity) * 0.1;
    }

    // Glow pulse animation
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + floatOffset.current) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  // Handle click with double-click detection
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const now = Date.now();

    if (isSelected && now - lastClickTime.current < 400) {
      // Double click - enter the planet
      onEnter();
    } else if (isSelected) {
      // Already selected, single click enters
      onEnter();
    } else {
      // First click - select the capsule
      onSelect();
    }

    lastClickTime.current = now;
  };

  // Get display text
  const projectTitle = project
    ? (language === 'ko' ? capsule.label_ko : capsule.label_en)
    : (language === 'ko' ? '준비 중' : 'Coming Soon');

  return (
    <animated.group
      ref={groupRef}
      position={[capsule.position[0], capsule.position[1], capsule.position[2]]}
      scale={scale}
    >
      {/* Main capsule body */}
      <mesh
        ref={capsuleRef}
        onClick={handleClick}
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
        <capsuleGeometry args={[capsule.size * 0.4, capsule.size * 0.8, 8, 16]} />
        <meshStandardMaterial
          ref={materialRef}
          color={capsule.color}
          emissive={capsule.color}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Glass dome top */}
      <mesh position={[0, capsule.size * 0.5, 0]}>
        <sphereGeometry args={[capsule.size * 0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh position={[0, capsule.size * 0.3, 0]}>
        <sphereGeometry args={[capsule.size * 0.2, 16, 16]} />
        <meshBasicMaterial
          color={capsule.glowColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer glow effect */}
      <mesh ref={glowRef}>
        <capsuleGeometry args={[capsule.size * 0.5, capsule.size * 0.9, 8, 16]} />
        <meshBasicMaterial
          color={capsule.glowColor}
          transparent
          opacity={isHovered || isSelected ? 0.15 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring decoration */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -capsule.size * 0.1, 0]}>
        <torusGeometry args={[capsule.size * 0.5, 0.03, 8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={capsule.glowColor}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -capsule.size * 0.6, 0]}>
        <cylinderGeometry args={[capsule.size * 0.45, capsule.size * 0.5, 0.1, 32]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Project title label */}
      {(isHovered || isSelected) && (
        <>
          <Text
            position={[0, capsule.size + 0.5, 0]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
            maxWidth={3}
          >
            {projectTitle}
          </Text>

          {/* Enter hint */}
          {isSelected && (
            <Text
              position={[0, capsule.size + 0.2, 0]}
              fontSize={0.12}
              color={capsule.glowColor}
              anchorX="center"
              anchorY="middle"
            >
              {language === 'ko' ? '클릭하여 진입' : 'Click to Enter'}
            </Text>
          )}
        </>
      )}

      {/* Particles around capsule when selected */}
      {isSelected && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = capsule.size * 0.8;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle * 2) * 0.2,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={capsule.glowColor} />
              </mesh>
            );
          })}
        </group>
      )}
    </animated.group>
  );
}
