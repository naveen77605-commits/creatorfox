"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

const clamp01 = (v:number) => Math.max(0, Math.min(1, v));
const smooth = (v:number) => v * v * (3 - 2 * v);
const lerp = (a:number,b:number,t:number) => a + (b-a)*t;
const spine = (sp:number) => new THREE.Vector3(0, 9 - sp * 2.4, 18 - sp * 42);

const palette = {
  ink950: "#150406",
  ink900: "#1e070a",
  ink800: "#2c0e13",
  ink700: "#431a20",
  bone: "#f2f3f5",
  boneMuted: "#9a8a8d",
  scarlet: "#e0202b",
  scarletHi: "#ff5d64",
  cobalt: "#2b4fd0",
};

const strands = [
  { at: .08, span: .13, side: -1, lead: 12.5, radius: 3.3, lift: 2.4 },
  { at: .21, span: .12, side: 1, lead: 13.5, radius: 3.55, lift: 1.1 },
  { at: .34, span: .105, side: -1, lead: 14.3, radius: 3.75, lift: -0.2 },
  { at: .46, span: .095, side: 1, lead: 14.8, radius: 3.9, lift: -1.0 },
  { at: .57, span: .085, side: -1, lead: 15.2, radius: 4.0, lift: -1.8 },
  { at: .67, span: .075, side: 1, lead: 15.4, radius: 4.1, lift: -2.4 },
];

function ScrollCamera({ progress }:{progress:React.MutableRefObject<number>}) {
  const { camera } = useThree();
  const up = useMemo(() => new THREE.Vector3(0,1,0), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const p = progress.current;
    const sp = clamp01(p / .82);
    const base = spine(sp);
    const u = sp;
    const corridor = u > .18 && u < .72;
    let swingX = 0, swingY = 0, bank = 0;
    if (corridor) {
      for (const s of strands) {
        const life = clamp01((u - (s.at - .08)) / (.82 * s.span + .16));
        const env = life < .08 ? 0 : life > .82 ? 0 : Math.sin(((life-.08)/.74)*Math.PI);
        swingX += s.side * 3.2 * Math.sin(Math.PI * clamp01((life-.08)/.74)) * env;
        swingY -= 1.5 * Math.sin(Math.PI * clamp01((life-.08)/.74)) * env;
        bank += s.side * .15 * Math.sin(Math.PI * clamp01((life-.08)/.74)) * env;
      }
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { swingX = 0; swingY = 0; bank = 0; }
    pos.copy(base).add(new THREE.Vector3(swingX, swingY, 0));
    target.copy(base).add(new THREE.Vector3(0, 0, -10));
    camera.position.copy(pos);
    camera.lookAt(target);
    up.set(0,1,0);
    const view = new THREE.Vector3().subVectors(target, pos).normalize();
    up.applyAxisAngle(view, bank);
    camera.up.copy(up);
    camera.rotation.order = "YXZ";
    camera.far = lerp(90, 44, clamp01((p-.76)/.24));
    camera.updateProjectionMatrix();
  });
  return null;
}

function Figure({ progress }:{progress:React.MutableRefObject<number>}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 40000;
  const geometry = useMemo(() => new THREE.SphereGeometry(.5, 8, 6), []);
  const { positions, colors } = useMemo(() => {
    const ps = new Float32Array(count * 3);
    const cs = new Float32Array(count * 3);
    const c1 = new THREE.Color(palette.scarlet);
    const c2 = new THREE.Color(palette.cobalt);
    let seed = 17;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed-1)/2147483646; };
    for (let i=0;i<count;i++) {
      const y = rnd() * 14;
      const t = y / 14;
      const shoulder = Math.exp(-Math.pow((t-.70)/.18,2));
      const waist = Math.exp(-Math.pow((t-.48)/.18,2));
      const hip = Math.exp(-Math.pow((t-.28)/.18,2));
      const head = Math.exp(-Math.pow((t-.90)/.075,2));
      let width = .75 + 2.0*shoulder + 1.55*hip - 1.0*waist + .55*head;
      if (t < .17) width *= .75;
      const angle = rnd()*Math.PI*2;
      const radial = Math.sqrt(rnd()) * width;
      const x = Math.cos(angle)*radial;
      const z = Math.sin(angle)*radial*.42;
      ps[i*3] = x;
      ps[i*3+1] = y;
      ps[i*3+2] = z;
      const c = c1.clone().lerp(c2, rnd() > .5 ? .18 : .03);
      const light = .62 + rnd()*.38;
      c.multiplyScalar(light);
      cs[i*3]=c.r; cs[i*3+1]=c.g; cs[i*3+2]=c.b;
    }
    return {positions:ps, colors:cs};
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  useEffect(() => {
    if (!mesh.current) return;
    for (let i=0;i<count;i++) {
      mesh.current.setColorAt(i, color.setRGB(colors[i*3], colors[i*3+1], colors[i*3+2]));
    }
    mesh.current.instanceColor!.needsUpdate = true;
  }, [colors, color]);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    const p = progress.current;
    const sp = clamp01(p/.82);
    const inFigure = smooth(1-clamp01(Math.abs(sp-.10)/.18));
    const handoff = smooth(clamp01((sp-.08)/.20)) * (1-smooth(clamp01((sp-.44)/.18)));
    const scale = lerp(.82, 1.0, inFigure) * (1 - .82 * smooth(clamp01((sp-.32)/.28)));
    const tilt = Math.sin(sp*Math.PI*2)*.06;
    const bob = Math.sin(sp*Math.PI*4 + dt*.02)*.08;
    for (let i=0;i<count;i++) {
      const x=positions[i*3], y=positions[i*3+1], z=positions[i*3+2];
      dummy.position.set(x*scale, y*scale + bob, z*scale);
      dummy.rotation.set(tilt, Math.sin(sp*Math.PI)*.12, -tilt*.4);
      dummy.scale.setScalar(.58 + .18*handoff);
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.visible = inFigure > .01;
    mesh.current.material.opacity = .78 * inFigure;
  });
  return <instancedMesh ref={mesh} args={[geometry, undefined, count]} position={[0,2,0]} frustumCulled={false}><meshStandardMaterial vertexColors transparent opacity={.8} roughness={.25} metalness={.15} emissive={palette.scarlet} emissiveIntensity={.22} toneMapped={false}/></instancedMesh>;
}

function Lattice({ progress }:{progress:React.MutableRefObject<number>}) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr:number[]=[];
    const r=5.4,h=17;
    for(let i=0;i<28;i++){
      const a=i/28*Math.PI*2;
      const x=Math.cos(a)*r,z=Math.sin(a)*r;
      arr.push(x,-h/2,z,x,h/2,z);
    }
    for(let j=0;j<8;j++){
      const y=-h/2+j/(7)*h;
      for(let i=0;i<28;i++){
        const a=i/28*Math.PI*2, b=(i+1)/28*Math.PI*2;
        arr.push(Math.cos(a)*r,y,Math.sin(a)*r,Math.cos(b)*r,y,Math.sin(b)*r);
      }
    }
    g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));
    return g;
  },[]);
  useFrame(()=>{
    const sp=clamp01(progress.current/.82);
    const v=smooth(1-clamp01(Math.abs(sp-.14)/.25));
    if(ref.current){ref.current.scale.setScalar(.75+.25*v);ref.current.visible=v>.01; (ref.current.material as THREE.LineBasicMaterial).opacity=.22*v;}
  });
  return <lineSegments ref={ref} geometry={geo}><lineBasicMaterial color={palette.scarletHi} transparent opacity={.2} depthWrite={false}/></lineSegments>;
}

function Room({ progress }:{progress:React.MutableRefObject<number>}) {
  const groups = useRef<THREE.Group>(null);
  const radii=[9,13.95,19.8];
  const geos=useMemo(()=>radii.map(r=>new THREE.CylinderGeometry(r,r,60,96,1,true)),[]);
  useFrame(()=>{
    const sp=clamp01(progress.current/.82);
    const live=smooth(clamp01((sp-.28)/.22))*(1-smooth(clamp01((sp-.83)/.17)));
    if(groups.current){groups.current.visible=live>.01;groups.current.rotation.z=sp*.12;groups.current.children.forEach((c,i)=>{c.rotation.y+= [0.055,-0.03,0.014][i]*.02; const m=c as THREE.Mesh; (m.material as THREE.MeshBasicMaterial).opacity=.22*live;});}
  });
  return <group ref={groups} rotation-x={Math.PI/2}>{geos.map((g,i)=><mesh key={i} geometry={g}><meshBasicMaterial color={palette.cobalt} wireframe transparent opacity={.18} depthWrite={false}/></mesh>)}</group>;
}

function Strands({ progress }:{progress:React.MutableRefObject<number>}) {
  const refs = useRef<THREE.Line[]>([]);
  const points = useMemo(()=>strands.map(()=>Array.from({length:30},()=>new THREE.Vector3())),[]);
  useFrame(()=>{
    const sp=clamp01(progress.current/.82);
    strands.forEach((s,si)=>{
      const start=s.at-.08, end=s.at+s.span+.22;
      const life=clamp01((sp-start)/(end-start));
      const fire=smooth(clamp01(life/.12));
      const release=smooth(clamp01((life-.55)/.25));
      const fade=1-smooth(clamp01((life-.8)/.2));
      const live=fire*fade;
      const base=spine(sp);
      const anchor=base.clone().add(new THREE.Vector3(s.side*s.radius,s.lift,-s.lead));
      for(let j=0;j<30;j++){
        const t=j/29;
        const sag=release*.9*Math.sin(Math.PI*t)*Math.sin(Math.PI*life*2+t*3);
        points[si][j].copy(base).lerp(anchor,t);
        points[si][j].y += sag;
      }
      const line=refs.current[si];
      if(line){line.geometry.setFromPoints(points[si]);line.visible=live>.01;(line.material as THREE.LineBasicMaterial).opacity=.8*live; (line.material as THREE.LineBasicMaterial).color.set(life<.16?palette.scarletHi:palette.bone);}
    });
  });
  return <>{strands.map((_,i)=><line key={i} ref={el=>{if(el)refs.current[i]=el}}><bufferGeometry/><lineBasicMaterial transparent linewidth={3} color={palette.bone} toneMapped={false}/></line>)}</>;
}

function FilmScene({ progress }:{progress:React.MutableRefObject<number>}) {
  return <>
    <color attach="background" args={[palette.ink950]}/>
    <fog attach="fog" args={[palette.ink950, 22, 70]}/>
    <ambientLight intensity={.55}/><pointLight position={[0,8,8]} intensity={4} color={palette.scarlet}/><pointLight position={[0,0,-25]} intensity={3} color={palette.cobalt}/>
    <ScrollCamera progress={progress}/><Figure progress={progress}/><Lattice progress={progress}/><Room progress={progress}/><Strands progress={progress}/>
    <EffectComposer multisampling={0}><Bloom intensity={.55} luminanceThreshold={1.15} luminanceSmoothing={.35} mipmapBlur/><Vignette darkness={1} offset={1.3}/></EffectComposer>
  </>;
}

export default function BrandNewDay(){
  const progress=useRef(0);
  useEffect(()=>{
    const onScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight; progress.current=max>0?clamp01(window.scrollY/max):0;};
    onScroll(); window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',onScroll); return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
  },[]);
  return <div className="brand-film">
    <div className="brand-film__sticky"><Canvas dpr={[1,1.5]} camera={{position:[0,9,18],fov:52,near:.1,far:90}} gl={{antialias:true,powerPreference:'high-performance'}}><FilmScene progress={progress}/></Canvas>
      <div className="brand-film__grain"/>
      <header className="brand-film__nav"><a href="/" className="brand-film__logo"><img src="/creatorfox-logo.svg" alt="CreatorFox"/></a><nav><a href="/services">Services</a><a href="/work">Work</a><a href="/creators">Creators</a><a href="/contact" className="brand-film__cta">Start a project</a></nav></header>
      <div className="brand-film__hud"><span>CREATORFOX / 2026</span><span>SCROLL TO ENTER</span></div>
      <div className="brand-film__copy brand-film__copy--a"><small>01 / SIGNAL</small><strong>Make the market<br/><em>notice.</em></strong></div>
      <div className="brand-film__copy brand-film__copy--b"><small>02 / DIGITAL</small><strong>Build the<br/><em>signal.</em></strong></div>
      <div className="brand-film__copy brand-film__copy--c"><small>03 / PERFORMANCE</small><strong>Make attention<br/><em>pay.</em></strong></div>
      <div className="brand-film__copy brand-film__copy--d"><small>04 / CREATORS</small><strong>Put influence<br/><em>to work.</em></strong></div>
      <div className="brand-film__copy brand-film__copy--e"><small>05 / AI</small><strong>Build your<br/><em>unfair advantage.</em></strong></div>
      <div className="brand-film__end"><span>06 / CREATORFOX</span><strong>Ready when<br/>you are.</strong><a href="/contact">Start a project ↗</a></div>
      <div className="brand-film__progress"><span/></div>
    </div>
  </div>;
}
