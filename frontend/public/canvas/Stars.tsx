'use client';
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { JSX } from 'react';
import CanvasLoader from "../../src/components/Loader";

interface StarsProps {
	[key: string]: unknown;
}

function Stars(props: StarsProps): JSX.Element {
	const ref = useRef<THREE.Points>(null!);
	const sphere = new Float32Array(5000 * 3);
	for (let i = 0; i < sphere.length; i++) {
		sphere[i] = (Math.random() - 0.5) * 2.4;
	}

	useFrame((state, delta) => {
		if (ref.current) {
			ref.current.rotation.x -= delta / 10;
			ref.current.rotation.y -= delta / 15;
		}
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points
				ref={ref}
				positions={sphere}
				stride={3}
				frustumCulled
				{...props}
			>
				<PointMaterial
					transparent
					color="#ffffff"
					size={0.002}
					sizeAttenuation={true}
					depthWrite={false}
				/>
			</Points>
		</group>
	);
}

// Custom scene background component with gradient
function GradientBackground() {
	// Create the gradient texture
	const gradientTexture = new THREE.Texture();
	const canvas = document.createElement('canvas');
	canvas.width = 2;
	canvas.height = 512;
	const context = canvas.getContext('2d');

	if (context) {
		// Create a dark-themed gradient using #181826 and similar shades
		const gradient = context.createLinearGradient(0, 0, 0, 512);
		gradient.addColorStop(0, '#181826');    // Main dark color at top
		gradient.addColorStop(0.5, '#23233a');  // Slightly lighter in the middle
		gradient.addColorStop(1, '#23233a');    // Same as middle at bottom

		context.fillStyle = gradient;
		context.fillRect(0, 0, 2, 512);

		gradientTexture.needsUpdate = true;
		gradientTexture.image = canvas;
	}

	gradientTexture.needsUpdate = true;

	return (
		<mesh position={[0, 0, -10]}>
			<planeGeometry args={[50, 50]} />
			<meshBasicMaterial map={gradientTexture} />
		</mesh>
	);
}

function StarsCanvas(): JSX.Element {
	return (
		<div className="w-full h-auto absolute inset-0 z-[-1]">
			<Canvas
				camera={{ position: [0, 0, 1] }}
				dpr={[1, 2]}
				gl={{
					outputColorSpace: THREE.SRGBColorSpace,
					alpha: false
				}}
			>
				<Suspense fallback={<CanvasLoader />}>
					<GradientBackground />
					<Stars />
				</Suspense>
				<Preload all />
			</Canvas>
		</div>
	);
}

export default StarsCanvas;
