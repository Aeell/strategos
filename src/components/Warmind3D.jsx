import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, Sparkles, Float, Stars, Sphere, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import * as THREE from 'three';

const CameraRig = ({ state }) => {
  useFrame((stateThree) => {
    const t = stateThree.clock.getElapsedTime();
    const shake = state === 'siva' ? 0.2 : state === 'processing' ? 0.05 : 0;
    stateThree.camera.position.x = THREE.MathUtils.lerp(stateThree.camera.position.x, Math.sin(t) * shake, 0.1);
    stateThree.camera.position.y = THREE.MathUtils.lerp(stateThree.camera.position.y, Math.cos(t * 1.5) * shake, 0.1);
  });
  return null;
};

const CoreGeometry = ({ state }) => {
  const outerRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((ctx) => {
    const t = ctx.clock.getElapsedTime();
    const speed = state === 'siva' ? 6 : state === 'processing' ? 2 : 0.5;

    if(outerRef.current) { outerRef.current.rotation.y = t * 0.1 * speed; outerRef.current.rotation.z = Math.sin(t * 0.2) * 0.1; }
    if(innerRef.current) { innerRef.current.rotation.x = -t * 0.2 * speed; innerRef.current.rotation.y = t * 0.3 * speed; }
    if(ring1Ref.current) { ring1Ref.current.rotation.x = t * 0.2 * speed; ring1Ref.current.rotation.y = t * 0.1; }
    if(ring2Ref.current) { ring2Ref.current.rotation.x = -t * 0.1 * speed; ring2Ref.current.rotation.z = t * 0.2; }
  });

  const isSiva = state === 'siva';

  return (
    <group scale={1.6}>
      <Float speed={isSiva ? 10 : 2} rotationIntensity={isSiva ? 1 : 0.2} floatIntensity={0.5}>
        <Sphere args={[0.7, 32, 32]} ref={innerRef}>
           <meshStandardMaterial color={isSiva ? "#ffffff" : "#aa0000"} emissive={isSiva ? "#ff0000" : "#550000"} emissiveIntensity={isSiva ? 4 : 1.5} wireframe={true} />
        </Sphere>
        <Icosahedron args={[1.4, 0]} ref={outerRef}>
          <meshStandardMaterial color="#000000" wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
        </Icosahedron>
        <Torus args={[2.2, 0.03, 16, 100]} ref={ring1Ref} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} wireframe />
        </Torus>
        <Torus args={[2.8, 0.02, 16, 100]} ref={ring2Ref} rotation={[0, Math.PI/4, 0]}>
            <meshBasicMaterial color="#ff3333" transparent opacity={0.3} />
        </Torus>
      </Float>
      <Sparkles count={isSiva ? 1500 : 300} scale={10} size={isSiva ? 4 : 2} speed={isSiva ? 3 : 0.4} opacity={isSiva ? 0.8 : 0.4} color={isSiva ? "#ff0000" : "#ff5555"} noise={isSiva ? 1 : 0} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// We wrap this component to prevent re-renders of the logic from killing the canvas
export const Warmind3D = React.memo(({ state }) => {
  return (
    <>
      <color attach="background" args={['#050101']} />
      <CameraRig state={state} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff0000" />
      <CoreGeometry state={state} />
      <group position={[0, -3, 0]} rotation={[Math.PI/20, 0, 0]}>
         <Grid infiniteGrid cellSize={0.5} sectionSize={3} fadeDistance={20} sectionColor="#ff0000" cellColor="#440000" />
      </group>
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} intensity={state === 'siva' ? 3 : 1.5} />
        <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration offset={[0.003, 0.003]} />
        <Glitch active={state !== 'idle'} delay={[0, 1.5]} duration={[0.1, 0.4]} strength={state === 'siva' ? 0.6 : 0.2} mode={GlitchMode.SPORADIC} />
      </EffectComposer>
    </>
  );
});