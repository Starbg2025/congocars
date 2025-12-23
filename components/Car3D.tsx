
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Bypassing TS intrinsic element checks for @react-three/fiber host elements by using capitalized variables
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const SphereGeometry = 'sphereGeometry' as any;

const FloatingCarModel = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <Group ref={meshRef}>
      {/* Abstract Representation of a Car for 3D visual interest */}
      <Mesh position={[0, 0.5, 0]}>
        <BoxGeometry args={[4, 1, 2]} />
        <MeshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </Mesh>
      <Mesh position={[1, 1.2, 0]}>
        <BoxGeometry args={[2, 0.5, 1.8]} />
        <MeshStandardMaterial color="#111" metalness={1} roughness={0} />
      </Mesh>
      {/* Wheels */}
      {[-1.5, 1.5].map((x) => 
        [-0.9, 0.9].map((z) => (
          <Mesh key={`${x}-${z}`} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
            <CylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <MeshStandardMaterial color="#050505" />
          </Mesh>
        ))
      )}
      {/* Lights */}
      <Mesh position={[2, 0.7, 0.7]}>
        <SphereGeometry args={[0.1, 16, 16]} />
        <MeshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </Mesh>
      <Mesh position={[2, 0.7, -0.7]}>
        <SphereGeometry args={[0.1, 16, 16]} />
        <MeshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </Mesh>
    </Group>
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
