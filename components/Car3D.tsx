
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Bypassing TS intrinsic element checks for @react-three/fiber host elements
const group = 'group' as any;
const mesh = 'mesh' as any;
const boxGeometry = 'boxGeometry' as any;
const meshStandardMaterial = 'meshStandardMaterial' as any;
const cylinderGeometry = 'cylinderGeometry' as any;
const sphereGeometry = 'sphereGeometry' as any;

const FloatingCarModel = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Abstract Representation of a Car for 3D visual interest */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1, 1.2, 0]}>
        <boxGeometry args={[2, 0.5, 1.8]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0} />
      </mesh>
      {/* Wheels */}
      {[-1.5, 1.5].map((x) => 
        [-0.9, 0.9].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
        ))
      )}
      {/* Lights */}
      <mesh position={[2, 0.7, 0.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2, 0.7, -0.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const Car3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.5, blur: 2 }}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <FloatingCarModel />
          </Float>
        </Stage>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
};

export default Car3D;
