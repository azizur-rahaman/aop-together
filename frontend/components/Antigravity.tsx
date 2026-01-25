'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 280,
  magnetRadius = 8,
  ringRadius = 8,
  waveSpeed = 0.35,
  waveAmplitude = 0.6,
  particleSize = 1,
  lerpSpeed = 0.08,
  color = 'rgba(99, 102, 241, 0.6)', // indigo-500 (soft)
  autoAnimate = true,
  particleVariance = 0.6,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 2,
  particleShape = 'capsule',
  fieldStrength = 12
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp: any[] = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      temp.push({
        t: Math.random() * 100,
        speed: 0.01 + Math.random() / 300,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset: (Math.random() - 0.5) * 2
      });
    }

    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v, pointer: m } = state;

    const mouseDist = Math.hypot(
      m.x - lastMousePos.current.x,
      m.y - lastMousePos.current.y
    );

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const t = state.clock.getElapsedTime();
      destX = Math.sin(t * 0.5) * (v.width / 4);
      destY = Math.cos(t) * (v.height / 4);
    }

    virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    particles.forEach((p, i) => {
      p.t += p.speed;

      const dx = p.mx - targetX;
      const dy = p.my - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = p.mx;
      let ty = p.my;
      let tz = p.mz * depthFactor;

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx);
        const wave = Math.sin(p.t * waveSpeed + angle) * waveAmplitude;
        const radius = ringRadius + wave + p.randomRadiusOffset;

        tx = targetX + radius * Math.cos(angle);
        ty = targetY + radius * Math.sin(angle);
        tz += Math.sin(p.t) * waveAmplitude;
      }

      p.cx += (tx - p.cx) * lerpSpeed;
      p.cy += (ty - p.cy) * lerpSpeed;
      p.cz += (tz - p.cz) * lerpSpeed;

      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.lookAt(targetX, targetY, p.cz);
      dummy.rotateX(Math.PI / 2);

      const scale =
        (0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance) *
        particleSize;

      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = props => {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 50], fov: 35 }}
    >
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
