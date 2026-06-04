'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float as DreiFloat } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

// Premium Brand Integrated Color Palette
const colors = {
  teal: "#023429ff",        // Deep imperial jade teal
  gold: "#d8b02dff",        // Rich Venetian Gold
  brightGold: "#ffd700",  // Brilliant high-light gold
  darkGold: "#a87e22"     // Antique gold bronze
}

// Architectural Motif: Column/Dentil patterns with Golden Glow
interface ColumnMotifProps {
  radius: number
  y: number
  count: number
  height?: number
  material?: React.ReactNode
}

function ColumnMotif({ radius, y, count, height = 0.5, material }: ColumnMotifProps) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.15, height, 0.08]} />
            {material}
          </mesh>
        )
      })}
    </group>
  )
}

// Glowing Bead Rings
interface BeadRingProps {
  radius: number
  y: number
  count: number
  beadSize?: number
  material?: React.ReactNode
}

function BeadRing({ radius, y, count, beadSize = 0.08, material }: BeadRingProps) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[beadSize, 16, 16]} />
            {material}
          </mesh>
        )
      })}
    </group>
  )
}

// Custom-fitted Wireframe Lathe Cage wrapping only the lower portion of the bulbous body
function GoldenCage({ material }: { material?: React.ReactNode }) {
  const rings = useMemo(() => [
    { y: 0.8, r: 0.58 },
    { y: 2.2, r: 1.72 },
    { y: 3.6, r: 3.02 },
    { y: 5.0, r: 3.66 }
  ], [])
  const numColumns = 16

  // Generate vertical curves following the bulbous shape
  const columns = useMemo(() => {
    const cols = []
    for (let i = 0; i < numColumns; i++) {
      const angle = (i / numColumns) * Math.PI * 2
      const pts = rings.map(ring => new THREE.Vector3(
        Math.cos(angle) * ring.r,
        ring.y,
        Math.sin(angle) * ring.r
      ))
      cols.push(new THREE.CatmullRomCurve3(pts))
    }
    return cols
  }, [rings])

  // Generate diagonal lattice wireframes (creating a criss-cross pattern)
  const diagonals = useMemo(() => {
    const diags = []
    for (let j = 0; j < rings.length - 1; j++) {
      const ringA = rings[j]
      const ringB = rings[j + 1]
      for (let i = 0; i < numColumns; i++) {
        const angleA1 = (i / numColumns) * Math.PI * 2
        const angleA2 = (((i + 1) % numColumns) / numColumns) * Math.PI * 2
        const angleB1 = (i / numColumns) * Math.PI * 2
        const angleB2 = (((i + 1) % numColumns) / numColumns) * Math.PI * 2

        const pA1 = new THREE.Vector3(Math.cos(angleA1) * ringA.r, ringA.y, Math.sin(angleA1) * ringA.r)
        const pA2 = new THREE.Vector3(Math.cos(angleA2) * ringA.r, ringA.y, Math.sin(angleA2) * ringA.r)
        const pB1 = new THREE.Vector3(Math.cos(angleB1) * ringB.r, ringB.y, Math.sin(angleB1) * ringB.r)
        const pB2 = new THREE.Vector3(Math.cos(angleB2) * ringB.r, ringB.y, Math.sin(angleB2) * ringB.r)

        // Cross diagonals
        diags.push(new THREE.LineCurve3(pA1, pB2))
        diags.push(new THREE.LineCurve3(pA2, pB1))
      }
    }
    return diags
  }, [rings])

  return (
    <group>
      {/* Horizontal Rings */}
      {rings.map((ring, idx) => (
        <mesh key={`ring-${idx}`} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[ring.r, 0.04, 8, 64]} />
          {material}
        </mesh>
      ))}

      {/* Vertical Columns */}
      {columns.map((curve, idx) => (
        <mesh key={`col-${idx}`} castShadow receiveShadow>
          <tubeGeometry args={[curve, 16, 0.04, 6, false]} />
          {material}
        </mesh>
      ))}

      {/* Diagonal Crosses */}
      {diagonals.map((curve, idx) => (
        <mesh key={`diag-${idx}`} castShadow receiveShadow>
          <tubeGeometry args={[curve, 8, 0.025, 4, false]} />
          {material}
        </mesh>
      ))}
    </group>
  )
}

// Floating Gold Dust (Smooth upward float & sway animation)
function FloatingGoldDust() {
  const particles = useMemo(() => {
    const pts = []
    for (let i = 0; i < 60; i++) {
      pts.push({
        position: [
          (Math.random() - 0.5) * 12,
          Math.random() * 14 - 1,
          (Math.random() - 0.5) * 12
        ] as [number, number, number],
        size: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2
      })
    }
    return pts
  }, [])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i]
        if (p && child instanceof THREE.Mesh) {
          // Float upwards, wrap around height limits smoothly
          const newY = ((p.position[1] + time * p.speed) % 14) - 1
          const swayX = p.position[0] + Math.sin(time + p.phase) * 0.3
          const swayZ = p.position[2] + Math.cos(time + p.phase) * 0.3
          child.position.set(swayX, newY, swayZ)

          // Twinkle/Pulse opacity dynamically
          if (child.material && !Array.isArray(child.material)) {
            child.material.opacity = 0.35 + Math.sin(time * 2.5 + p.phase * 4.0) * 0.3
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshBasicMaterial
            color={colors.brightGold}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

interface AntiqueVaseProps {
  scale: number
}

function AntiqueVase({ scale }: AntiqueVaseProps) {
  const meshRef = useRef<THREE.Group>(null)
  const goldDetailMatRef = useRef<THREE.MeshPhysicalMaterial>(null)

  // Custom Vase Profile: High-Detail Architectural Curvature
  // Formed of a narrow foot, flared lip, and round-diamond body shape.
  const points = useMemo(() => {
    const pts = []
    // Base/Foot
    pts.push(new THREE.Vector2(0, 0))
    pts.push(new THREE.Vector2(0.8, 0))    // narrow foot bottom
    pts.push(new THREE.Vector2(0.8, 0.2))
    pts.push(new THREE.Vector2(0.65, 0.4))
    pts.push(new THREE.Vector2(0.5, 0.8))  // narrow foot top

    // Lower Bulbous Body (round-diamond shape)
    pts.push(new THREE.Vector2(1.2, 1.8))
    pts.push(new THREE.Vector2(2.6, 3.2))
    pts.push(new THREE.Vector2(3.5, 4.6))  // Widest point of diamond body
    pts.push(new THREE.Vector2(3.5, 5.2))  // Vertically flat profile section
    pts.push(new THREE.Vector2(2.8, 6.6))  // tapering in
    pts.push(new THREE.Vector2(1.8, 8.0))  // tapering in
    pts.push(new THREE.Vector2(1.2, 9.0))  // narrow neck start

    // Fluted Neck
    pts.push(new THREE.Vector2(1.0, 10.2)) // narrowest neck
    pts.push(new THREE.Vector2(1.2, 11.2)) // fluting out

    // Flared Lip / Rim
    pts.push(new THREE.Vector2(2.0, 11.8))
    pts.push(new THREE.Vector2(2.8, 12.2)) // flared lip
    pts.push(new THREE.Vector2(2.85, 12.3))
    pts.push(new THREE.Vector2(2.7, 12.4))
    return pts
  }, [])

  // Semicircular Tube Arches (ear-shaped handles connecting neck flange to shoulder)
  const handlePoints = useMemo(() => [
    new THREE.Vector3(1.1, 10.2, 0),  // Neck flange
    new THREE.Vector3(3.0, 11.0, 0),  // Upper arch flare
    new THREE.Vector3(3.8, 9.0, 0),   // Mid arch flare
    new THREE.Vector3(3.4, 7.5, 0),   // Lower arch curve
    new THREE.Vector3(2.8, 6.6, 0),   // Shoulder connection
  ], [])
  const handleCurve = useMemo(() => new THREE.CatmullRomCurve3(handlePoints), [handlePoints])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
    if (goldDetailMatRef.current) {
      const time = state.clock.getElapsedTime()
      // Pulse gold details glow
      goldDetailMatRef.current.emissiveIntensity = 0.35 + Math.sin(time * 1.5) * 0.25
    }
  })

  // Shared 24K Venetian Gold Material with emissive pulsing support
  const goldMaterial = (
    <meshPhysicalMaterial
      ref={goldDetailMatRef}
      color={colors.gold}
      metalness={1.0}
      roughness={0.08}
      clearcoat={1.0}
      clearcoatRoughness={0.02}
      emissive={colors.gold}
      emissiveIntensity={0.5}
    />
  )

  return (
    <DreiFloat speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
      <group ref={meshRef} position={[0, -3.2, 0]} scale={[scale, scale, scale]}>

        {/* Main Body with Jade Green Glaze & Scrolled Gold Highlights */}
        <mesh castShadow receiveShadow>
          <latheGeometry args={[points, 128]} />
          <meshPhysicalMaterial
            color={colors.teal}
            metalness={0.15}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            transmission={0.1}
            thickness={1.0}
            ior={1.6}
            reflectivity={1.0}
            sheen={1.0}
            sheenColor="#00d9aa"
            sheenRoughness={0.1}
            specularIntensity={1.0}
            specularColor="#9b8585"
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Light source inside the vase to highlight golden reflection & inner glow */}
        <pointLight position={[0, 5.0, 0]} intensity={2.0} color="#ffd700" distance={6} decay={2} />

        {/* Dual Classical Scrolled Handles */}
        {[0, Math.PI].map((rot, i) => (
          <group key={i} rotation={[0, rot, 0]}>
            <mesh castShadow>
              <tubeGeometry args={[handleCurve, 64, 0.22, 12, false]} />
              {goldMaterial}
            </mesh>

            {/* Rococo scrolls at handle neck connection */}
            <mesh position={[1.1, 10.4, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
              <torusGeometry args={[0.25, 0.06, 8, 24, Math.PI * 1.5]} />
              {goldMaterial}
            </mesh>

            {/* Rococo scrolls at handle shoulder connection */}
            <mesh position={[2.8, 6.4, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <torusGeometry args={[0.3, 0.07, 8, 24, Math.PI * 1.5]} />
              {goldMaterial}
            </mesh>

            {/* Handle ornaments with subtle glow */}
            <mesh position={[3.8, 9.0, 0]} castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              {goldMaterial}
            </mesh>
          </group>
        ))}

        {/* Architectural Base (Tiered Gold) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.85, 0.1, 16, 64]} />
          {goldMaterial}
        </mesh>
        <BeadRing radius={0.75} y={0.3} count={20} beadSize={0.08} material={goldMaterial} />

        {/* Architectural Body Band (Pillars pattern at the waist of the diamond body) */}
        <ColumnMotif radius={3.55} y={5.0} count={36} height={0.8} material={goldMaterial} />
        <mesh position={[0, 4.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[3.52, 0.08, 16, 64]} />
          {goldMaterial}
        </mesh>
        <mesh position={[0, 5.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[3.18, 0.08, 16, 64]} />
          {goldMaterial}
        </mesh>

        {/* Enhanced Custom-Fitted Golden Cage wrapping lower half of bulbous body */}
        <GoldenCage material={goldMaterial} />

        {/* Neck Fluting & Jewelry */}
        <BeadRing radius={1.05} y={10.2} count={20} beadSize={0.08} material={goldMaterial} />
        <ColumnMotif radius={1.05} y={10.3} count={20} height={0.5} material={goldMaterial} />

        {/* Carved Gold Rim */}
        <mesh position={[0, 12.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[2.8, 0.12, 16, 64]} />
          {goldMaterial}
        </mesh>
        <BeadRing radius={2.9} y={12.3} count={40} beadSize={0.08} material={goldMaterial} />

        {/* Golden Aura Point Light (Luxury Shaders simulation) */}
        <pointLight position={[0, 6, 4]} intensity={2.5} color={colors.brightGold} distance={12} />

        {/* Floating Gold Dust for magical attractive look */}
        <FloatingGoldDust />
      </group>
    </DreiFloat>
  )
}

function Scene() {
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport)

  const scale = useMemo(() => {
    const isMobileOrTablet = viewportWidth < 6.5
    if (isMobileOrTablet) {
      return (viewportHeight * 0.55) / 12.4
    }
    return (viewportHeight * 0.68) / 12.4
  }, [viewportWidth, viewportHeight])

  const centerY = -3.2 + 6.2 * scale

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, centerY, 16.5]} fov={30} />

      {/* High-Contrast Environment for Gold Depth */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[5, 12, 6]}
        intensity={3.0}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[15, 20, 10]}
        angle={0.15}
        penumbra={1}
        intensity={5.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-15, 10, -10]} intensity={2.0} color="#ffd700" />
      <pointLight position={[0, -2.5, 3]} intensity={1.5} color="#ffd700" />
      <pointLight position={[0, -10, 5]} intensity={1.0} color="#ffffff" />

      <Suspense fallback={null}>
        <AntiqueVase scale={scale} />
      </Suspense>

      <ContactShadows
        position={[0, -3.2, 0]}
        opacity={0.85}
        scale={16}
        blur={2.5}
        far={6.0}
        color="#000"
      />

      <OrbitControls
        target={[0, centerY, 0]}
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
    <div style={{ width: '100%', height: '100%' }}>
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
