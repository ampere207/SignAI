import React from 'react';
import * as THREE from 'three';

// Define more specific interfaces for the Three.js objects
interface ModelNodes {
	Hips: THREE.Object3D;
	Wolf3D_Body: THREE.SkinnedMesh;
	Wolf3D_Outfit_Bottom: THREE.SkinnedMesh;
	Wolf3D_Outfit_Footwear: THREE.SkinnedMesh;
	Wolf3D_Outfit_Top: THREE.SkinnedMesh;
	Wolf3D_Hair: THREE.SkinnedMesh;
	EyeLeft: THREE.SkinnedMesh & {
		morphTargetDictionary: Record<string, number>;
		morphTargetInfluences: number[];
	};
	EyeRight: THREE.SkinnedMesh & {
		morphTargetDictionary: Record<string, number>;
		morphTargetInfluences: number[];
	};
	Wolf3D_Head: THREE.SkinnedMesh & {
		morphTargetDictionary: Record<string, number>;
		morphTargetInfluences: number[];
	};
	Wolf3D_Teeth: THREE.SkinnedMesh & {
		morphTargetDictionary: Record<string, number>;
		morphTargetInfluences: number[];
	};
}

interface ModelMaterials {
	Wolf3D_Body: THREE.Material;
	Wolf3D_Outfit_Bottom: THREE.Material;
	Wolf3D_Outfit_Footwear: THREE.Material;
	Wolf3D_Outfit_Top: THREE.Material;
	Wolf3D_Hair: THREE.Material;
	Wolf3D_Eye: THREE.Material;
	Wolf3D_Skin: THREE.Material;
	Wolf3D_Teeth: THREE.Material;
}

// Define TypeScript interfaces for the props
interface PlayerModelProps {
	nodes: ModelNodes;
	materials: ModelMaterials;
	scale: number | [number, number, number];
	position: [number, number, number];
	rotation: [number, number, number];
	group: React.RefObject<THREE.Group>;
}

function PlayerModel({ nodes, materials, scale, position, rotation, group }: PlayerModelProps) {
	return (
		<group
			dispose={null}
			scale={scale}
			position={position}
			ref={group}
			rotation={rotation}
		>
			<group>
				<primitive object={nodes.Hips} />
				<skinnedMesh
					frustumCulled={false}
					geometry={nodes.Wolf3D_Body.geometry}
					material={materials.Wolf3D_Body}
					skeleton={nodes.Wolf3D_Body.skeleton}
				/>
				<skinnedMesh
					frustumCulled={false}
					geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
					material={materials.Wolf3D_Outfit_Bottom}
					skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
				/>
				<skinnedMesh
					frustumCulled={false}
					geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
					material={materials.Wolf3D_Outfit_Footwear}
					skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
				/>
				<skinnedMesh
					frustumCulled={false}
					geometry={nodes.Wolf3D_Outfit_Top.geometry}
					material={materials.Wolf3D_Outfit_Top}
					skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
				/>
				<skinnedMesh
					frustumCulled={false}
					geometry={nodes.Wolf3D_Hair.geometry}
					material={materials.Wolf3D_Hair}
					skeleton={nodes.Wolf3D_Hair.skeleton}
				/>
				<skinnedMesh
					frustumCulled={false}
					name="EyeLeft"
					geometry={nodes.EyeLeft.geometry}
					material={materials.Wolf3D_Eye}
					skeleton={nodes.EyeLeft.skeleton}
					morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
					morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
				/>
				<skinnedMesh
					frustumCulled={false}
					name="EyeRight"
					geometry={nodes.EyeRight.geometry}
					material={materials.Wolf3D_Eye}
					skeleton={nodes.EyeRight.skeleton}
					morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
					morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
				/>
				<skinnedMesh
					frustumCulled={false}
					name="Wolf3D_Head"
					geometry={nodes.Wolf3D_Head.geometry}
					material={materials.Wolf3D_Skin}
					skeleton={nodes.Wolf3D_Head.skeleton}
					morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
					morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
				/>
				<skinnedMesh
					frustumCulled={false}
					name="Wolf3D_Teeth"
					geometry={nodes.Wolf3D_Teeth.geometry}
					material={materials.Wolf3D_Teeth}
					skeleton={nodes.Wolf3D_Teeth.skeleton}
					morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
					morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
				/>
			</group>
		</group>
	);
}

export default PlayerModel;
