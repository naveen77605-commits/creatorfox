"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const palette = { ink: "#150406", scarlet: "#E0202B", scarletHi: "#FF5D64", cobalt: "#2B4FD0", bone: "#F2F3F5" };

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const travel = clamp(progress.current / 0.82);
    position.set(0, 8.5 - travel * 3.5, 19 - travel * 44);
    if (travel > 0.16 && travel < 0.72) {
      const wave = Math.sin((travel - 0.16) * Math.PI * 4) * (1 - Math.abs(travel - 0.44) / 0.28);
      position.x += wave * 2.8;
      position.y += Math.cos((travel - 0.16) * Math.PI * 3) * 0.9;
    }
    target.set(0, 5.5 - travel * 2, position.z - 10);
    camera.position.lerp(position, 0.18);
    camera.lookAt(target);
  });
  return null;
}

function Figure({ progress }: { progress: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 18000;
  const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 6, 5), []);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    let value = 7919;
    const random = () => { value = (value * 16807) % 2147483647; return (value - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      const y = random() * 14;
      const t = y / 14;
      const shoulders = Math.exp(-Math.pow((t - 0.72) / 0.18, 2));
      const hips = Math.exp(-Math.pow((t - 0.27) / 0.19, 2));
      const waist = Math.exp(-Math.pow((t - 0.49) / 0.18, 2));
      const head = Math.exp(-Math.pow((t - 0.91) / 0.08, 2));
      const width = (0.65 + 2.05 * shoulders + 1.55 * hips - 0.9 * waist + 0.55 * head) * (t < 0.17 ? 0.72 : 1);
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * width;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.4;
    }
    return positions;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    const travel = clamp(progress.current / 0.82);
    const visible = smooth(1 - Math.abs(travel - 0.1) / 0.2);
    const dissolve = 1 - smooth((travel - 0.3) / 0.3);
    for (let i = 0; i < count; i++) {
      const x = data[i * 3], y = data[i * 3 + 1], z = data[i * 3 + 2];
      const scale = 0.78 + 0.22 * visible;
      dummy.position.set(x * scale, y * scale + 2, z * scale);
      dummy.rotation.set(Math.sin(travel * Math.PI * 2) * 0.04, travel * 0.15, 0);
      dummy.scale.setScalar((0.45 + 0.2 * visible) * Math.max(0.12, dissolve));
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.visible = visible > 0.01;
  });
  return <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}><meshStandardMaterial color={palette.scarlet} roughness={0.28} metalness={0.12} emissive={palette.scarlet} emissiveIntensity={0.25} /></instancedMesh>;
}

function WireRoom({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const radii = [9, 14, 20];
  const geometries = useMemo(() => radii.map((r) => new THREE.CylinderGeometry(r, r, 58, 72, 1, true)), []);
  useFrame(() => {
    if (!group.current) return;
    const p = progress.current;
    group.current.visible = p > 0.23 && p < 0.92;
    group.current.rotation.z = p * 0.16;
    group.current.children.forEach((child, i) => { child.rotation.y += [0.0008, -0.00045, 0.0002][i]; });
  });
  return <group ref={group} rotation-x={Math.PI / 2}>{geometries.map((geometry, i) => <mesh key={i} geometry={geometry}><meshBasicMaterial color={palette.cobalt} wireframe transparent opacity={0.16} depthWrite={false} /></mesh>)}</group>;
}

function Strands({ progress }: { progress: React.MutableRefObject<number> }) {
  const lines = useRef<THREE.Line[]>([]);
  const points = useMemo(() => Array.from({ length: 6 }, () => Array.from({ length: 28 }, () => new THREE.Vector3())), []);
  useFrame(() => {
    const p = clamp(progress.current / 0.82);
    for (let i = 0; i < 6; i++) {
      const start = 0.08 + i * 0.12;
      const life = clamp((p - start + 0.08) / 0.24);
      const active = smooth(life) * (1 - smooth((life - 0.78) / 0.22));
      const base = new THREE.Vector3(0, 8 - p * 2.4, 18 - p * 42);
      const side = i % 2 === 0 ? -1 : 1;
      const anchor = base.clone().add(new THREE.Vector3(side * (3.2 + i * 0.2), 2.5 - i * 0.9, -13));
      for (let j = 0; j < 28; j++) {
        const t = j / 27;
        points[i][j].copy(base).lerp(anchor, t);
        points[i][j].y += Math.sin(t * Math.PI) * Math.sin(life * Math.PI * 4) * 0.8;
      }
      const line = lines.current[i];
      if (line) {
        line.geometry.setFromPoints(points[i]);
        line.visible = active > 0.01;
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.72 * active;
        material.color.set(life < 0.18 ? palette.scarletHi : palette.bone);
      }
    }
  });
  return <>{Array.from({ length: 6 }, (_, i) => <line key={i} ref={(el) => { if (el) lines.current[i] = el; }}><bufferGeometry /><lineBasicMaterial transparent color={palette.bone} linewidth={2} /></line>)}</>;
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return <><color attach="background" args={[palette.ink]} /><fog attach="fog" args={[palette.ink, 24, 72]} /><ambientLight intensity={0.5} /><pointLight position={[0, 8, 10]} intensity={4} color={palette.scarlet} /><pointLight position={[0, 0, -28]} intensity={3} color={palette.cobalt} /><CameraRig progress={progress} /><Figure progress={progress} /><WireRoom progress={progress} /><Strands progress={progress} /></>;
}

export default function BrandNewDay() {
  const progress = useRef(0);
  useEffect(() => {
    const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.current = max > 0 ? clamp(window.scrollY / max) : 0; };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="brand-film"><div className="brand-film__sticky">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 8.5, 19], fov: 52, near: 0.1, far: 90 }} gl={{ antialias: true, powerPreference: "high-performance" }}><Scene progress={progress} /></Canvas>
    <div className="brand-film__grain" />
    <header className="brand-film__nav"><a href="/" className="brand-film__logo"><img src="/creatorfox-logo.svg" alt="CreatorFox" /></a><nav><a href="/services">Services</a><a href="/work">Work</a><a href="/creators">Creators</a><a href="/contact" className="brand-film__cta">Start a project</a></nav></header>
    <div className="brand-film__hud"><span>CREATORFOX / 2026</span><span>SCROLL TO ENTER</span></div>
    <div className="brand-film__copy brand-film__copy--a"><small>01 / SIGNAL</small><strong>Make the market<br /><em>notice.</em></strong></div>
    <div className="brand-film__copy brand-film__copy--b"><small>02 / DIGITAL</small><strong>Build the<br /><em>signal.</em></strong></div>
    <div className="brand-film__copy brand-film__copy--c"><small>03 / PERFORMANCE</small><strong>Make attention<br /><em>pay.</em></strong></div>
    <div className="brand-film__copy brand-film__copy--d"><small>04 / CREATORS</small><strong>Put influence<br /><em>to work.</em></strong></div>
    <div className="brand-film__copy brand-film__copy--e"><small>05 / AI</small><strong>Build your<br /><em>unfair advantage.</em></strong></div>
    <div className="brand-film__end"><span>CREATORFOX / GROWTH STUDIO</span><strong>Let’s make<br /><em>something move.</em></strong><a href="/contact">Start a project</a></div>
    <div className="brand-film__progress"><span /></div>
  </div></div>;
}
