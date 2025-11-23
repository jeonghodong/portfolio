'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Planet, Project } from '@/app/types';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface HologramScreenProps {
  planet: Planet;
  project: Project | null;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onEnter: () => void;
}

export default function HologramScreen({
  planet,
  project,
  position,
  rotation = [0, 0, 0],
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onEnter,
}: HologramScreenProps) {
  const { language } = useLanguage();
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);
  const glitchRef = useRef({ intensity: 0, nextGlitch: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation for selection - larger scale for selected
  const { scale, glowIntensity } = useSpring({
    scale: isSelected ? 1.4 : isHovered ? 1.08 : 1,
    glowIntensity: isSelected ? 1.2 : isHovered ? 0.8 : 0.5,
    config: { tension: 200, friction: 40 },
  });

  // Enhanced hologram effects
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Enhanced glow with stronger intensity
    if (glowRef.current) {
      const baseOpacity = isSelected ? 0.7 : isHovered ? 0.5 : 0.3;
      const flicker = Math.sin(time * 3 + position[0] * 10) * 0.1;

      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = baseOpacity + flicker;
      }
    }

    // Scanline animation
    if (scanlineRef.current) {
      // Move scanline up and down
      const scanSpeed = 0.5;
      const yPosition = ((time * scanSpeed) % 4) - 2; // -2 to 2 range
      scanlineRef.current.position.y = yPosition;
    }

    // Glitch effect
    if (groupRef.current) {
      glitchRef.current.nextGlitch -= delta;

      if (glitchRef.current.nextGlitch <= 0) {
        // Trigger glitch
        glitchRef.current.intensity = 0.02 + Math.random() * 0.03;
        glitchRef.current.nextGlitch = 3 + Math.random() * 7; // Every 3-10 seconds
      }

      // Apply and decay glitch
      if (glitchRef.current.intensity > 0) {
        const glitchOffset = (Math.random() - 0.5) * glitchRef.current.intensity;
        groupRef.current.position.x = position[0] + glitchOffset;
        glitchRef.current.intensity *= 0.9; // Decay
      }
    }

    // Gentle floating animation
    if (groupRef.current && !isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.05;
    }

    // Mouse-based rotation for depth effect
    if (groupRef.current) {
      const maxTilt = 0.15;
      const targetRotationY = mousePosition.x * maxTilt;
      const targetRotationX = -mousePosition.y * maxTilt;

      const currentRotation = groupRef.current.rotation;
      currentRotation.y += (targetRotationY - currentRotation.y) * 0.05;
      currentRotation.x += (targetRotationX - currentRotation.x) * 0.05;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();

    if (isSelected) {
      // Already selected - launch warp
      onEnter();
    } else {
      // Not selected - select and zoom in
      onSelect();
    }
  };

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    onHover(false);
    document.body.style.cursor = 'auto';
  };

  const glowColor = new THREE.Color(planet.environment.particleColor);
  const title = project ? project[`title_${language}`] : planet[`name_${language}`];
  const description = project
    ? project[`description_${language}`]
    : `Explore ${planet[`name_${language}`]}`;

  // Enhanced particle geometry for selected state
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(
      Array.from({ length: 100 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 1.8 + Math.random() * 0.4;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0.1 + Math.random() * 0.2,
        ];
      }).flat()
    );
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Data stream particles
  const dataStreamGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 50;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4); // 4 sides
      let x, y;

      if (side === 0) { // left
        x = -1.6;
        y = (Math.random() - 0.5) * 2;
      } else if (side === 1) { // right
        x = 1.6;
        y = (Math.random() - 0.5) * 2;
      } else if (side === 2) { // top
        x = (Math.random() - 0.5) * 3;
        y = 1.1;
      } else { // bottom
        x = (Math.random() - 0.5) * 3;
        y = -1.1;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = 0.08 + Math.random() * 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Enhanced hologram frame */}
      <mesh ref={frameRef}>
        <boxGeometry args={[3.3, 2.3, 0.08]} />
        <meshStandardMaterial
          color="#0a1a3a"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.5}
          emissive={glowColor}
          emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Frame edge glow */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[3.35, 2.35, 0.02]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Hologram screen background - clickable area */}
      <mesh
        position={[0, 0, 0.03]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial
          color="#001a33"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Dual layer glow - inner */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[3.05, 2.05]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isSelected ? 0.5 : isHovered ? 0.35 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dual layer glow - outer */}
      <mesh ref={glowRef} position={[0, 0, 0.045]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scanline effect */}
      <mesh ref={scanlineRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[3, 0.02]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Enhanced corner accents */}
      {[
        [-1.55, 1.05, 0.05],
        [1.55, 1.05, 0.05],
        [-1.55, -1.05, 0.05],
        [1.55, -1.05, 0.05],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={pos as [number, number, number]}>
            <boxGeometry args={[0.2, 0.2, 0.03]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={isSelected ? 1 : isHovered ? 0.9 : 0.7}
            />
          </mesh>
          {/* Corner glow */}
          <mesh position={[pos[0], pos[1], pos[2] + 0.01]}>
            <boxGeometry args={[0.25, 0.25, 0.01]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Planet icon/indicator */}
      <mesh position={[0, 0.7, 0.06]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color={planet.environment.particleColor} transparent opacity={0.7} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.3, 0.06]}
        fontSize={0.18}
        color="#aaffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        position={[0, -0.1, 0.06]}
        fontSize={0.1}
        color="#ccffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.6}
        lineHeight={1.2}
      >
        {description.length > 80 ? description.substring(0, 77) + '...' : description}
      </Text>

      {/* Technologies or planet type */}
      {project && (
        <Text
          position={[0, -0.6, 0.06]}
          fontSize={0.08}
          color="#88ddff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
        >
          {project.technologies.slice(0, 3).join(' • ')}
        </Text>
      )}

      {/* "Click to launch" hint when selected */}
      {isSelected && (
        <Text
          position={[0, -0.9, 0.06]}
          fontSize={0.09}
          color="#44ff88"
          anchorX="center"
          anchorY="middle"
        >
          {language === 'ko' ? '클릭하여 출발' : 'Click to launch'}
        </Text>
      )}

      {/* Enhanced particle effect around selected screen */}
      {isSelected && (
        <points geometry={particleGeometry}>
          <pointsMaterial
            size={0.04}
            color={glowColor}
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Data stream particles */}
      {(isSelected || isHovered) && (
        <points geometry={dataStreamGeometry}>
          <pointsMaterial
            size={0.02}
            color={glowColor}
            transparent
            opacity={isSelected ? 0.7 : 0.4}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </animated.group>
  );
}
