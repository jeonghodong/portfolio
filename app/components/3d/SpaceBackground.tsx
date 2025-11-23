"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMobileOptimization } from "@/app/hooks/useMobileOptimization";

// Shooting star component
function ShootingStar({ onComplete }: { onComplete: () => void }) {
  const lineRef = useRef<THREE.Line | null>(null);
  const progressRef = useRef(0);

  // Random starting position and direction
  const config = useMemo(() => {
    const startX = (Math.random() - 0.5) * 200;
    const startY = 50 + Math.random() * 50;
    const startZ = -50 - Math.random() * 100;

    // Direction: mostly downward and to the side
    const dirX = (Math.random() - 0.5) * 2;
    const dirY = -1 - Math.random() * 0.5;
    const dirZ = Math.random() * 0.5;

    const speed = 80 + Math.random() * 40;
    const length = 3 + Math.random() * 4;

    return { startX, startY, startZ, dirX, dirY, dirZ, speed, length };
  }, []);

  // Create line object
  const lineObject = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Line(geo, mat);
  }, []);

  useFrame((state, delta) => {
    if (!lineRef.current) return;

    progressRef.current += delta * config.speed;

    const positions = lineRef.current.geometry.attributes.position
      .array as Float32Array;

    // Head position
    const headX = config.startX + config.dirX * progressRef.current;
    const headY = config.startY + config.dirY * progressRef.current;
    const headZ = config.startZ + config.dirZ * progressRef.current;

    // Tail position (behind the head)
    const tailX = headX - config.dirX * config.length;
    const tailY = headY - config.dirY * config.length;
    const tailZ = headZ - config.dirZ * config.length;

    positions[0] = tailX;
    positions[1] = tailY;
    positions[2] = tailZ;
    positions[3] = headX;
    positions[4] = headY;
    positions[5] = headZ;

    lineRef.current.geometry.attributes.position.needsUpdate = true;

    // Remove when out of view
    if (headY < -50) {
      onComplete();
    }
  });

  return (
    <primitive
      object={lineObject}
      ref={(obj: THREE.Line | null) => {
        lineRef.current = obj;
      }}
    />
  );
}

// Shooting stars manager
function ShootingStars() {
  const [stars, setStars] = useState<number[]>([]);
  const nextSpawnRef = useRef(Math.random() * 3);
  const idCounterRef = useRef(0);

  useFrame((state, delta) => {
    nextSpawnRef.current -= delta;

    if (nextSpawnRef.current <= 0) {
      // Spawn new shooting star
      setStars((prev) => [...prev, idCounterRef.current++]);
      // Next spawn in 2-6 seconds
      nextSpawnRef.current = 2 + Math.random() * 4;
    }
  });

  const handleComplete = (id: number) => {
    setStars((prev) => prev.filter((starId) => starId !== id));
  };

  return (
    <>
      {stars.map((id) => (
        <ShootingStar key={id} onComplete={() => handleComplete(id)} />
      ))}
    </>
  );
}

export default function SpaceBackground() {
  const starsRef = useRef<THREE.Points>(null);
  const distantStarsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const { particleMultiplier } = useMobileOptimization();

  // Main stars - closer, brighter (8000 desktop, 1600 mobile, 4000 tablet)
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = Math.floor(8000 * particleMultiplier);
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Spherical distribution
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white with hints of blue/yellow
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // White stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        // Blue-ish stars
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else {
        // Yellow-ish stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return geometry;
  }, [particleMultiplier]);

  // Distant stars - farther, dimmer, more numerous (12000 desktop, 2400 mobile, 6000 tablet)
  const distantStarsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = Math.floor(12000 * particleMultiplier);
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 150 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return geometry;
  }, [particleMultiplier]);

  // Space dust particles (10000 desktop, 2000 mobile, 5000 tablet)
  const dustGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const dustCount = Math.floor(10000 * particleMultiplier);
    const positions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const radius = 30 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return geometry;
  }, [particleMultiplier]);

  // Enhanced animations for stars and dust
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Parallax rotation
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.002;
      starsRef.current.rotation.x += delta * 0.001;

      // Star twinkle effect
      if (starsRef.current.material instanceof THREE.PointsMaterial) {
        const twinkle = Math.sin(time * 0.5) * 0.1 + 0.9;
        starsRef.current.material.opacity = twinkle;
      }
    }

    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += delta * 0.001;
      distantStarsRef.current.rotation.x += delta * 0.0005;
    }

    // Slow dust drift
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.0005;
      dustRef.current.rotation.x -= delta * 0.0003;
    }
  });

  return (
    <>
      {/* Main stars - enhanced */}
      <points ref={starsRef} geometry={starsGeometry}>
        <pointsMaterial
          size={0.18}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Distant stars */}
      <points ref={distantStarsRef} geometry={distantStarsGeometry}>
        <pointsMaterial
          size={0.08}
          color="#aaaaff"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Space dust */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={0.03}
          color="#6688aa"
          transparent
          opacity={0.15}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Shooting stars easter egg */}
      <ShootingStars />
    </>
  );
}
