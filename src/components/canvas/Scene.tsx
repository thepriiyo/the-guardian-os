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
    meshRef.current.rotation.x = Math.cos(time / 4) / 2 + (scroll * 2);
    meshRef.current.rotation.y = Math.sin(time / 2) / 2 + (scroll * 5);
    
    // Dynamic position based on scroll
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, scroll * 5, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, scroll * -10, 0.1);
    
    // Distort increases as we 'dive' deeper
    setDistort(0.4 + (scroll * 0.6));
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={2}>
        <MeshDistortMaterial
          color="#3b82f6"
          speed={2}
          distort={distort}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive="#1e40af"
          emissiveIntensity={0.5 + (scroll * 2)}
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
    points.current.rotation.y = time * 0.05 + (scroll * 2);
    points.current.position.z = scroll * 20;
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
        <PerspectiveCamera makeDefault position={[0, 0, 8 - (scroll * 4)]} fov={75} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
        <spotLight position={[-10, 10, 20]} angle={0.15} penumbra={1} intensity={3} color="#3b82f6" />
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
