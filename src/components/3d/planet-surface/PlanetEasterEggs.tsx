"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "@/src/types";

interface PlanetEasterEggsProps {
  planet: Planet;
}

// Doge Billboard component for Mars
function DogeBillboard() {
  const texture = useTexture("/textures/easter-eggs/doge-elon.jpg");
  const billboardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (billboardRef.current) {
      // Slight floating animation
      billboardRef.current.position.y =
        1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
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
      <pointLight
        position={[0, 1.5, 0.5]}
        color="#ffdd00"
        intensity={2}
        distance={4}
      />
    </group>
  );
}

// Elon Musk Billboard
function ElonBillboard() {
  const texture = useTexture("/textures/easter-eggs/elon-musk.jpg");
  const billboardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (billboardRef.current) {
      billboardRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
      <spotLight
        position={[0, 3, 1]}
        angle={0.5}
        intensity={3}
        color="#ffffff"
        target-position={[0, 1.8, 0]}
      />
    </group>
  );
}

// SpaceX Logo
function SpaceXSign() {
  const texture = useTexture("/textures/easter-eggs/spacex-logo.png");

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
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      {/* Neon glow effect */}
      <pointLight
        position={[0, 1.2, 0.3]}
        color="#0066ff"
        intensity={1.5}
        distance={3}
      />
    </group>
  );
}

export default function PlanetEasterEggs({ planet }: PlanetEasterEggsProps) {
  // Mars-specific easter eggs (planet id "4" is Mars)
  const isMars = planet.id === "4";

  if (!isMars) return null;

  return (
    <>
      <DogeBillboard />
      <ElonBillboard />
      <SpaceXSign />
    </>
  );
}
