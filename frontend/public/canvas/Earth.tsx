'use client';
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../../src/components/Loader";
import EarthModel from "./models/EarthModel";

interface EarthProps {
  isMobile: boolean;
}

function Earth({ isMobile }: EarthProps) {
  const { nodes, materials } = useGLTF("/models/planet/scene.gltf");
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {!isMobile && (
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
          enablePan={false}
          enableRotate={true}
          makeDefault
        />
      )}
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.7} groundColor="black" />
      <pointLight intensity={2} position={[1, 1, 0]} color="#f6f3ea" />
      <Suspense fallback={<CanvasLoader />}>
        <EarthModel
          materials={materials}
          nodes={nodes}
          scale={2.2}
          position={[0, 0, 0]}
          earthRef={earthRef}
        />
      </Suspense>
    </>
  );
}

interface EarthCanvasProps {
  isMobile: boolean;
}

function EarthCanvas({ isMobile }: EarthCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true,
      }}
      className="cursor-pointer"
    >
      <Earth isMobile={isMobile} />
      <Preload all />
    </Canvas>
  );
}

export default EarthCanvas;
