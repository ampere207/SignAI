"use client";
import {
  OrbitControls,
  PerspectiveCamera,
  useAnimations,
  useFBX,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import CanvasLoader from "../../src/components/Loader";
import PlayerModel from "./models/PlayerModel";

interface PlayerProps {
  isMobile: boolean;
}

function Player({ isMobile }: PlayerProps) {
  const group = useRef<THREE.Group>(null);

  const { nodes, materials, scene } = useGLTF("/models/player/player.gltf");
  const waveFBX = useFBX("/animations/standing-greeting.fbx");
  
  // Safely extract and rename the animation clip
  const waveAnimation = waveFBX ? waveFBX.animations : [];
  if (waveAnimation && waveAnimation.length > 0) {
    waveAnimation[0].name = "wave-animation";
  }

  // Ensure meshes do not get clipped out of view
  if (scene) {
    scene.frustumCulled = false;
  }

  // Fix PBR metalness issue where skin, face, and clothing render black due to environment map reflections
  useEffect(() => {
    if (materials) {
      Object.keys(materials).forEach((key) => {
        const material = materials[key] as any;
        if (material) {
          // Zero-out metalness so PBR materials do not reflect black empty backgrounds
          material.metalness = 0.0;
          
          // Set skin/body/clothing roughness for soft diffuse rendering under lighting
          if (key.toLowerCase().includes("skin") || key.toLowerCase().includes("head") || key.toLowerCase().includes("body")) {
            material.roughness = 0.85;
          } else {
            material.roughness = 0.7;
          }
          
          // Update material flags
          material.needsUpdate = true;
        }
      });
    }
  }, [materials]);

  const { actions } = useAnimations(waveAnimation, group);

  // Play animation cleanly when loaded
  useEffect(() => {
    if (actions && actions["wave-animation"]) {
      actions["wave-animation"].reset().fadeIn(0.5).play();
    }
    return () => {
      if (actions && actions["wave-animation"]) {
        actions["wave-animation"].fadeOut(0.5);
      }
    };
  }, [actions]);

  return (
    <>
      <ambientLight intensity={2.5} />
      <hemisphereLight intensity={1.8} color="#ffffff" groundColor="#4b42a7" />
      <directionalLight position={[0, 2, 10]} intensity={4.0} />
      <directionalLight position={[5, 5, 2]} intensity={2.0} />
      <directionalLight position={[-5, 5, 2]} intensity={2.0} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 12]}
        fov={30}
        near={0.8}
        far={120}
        zoom={1.4}
      />
      <pointLight intensity={5} position={[3, 3, 3]} color={"#804dee"} decay={0} />
      <pointLight intensity={5} position={[-3, 3, 3]} color={"#4b42a7"} decay={0} />
      <pointLight intensity={5} position={[0, -2, 5]} color={"#804dee"} decay={0} />
      {!isMobile && (
        <OrbitControls
          makeDefault
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
          enablePan={false}
          autoRotate={false}
        />
      )}
      <Suspense fallback={<CanvasLoader />}>
        <PlayerModel
          nodes={nodes as any}
          materials={materials as any}
          rotation={[-1.6, 0, 0]}
          position={isMobile ? [0, -2.7, 0] : [0, -2.1, 0]}
          scale={isMobile ? 3 : 2}
          group={group as any}
        />
      </Suspense>
    </>
  );
}

interface PlayerCanvasProps {
  isMobile: boolean;
}

function PlayerCanvas({ isMobile }: PlayerCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true,
      }}
    >
      <Player isMobile={isMobile} />
    </Canvas>
  );
}

export default PlayerCanvas;
