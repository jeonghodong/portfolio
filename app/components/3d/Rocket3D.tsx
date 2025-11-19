'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Capsule, Project } from '@/app/types';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface Rocket3DProps {
  rocket: Capsule; // Using Capsule type for data compatibility
  project?: Project;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onEnter: () => void;
}

export default function Rocket3D({
  rocket,
  project,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onEnter,
}: Rocket3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rocketRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const { language } = useLanguage();

  // Track click timing for double-click detection
  const lastClickTime = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  // Spring animation for hover/select effects
  const { scale, positionY } = useSpring({
    scale: isSelected ? 1.3 : isHovered ? 1.1 : 1,
    positionY: isSelected ? 0.5 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Floating and flame animation
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const time = state.clock.elapsedTime;
      const floatY = Math.sin(time * 0.8 + floatOffset.current) * 0.1;
      groupRef.current.position.y = rocket.position[1] + floatY;

      // Gentle rotation when not selected
      if (rocketRef.current && !isSelected) {
        rocketRef.current.rotation.y += 0.003;
      }
    }

    // Flame animation
    if (flameRef.current) {
      const time = state.clock.elapsedTime;
      const flicker = 0.8 + Math.sin(time * 20) * 0.2;
      flameRef.current.scale.y = flicker;
    }
  });

  // Handle click with double-click detection
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const now = Date.now();

    if (isSelected && now - lastClickTime.current < 400) {
      onEnter();
    } else if (isSelected) {
      onEnter();
    } else {
      onSelect();
    }

    lastClickTime.current = now;
  };

  // Get display text
  const rocketLabel = language === 'ko' ? rocket.label_ko : rocket.label_en;

  return (
    <animated.group
      ref={groupRef}
      position={[rocket.position[0], rocket.position[1], rocket.position[2]]}
      scale={scale}
    >
      {/* Main rocket group */}
      <group
        ref={rocketRef}
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
        {/* Nose cone */}
        <mesh position={[0, rocket.size * 0.9, 0]}>
          <coneGeometry args={[rocket.size * 0.25, rocket.size * 0.5, 16]} />
          <meshStandardMaterial
            color={rocket.color}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Main body */}
        <mesh position={[0, rocket.size * 0.3, 0]}>
          <cylinderGeometry args={[rocket.size * 0.25, rocket.size * 0.28, rocket.size * 0.8, 16]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Color stripe on body */}
        <mesh position={[0, rocket.size * 0.4, 0]}>
          <cylinderGeometry args={[rocket.size * 0.26, rocket.size * 0.26, rocket.size * 0.15, 16]} />
          <meshStandardMaterial
            color={rocket.color}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Engine section */}
        <mesh position={[0, -rocket.size * 0.15, 0]}>
          <cylinderGeometry args={[rocket.size * 0.28, rocket.size * 0.22, rocket.size * 0.3, 16]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Engine nozzle */}
        <mesh position={[0, -rocket.size * 0.35, 0]}>
          <coneGeometry args={[rocket.size * 0.2, rocket.size * 0.15, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Fins (4 fins) */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.sin((i * Math.PI) / 2) * rocket.size * 0.28,
              -rocket.size * 0.1,
              Math.cos((i * Math.PI) / 2) * rocket.size * 0.28,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.02, rocket.size * 0.4, rocket.size * 0.3]} />
            <meshStandardMaterial
              color={rocket.color}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Window */}
        <mesh position={[0, rocket.size * 0.5, rocket.size * 0.23]} rotation={[0.3, 0, 0]}>
          <circleGeometry args={[rocket.size * 0.08, 16]} />
          <meshStandardMaterial
            color="#88ccff"
            emissive="#4488ff"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Engine flame (visible when hovered or selected) */}
      {(isHovered || isSelected) && (
        <mesh ref={flameRef} position={[0, -rocket.size * 0.5, 0]}>
          <coneGeometry args={[rocket.size * 0.15, rocket.size * 0.4, 8]} />
          <meshBasicMaterial
            color={rocket.glowColor}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Outer glow effect */}
      <mesh>
        <cylinderGeometry args={[rocket.size * 0.4, rocket.size * 0.4, rocket.size * 1.5, 16]} />
        <meshBasicMaterial
          color={rocket.glowColor}
          transparent
          opacity={isHovered || isSelected ? 0.1 : 0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rocket label */}
      {(isHovered || isSelected) && (
        <>
          <Text
            position={[0, rocket.size * 1.4, 0]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
            maxWidth={3}
          >
            {rocketLabel}
          </Text>

          {/* Enter hint */}
          {isSelected && (
            <Text
              position={[0, rocket.size * 1.15, 0]}
              fontSize={0.12}
              color={rocket.glowColor}
              anchorX="center"
              anchorY="middle"
            >
              {language === 'ko' ? '클릭하여 발사' : 'Click to Launch'}
            </Text>
          )}
        </>
      )}

      {/* Particle trail when selected */}
      {isSelected && (
        <group>
          {Array.from({ length: 6 }).map((_, i) => {
            const yOffset = -rocket.size * 0.6 - i * 0.15;
            const spread = i * 0.05;
            return (
              <mesh
                key={i}
                position={[
                  (Math.random() - 0.5) * spread,
                  yOffset,
                  (Math.random() - 0.5) * spread,
                ]}
              >
                <sphereGeometry args={[0.03 - i * 0.004, 8, 8]} />
                <meshBasicMaterial
                  color={rocket.glowColor}
                  transparent
                  opacity={0.8 - i * 0.1}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </animated.group>
  );
}
