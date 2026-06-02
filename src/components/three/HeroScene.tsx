'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, PerspectiveCamera, Environment, ContactShadows, Float as DreiFloat } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

function AntiqueVase() {
  const meshRef = useRef<THREE.Group>(null)
  
  // Custom Vase Profile: High-Detail Architectural Curvature
  const points = useMemo(() => {
    const pts = []
    // Tiered Architectural Base
    pts.push(new THREE.Vector2(0, 0))
    pts.push(new THREE.Vector2(1.5, 0))
    pts.push(new THREE.Vector2(1.4, 0.4))
    pts.push(new THREE.Vector2(1.1, 0.5))
    pts.push(new THREE.Vector2(1.2, 0.8))
    
    // Lower Bulbous Body
    pts.push(new THREE.Vector2(0.8, 1.5))
    pts.push(new THREE.Vector2(3.0, 4.0))
    pts.push(new THREE.Vector2(3.4, 5.5))
    
    // Middle Architectural Band
    pts.push(new THREE.Vector2(2.5, 7.0))
    pts.push(new THREE.Vector2(1.6, 8.5))
    
    // Fluted Neck
    pts.push(new THREE.Vector2(1.3, 9.5))
    pts.push(new THREE.Vector2(1.2, 10.8))
    
    // Ornate Flared Rim
    pts.push(new THREE.Vector2(1.4, 11.4))
    pts.push(new THREE.Vector2(2.4, 12.0))
    pts.push(new THREE.Vector2(2.6, 12.2))
    return pts
  }, [])

  // Dual Ornate Scrolled Handles (Classical Architecture style)
  const handlePoints = [
    new THREE.Vector3(1.2, 10.5, 0),    // Neck top
    new THREE.Vector3(4.5, 9.5, 0),     // Outer scroll top
    new THREE.Vector3(5.0, 7.0, 0),     // Outer mid
    new THREE.Vector3(3.2, 5.0, 0),     // Body bottom
  ]
  const handleCurve = useMemo(() => new THREE.CatmullRomCurve3(handlePoints), [])

  // Premium Brand Integrated Color Palette
  const colors = {
    teal: "#042c23",        // Deep imperial jade teal
    gold: "#dfb743",        // Rich Venetian Gold
    brightGold: "#ffd700",  // Brilliant high-light gold
    darkGold: "#a87e22"     // Antique gold bronze
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      // Subtle emissive pulse logic
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2
      // We'll update materiality refs if needed, or stick to simple uniforms
    }
  })

  // Architectural Motif: Column/Dentil patterns with Golden Glow
  const ColumnMotif = ({ radius, y, count, height = 0.5 }: { radius: number, y: number, count: number, height?: number }) => (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, height/2, Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.15, height, 0.08]} />
            <meshPhysicalMaterial 
              color={colors.brightGold} 
              metalness={1} 
              roughness={0.1} 
              clearcoat={1}
              emissive={colors.gold}
              emissiveIntensity={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )

  const BeadRing = ({ radius, y, count, beadSize = 0.08 }: { radius: number, y: number, count: number, beadSize?: number }) => (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[beadSize, 16, 16]} />
            <meshPhysicalMaterial 
              color={colors.brightGold} 
              metalness={1} 
              roughness={0.05} 
              clearcoat={1} 
              emissive={colors.brightGold} 
              emissiveIntensity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )

  // Custom-fitted Wireframe Lathe Cage that wraps around the bulbous body perfectly
  const GoldenCage = () => {
    const cagePoints = useMemo(() => {
      const pts = []
      // Select the bulbous body profile and scale outward slightly (1.02x) to prevent clipping
      pts.push(new THREE.Vector2(0.82 * 1.025, 1.5))
      pts.push(new THREE.Vector2(3.0 * 1.025, 4.0))
      pts.push(new THREE.Vector2(3.4 * 1.025, 5.5))
      pts.push(new THREE.Vector2(2.5 * 1.025, 7.0))
      return pts
    }, [])

    return (
      <mesh castShadow receiveShadow>
        <latheGeometry args={[cagePoints, 64]} />
        <meshPhysicalMaterial 
          color={colors.brightGold} 
          metalness={1} 
          roughness={0.1} 
          wireframe={true}
          transparent={true}
          opacity={0.7}
          emissive={colors.gold}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  }

  const FloatingGoldDust = () => {
    return (
      <group>
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 12, 
              Math.random() * 15, 
              (Math.random() - 0.5) * 12
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={colors.brightGold} />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <DreiFloat speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
      <group ref={meshRef} position={[0, -3.2, 0]} scale={[0.55, 0.55, 0.55]}>
        
        {/* Main Body with Iridescent Glaze and Double-Sided Rendering */}
        <mesh castShadow receiveShadow>
          <latheGeometry args={[points, 128]} />
          <meshPhysicalMaterial 
            color={colors.teal}
            metalness={0.4}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={1}
            ior={1.8}
            sheen={1}
            sheenColor={colors.teal}
            iridescence={0.5}
            iridescenceIOR={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Dual Classical Scrolled Handles */}
        {[0, Math.PI].map((rot, i) => (
          <group key={i} rotation={[0, rot, 0]}>
            <mesh castShadow>
              <tubeGeometry args={[handleCurve, 64, 0.22, 12, false]} />
              <meshPhysicalMaterial 
                color={colors.gold} 
                metalness={1} 
                roughness={0.1} 
                clearcoat={1}
                emissive={colors.gold}
                emissiveIntensity={0.1}
              />
            </mesh>
            {/* Handle ornaments with subtle glow */}
            <mesh position={[4.5, 9.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshPhysicalMaterial 
                color={colors.brightGold} 
                metalness={1} 
                clearcoat={1}
                emissive={colors.brightGold}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Architectural Base (Tiered Gold) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.15, 16, 64]} />
          <meshPhysicalMaterial color={colors.gold} metalness={1} roughness={0.15} emissive={colors.gold} emissiveIntensity={0.1} />
        </mesh>
        <BeadRing radius={1.46} y={0.3} count={32} beadSize={0.1} />

        {/* Architectural Body Band (Pillars pattern) */}
        <ColumnMotif radius={3.32} y={5.0} count={36} height={0.8} />
        <mesh position={[0, 4.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.28, 0.08, 16, 64]} />
          <meshPhysicalMaterial color={colors.gold} metalness={1} emissive={colors.gold} emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, 5.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.12, 0.08, 16, 64]} />
          <meshPhysicalMaterial color={colors.gold} metalness={1} emissive={colors.gold} emissiveIntensity={0.1} />
        </mesh>

        {/* Enhanced Custom-Fitted Golden Cage around Body */}
        <GoldenCage />

        {/* Neck Fluting & Jewelry */}
        <BeadRing radius={1.26} y={10.2} count={24} beadSize={0.08} />
        <ColumnMotif radius={1.26} y={10.3} count={20} height={0.5} />
        
        {/* Carved Gold Rim */}
        <mesh position={[0, 12.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.45, 0.12, 16, 64]} />
          <meshPhysicalMaterial color={colors.brightGold} metalness={1} roughness={0.05} emissive={colors.gold} emissiveIntensity={0.2} />
        </mesh>
        <BeadRing radius={2.55} y={12.1} count={48} beadSize={0.1} />

        {/* Golden Aura Point Light (Luxury Shaders simulation) */}
        <pointLight position={[0, 6, 4]} intensity={2.5} color={colors.brightGold} distance={12} />
        
        {/* Floating Gold Dust for magical attractive look */}
        <FloatingGoldDust />
      </group>
    </DreiFloat>
  )
}


function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={32} />
      
      {/* High-Contrast Environment for Gold Depth */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[15, 20, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={3} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-15, 10, -10]} intensity={2} color="#ffd700" />
      <pointLight position={[0, -10, 5]} intensity={1} color="#ffffff" />
      
      <Suspense fallback={null}>
        <AntiqueVase />
      </Suspense>
      
      <ContactShadows 
        position={[0, -3.2, 0]} 
        opacity={0.7} 
        scale={16} 
        blur={2} 
        far={6} 
        color="#000"
      />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  )
}



export default function HeroScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px' }}>
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

