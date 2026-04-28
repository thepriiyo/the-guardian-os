'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars, PerspectiveCamera, MeshWobbleMaterial } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function GuardianCore({ scroll }: { scroll: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [distort, setDistort] = useState(0.4);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(time / 4) / 2 + (scroll * 10);
    meshRef.current.rotation.y = Math.sin(time / 2) / 2 + (scroll * 15);
    
    // Dynamic position based on scroll - more dramatic
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, scroll * 15, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, scroll * -5, 0.05);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, scroll * -25, 0.05);
    
    // Distort increases as we 'dive' deeper
    setDistort(0.4 + (scroll * 1.2));
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 256, 256]} scale={2}>
        <MeshDistortMaterial
          color="#3b82f6"
          speed={4}
          distort={distort}
          radius={1}
          metalness={1}
          roughness={0}
          emissive="#2563eb"
          emissiveIntensity={0.8 + (scroll * 4)}
        />
      </Sphere>
    </Float>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[100, 50, '#1e3a8a', '#0f172a']} 
      position={[0, -5, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
}

function Particles({ scroll }: { scroll: number }) {
  const points = useRef<THREE.Points>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.02 + (scroll * 5);
    points.current.position.y = scroll * -20;
    points.current.position.z = scroll * 50;
  });

  return (
    <Stars 
      ref={points}
      radius={100} 
      depth={50} 
      count={7000} 
      factor={6} 
      saturation={0} 
      fade 
      speed={2} 
    />
  );
}

export default function Scene() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScroll(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10 - (scroll * 8)]} fov={75} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#60a5fa" />
        <spotLight position={[-20, 20, 40]} angle={0.2} penumbra={1} intensity={5} color="#3b82f6" />
        <GuardianCore scroll={scroll} />
        <Particles scroll={scroll} />
        <Grid />
        <fog attach="fog" args={['#020617', 5, 25]} />
      </Canvas>
      
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
