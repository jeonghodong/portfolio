'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ShipInteriorEnvironment() {
  const starsRef = useRef<THREE.Points>(null);
  const lightsRef = useRef<THREE.Group>(null);

  // Generate stars visible through windows
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Position stars in a sphere behind the ship
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 80 + Math.random() * 40;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 50; // Offset behind
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Animate ambient lights
  useFrame((state) => {
    if (lightsRef.current) {
      const time = state.clock.elapsedTime;
      lightsRef.current.children.forEach((light, i) => {
        if (light instanceof THREE.PointLight) {
          light.intensity = 0.3 + Math.sin(time * 0.5 + i) * 0.1;
        }
      });
    }
  });

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#4488ff" />

      {/* Main directional light */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Floor grid lines */}
      <gridHelper
        args={[30, 30, '#2a2a4e', '#1a1a3e']}
        position={[0, -2.99, 0]}
      />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0a1e"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Back wall with window */}
      <mesh position={[0, 2.5, -12]}>
        <boxGeometry args={[25, 11, 0.5]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.7}
          roughness={0.5}
        />
      </mesh>

      {/* Large window in back wall */}
      <mesh position={[0, 3, -11.5]}>
        <planeGeometry args={[18, 7]} />
        <meshBasicMaterial color="#000011" />
      </mesh>

      {/* Window frame */}
      <mesh position={[0, 3, -11.4]}>
        <ringGeometry args={[8, 9, 6]} />
        <meshStandardMaterial
          color="#334466"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Side walls */}
      <mesh position={[-12, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 11, 0.5]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.7}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[12, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[24, 11, 0.5]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.7}
          roughness={0.5}
        />
      </mesh>

      {/* Side wall windows */}
      {[-12, 12].map((x, idx) => (
        <group key={idx}>
          {[-4, 0, 4].map((z, i) => (
            <mesh
              key={i}
              position={[x * 0.95, 3, z]}
              rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <circleGeometry args={[1.5, 32]} />
              <meshBasicMaterial color="#000022" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ceiling lights group */}
      <group ref={lightsRef}>
        {[[-4, 0], [0, 0], [4, 0], [-4, -4], [4, -4]].map(([x, z], i) => (
          <group key={i} position={[x, 7.5, z]}>
            {/* Light fixture */}
            <mesh>
              <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
              <meshStandardMaterial
                color="#334466"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
            {/* Light source */}
            <pointLight
              color="#88aaff"
              intensity={0.4}
              distance={15}
              decay={2}
            />
            {/* Light glow */}
            <mesh position={[0, -0.15, 0]}>
              <circleGeometry args={[0.25, 16]} />
              <meshBasicMaterial color="#88ccff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Control panels on walls */}
      {[[-11.5, 2, -6], [-11.5, 2, 6], [11.5, 2, -6], [11.5, 2, 6]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          {/* Panel base */}
          <mesh>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial
              color="#0a1628"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.3, 0.06]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshBasicMaterial color="#112244" />
          </mesh>
          {/* Indicator lights */}
          {[-0.4, 0, 0.4].map((offsetX, j) => (
            <mesh key={j} position={[offsetX, -0.5, 0.06]}>
              <circleGeometry args={[0.05, 8]} />
              <meshBasicMaterial color={j === 1 ? '#44ff44' : '#ff4444'} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pipes along ceiling edges */}
      {[
        { pos: [-10, 7, 0], rot: [0, 0, 0] },
        { pos: [10, 7, 0], rot: [0, 0, 0] },
        { pos: [0, 7, -10], rot: [0, Math.PI / 2, 0] },
      ].map(({ pos, rot }, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={rot as [number, number, number]}>
          <cylinderGeometry args={[0.15, 0.15, 18, 8]} />
          <meshStandardMaterial
            color="#334466"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Launch pads - Launch Bay style: Front row (projects) + Back row (exploration) */}
      {/* Front row - Project rockets (larger pads, more prominent) */}
      {[
        { x: -4.5, z: -2, color: '#8a8a8a', size: 1.1 },  // Mercury
        { x: -1.5, z: -2, color: '#ffa502', size: 1.1 },  // Venus
        { x: 1.5, z: -2, color: '#2ed573', size: 1.1 },   // Earth
        { x: 4.5, z: -2, color: '#ff4757', size: 1.1 },   // Mars
      ].map(({ x, z, color, size }, i) => (
        <group key={`front-pad-${i}`} position={[x, -3, z]}>
          {/* Circular platform */}
          <mesh>
            <cylinderGeometry args={[size, size + 0.1, 0.3, 32]} />
            <meshStandardMaterial color="#1a2a4a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing ring */}
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 0.65, size * 0.85, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
          {/* Inner glow */}
          <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[size * 0.5, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Back row - Exploration rockets (smaller pads) */}
      {[
        { x: -6, z: -5, color: '#9a9a9a', size: 0.9 },    // Moon
        { x: -3, z: -5, color: '#d4a06a', size: 1.0 },    // Jupiter
        { x: 0, z: -5, color: '#e8d4a0', size: 1.0 },     // Saturn
        { x: 3, z: -5, color: '#64b5c4', size: 0.9 },     // Uranus
        { x: 6, z: -5, color: '#3464a4', size: 0.9 },     // Neptune
      ].map(({ x, z, color, size }, i) => (
        <group key={`back-pad-${i}`} position={[x, -3, z]}>
          {/* Circular platform */}
          <mesh>
            <cylinderGeometry args={[size, size + 0.1, 0.3, 32]} />
            <meshStandardMaterial color="#1a2a4a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing ring */}
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 0.6, size * 0.8, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
          {/* Inner glow */}
          <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[size * 0.4, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}

      {/* Stars visible through windows */}
      <points ref={starsRef} geometry={starsGeometry}>
        <pointsMaterial
          size={0.5}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1e', 15, 50]} />
    </group>
  );
}
