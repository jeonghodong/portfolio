'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function FloatingBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1.2, 0.4, 16, 32]} />
        <meshStandardMaterial
          color="#000000"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={2.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.12}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingTetrahedron({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.25;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#000000"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingElements() {
  return (
    <group>
      <FloatingBox position={[-3, 2, -2]} />
      <FloatingBox position={[4, -1, -3]} />
      <FloatingBox position={[-5, 0, -5]} />

      <FloatingTorus position={[3, 3, -4]} />
      <FloatingTorus position={[-4, -2, -2]} />

      <FloatingSphere position={[0, 0, -5]} />
      <FloatingSphere position={[-2, -3, -3]} />
      <FloatingSphere position={[2, 1, -4]} />
      <FloatingSphere position={[5, -3, -6]} />

      <FloatingTetrahedron position={[-1, 4, -3]} />
      <FloatingTetrahedron position={[3, -2, -5]} />
    </group>
  );
}
