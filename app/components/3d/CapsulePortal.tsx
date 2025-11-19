'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Capsule } from '@/app/types';

interface CapsulePortalProps {
  isActive: boolean;
  capsule: Capsule | null;
  onTransitionComplete?: () => void;
}

export default function CapsulePortal({
  isActive,
  capsule,
  onTransitionComplete,
}: CapsulePortalProps) {
  const ringRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const transitionStarted = useRef(false);

  // Spring animation for portal expansion
  const { scale, opacity, rotation } = useSpring({
    scale: isActive ? 15 : 0,
    opacity: isActive ? 1 : 0,
    rotation: isActive ? Math.PI * 4 : 0,
    config: { mass: 1, tension: 120, friction: 20 },
    onRest: () => {
      if (isActive && !transitionStarted.current) {
        transitionStarted.current = true;
        setTimeout(() => {
          onTransitionComplete?.();
          transitionStarted.current = false;
        }, 200);
      }
    },
  });

  // Reset transition flag when deactivated
  useEffect(() => {
    if (!isActive) {
      transitionStarted.current = false;
    }
  }, [isActive]);

  // Generate portal particles
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spiral pattern
      const angle = (i / particleCount) * Math.PI * 8;
      const radius = (i / particleCount) * 5;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (i / particleCount - 0.5) * 3;

      // Color gradient
      const color = new THREE.Color().setHSL(
        0.6 + (i / particleCount) * 0.2,
        0.8,
        0.6
      );
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // Animate portal rings and particles
  useFrame((state) => {
    if (ringRef.current && isActive) {
      const time = state.clock.elapsedTime;

      ringRef.current.children.forEach((ring, i) => {
        if (ring instanceof THREE.Mesh) {
          ring.rotation.z = time * (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.1);
        }
      });
    }

    if (particlesRef.current && isActive) {
      particlesRef.current.rotation.z += 0.02;
    }
  });

  if (!capsule) return null;

  const portalColor = capsule.glowColor;

  return (
    <animated.group
      position={capsule.position}
      scale={scale.to((s) => [s, s, s])}
    >
      {/* Portal rings */}
      <animated.group ref={ringRef} rotation-z={rotation}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <ringGeometry args={[0.8 - i * 0.15, 1 - i * 0.15, 32]} />
            <animated.meshBasicMaterial
              color={portalColor}
              transparent
              opacity={opacity.to((o) => o * (1 - i * 0.2))}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </animated.group>

      {/* Central glow */}
      <mesh>
        <circleGeometry args={[0.5, 32]} />
        <animated.meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity.to((o) => o * 0.8)}
        />
      </mesh>

      {/* Spiral particles */}
      <animated.points
        ref={particlesRef}
        geometry={particlesGeometry}
        rotation-z={rotation}
      >
        <animated.pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </animated.points>

      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[0.9, 1.2, 64]} />
        <animated.meshBasicMaterial
          color={portalColor}
          transparent
          opacity={opacity.to((o) => o * 0.5)}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Light rays */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i * Math.PI) / 3]}
          position={[0, 0, -0.1]}
        >
          <planeGeometry args={[0.05, 1.5]} />
          <animated.meshBasicMaterial
            color={portalColor}
            transparent
            opacity={opacity.to((o) => o * 0.3)}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </animated.group>
  );
}
