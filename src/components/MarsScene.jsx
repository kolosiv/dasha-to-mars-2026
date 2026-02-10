import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function Mars({ mouse }) {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.04;

    const targetRotX = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      mouse.current.y * 0.25,
      0.08
    );
    const targetRotY = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      mesh.current.rotation.y + mouse.current.x * 0.25,
      0.08
    );
    mesh.current.rotation.x = targetRotX;
    mesh.current.rotation.y = targetRotY;
  });

  return (
    <group ref={mesh} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshStandardMaterial
          color={new THREE.Color("#C1440E")}
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      <mesh scale={1.12}>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshPhongMaterial
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          emissive={new THREE.Color("#ff7b3a")}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function Lights() {
  const { viewport } = useThree();
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.35}
        color={new THREE.Color("#ffd6aa")}
        castShadow
      />
      <pointLight
        position={[-viewport.width, -viewport.height, -8]}
        intensity={0.6}
        color={new THREE.Color("#4fd1ff")}
      />
    </>
  );
}

export function MarsScene({ orbitPhase }) {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMove={(e) => {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = -(e.clientY / window.innerHeight) * 2 + 1;
          mouse.current.x = x;
          mouse.current.y = y;
        }}
      >
        <color attach="background" args={["#050712"]} />
        <Stars
          radius={120}
          depth={80}
          count={orbitPhase ? 3400 : 2600}
          factor={orbitPhase ? 5 : 3}
          saturation={0}
          fade
          speed={orbitPhase ? 1 : 0.3}
        />
        <Lights />
        <Mars mouse={mouse} />
      </Canvas>
    </div>
  );
}

export default MarsScene;


