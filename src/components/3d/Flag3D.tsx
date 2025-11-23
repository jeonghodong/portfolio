"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface Flag3DProps {
  position: [number, number, number];
  onClick: () => void;
  planetName: string;
  projectTitle: string;
}

export default function Flag3D({
  position,
  onClick,
  projectTitle,
}: Flag3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Mesh>(null);
  const { language } = useLanguage();

  // Flag waving and bouncing animation
  useFrame((state) => {
    if (flagRef.current) {
      // Wave animation using sine wave
      const time = state.clock.elapsedTime;
      const geometry = flagRef.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const waveX = 0.1 * Math.sin(x * 2 + time * 3);
        const waveY = 0.05 * Math.sin(x * 3 + time * 2);
        positionAttribute.setZ(i, waveX + waveY);
      }
      positionAttribute.needsUpdate = true;
    }

    // Bouncing animation - always active
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Bouncy effect using abs(sin) for a bounce feel
      const bounce = Math.abs(Math.sin(time * 3)) * 0.3;
      groupRef.current.position.y = bounce;

      // Slight rotation wiggle
      groupRef.current.rotation.y = Math.sin(time * 2) * 0.1;

      // Scale pulse - always prominent
      const pulse = Math.sin(time * 4) * 0.1 + 1.1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Flag pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pole top ball */}
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Flag fabric */}
      <mesh ref={flagRef} position={[0.5, 2.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 0.7, 20, 10]} />
        <meshStandardMaterial
          color="#ff4444"
          side={THREE.DoubleSide}
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Star on flag */}
      <mesh position={[0.5, 2.5, 0.01]}>
        <circleGeometry args={[0.15, 5]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Always visible label */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {language === "ko" ? "클릭하여 프로젝트 보기" : "Click to view project"}
      </Text>
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.22}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {projectTitle}
      </Text>

      {/* Always visible glow */}
      <pointLight
        position={[0, 2, 0]}
        color="#ff4444"
        intensity={3}
        distance={6}
      />
    </group>
  );
}
