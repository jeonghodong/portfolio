"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { Planet, Project } from "@/app/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface HologramScreenProps {
  planet: Planet;
  project: Project | null;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  isWarpActive: boolean;
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
  isWarpActive,
  onSelect,
  onHover,
  onEnter,
}: HologramScreenProps) {
  const { language } = useLanguage();
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation for selection - larger scale for selected
  const { scale } = useSpring({
    scale: isWarpActive ? 0 : isSelected ? 1.4 : isHovered ? 1.08 : 1,
    config: { tension: 200, friction: 40 },
  });

  // Hologram flicker effect and mouse-based rotation
  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.elapsedTime;
      const baseOpacity = isSelected ? 0.4 : isHovered ? 0.3 : 0.2;
      const flicker = Math.sin(time * 3 + position[0] * 10) * 0.05;

      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = baseOpacity + flicker;
      }
    }

    // Gentle floating animation
    if (groupRef.current && !isSelected) {
      groupRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
    }

    // Mouse-based rotation for depth effect
    if (groupRef.current) {
      const maxTilt = 0.15; // Maximum tilt in radians (~8.6 degrees)

      // Calculate target rotation based on mouse position and screen position
      // Screens further from mouse cursor center should tilt more
      const targetRotationY = mousePosition.x * maxTilt;
      const targetRotationX = -mousePosition.y * maxTilt;

      // Smooth lerp to target rotation
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
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    onHover(false);
    document.body.style.cursor = "auto";
  };

  const glowColor = new THREE.Color(planet.environment.particleColor);
  const title = project
    ? project[`title_${language}`]
    : planet[`name_${language}`];
  const description = project
    ? project[`description_${language}`]
    : `Explore ${planet[`name_${language}`]}`;

  // Particle geometry for selected state
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(
      Array.from({ length: 60 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 1.8 + Math.random() * 0.3;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0.1 + Math.random() * 0.1,
        ];
      }).flat()
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Hologram frame */}
      <mesh ref={frameRef}>
        <boxGeometry args={[3.2, 2.2, 0.05]} />
        <meshStandardMaterial
          color="#1a2a4a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
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
        <meshBasicMaterial color="#001122" transparent opacity={0.6} />
      </mesh>

      {/* Glowing border */}
      <mesh ref={glowRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[3.1, 2.1]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.2} />
      </mesh>

      {/* Corner accents */}
      {[
        [-1.5, 1, 0.05],
        [1.5, 1, 0.05],
        [-1.5, -1, 0.05],
        [1.5, -1, 0.05],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Planet icon/indicator */}
      <mesh position={[0, 0.7, 0.06]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial
          color={planet.environment.particleColor}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.3, 0.06]}
        fontSize={0.18}
        color="#88ccff"
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
        color="#aaddff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.6}
        lineHeight={1.2}
      >
        {description.length > 80
          ? description.substring(0, 77) + "..."
          : description}
      </Text>

      {/* Technologies or planet type */}
      {project && (
        <Text
          position={[0, -0.6, 0.06]}
          fontSize={0.08}
          color="#6699cc"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
        >
          {project.technologies.slice(0, 3).join(" • ")}
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
          {language === "ko" ? "클릭하여 출발" : "Click to launch"}
        </Text>
      )}

      {/* Particle effect around selected screen */}
      {isSelected && (
        <points geometry={particleGeometry}>
          <pointsMaterial
            size={0.03}
            color={glowColor}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </animated.group>
  );
}
