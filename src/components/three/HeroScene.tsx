'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float as DreiFloat } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

// Premium Brand Integrated Color Palette
const colors = {
  teal: "#042c23",        // Deep imperial jade teal
  gold: "#d4af37",        // Rich Venetian Gold
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

// Decorative Rosette ornament for antique gold work
interface RosetteProps {
  position: [number, number, number]
  rotation: [number, number, number]
  material: React.ReactNode
}

function Rosette({ position, rotation, material }: RosetteProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        {material}
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.1, 0, Math.sin(angle) * 0.1]} rotation={[0, -angle, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            {material}
          </mesh>
        )
      })}
    </group>
  )
}

// Custom-fitted Elegant Gold Mounts wrapping only the lower portion of the bulbous body
function GoldenCage({ material }: { material?: React.ReactNode }) {
  const numBrackets = 8

  // Generate brackets with S-scroll curvatures and curls
  const brackets = useMemo(() => {
    const list = []
    for (let i = 0; i < numBrackets; i++) {
      const angle = (i / numBrackets) * Math.PI * 2
      // Curve points tracing the bulbous shape but adding an elegant organic flair
      const pts = [
        new THREE.Vector3(Math.cos(angle) * 0.65, 0.4, Math.sin(angle) * 0.65),
        new THREE.Vector3(Math.cos(angle) * 1.0, 1.2, Math.sin(angle) * 1.0),
        new THREE.Vector3(Math.cos(angle) * 2.0, 2.5, Math.sin(angle) * 2.0),
        new THREE.Vector3(Math.cos(angle) * 3.15, 3.8, Math.sin(angle) * 3.15),
        new THREE.Vector3(Math.cos(angle) * 3.75, 4.8, Math.sin(angle) * 3.75),
        new THREE.Vector3(Math.cos(angle) * 3.66, 5.0, Math.sin(angle) * 3.66)
      ]
      list.push({
        angle,
        curve: new THREE.CatmullRomCurve3(pts),
        topPos: [Math.cos(angle) * 3.75, 5.0, Math.sin(angle) * 3.75] as [number, number, number],
        bottomPos: [Math.cos(angle) * 0.75, 0.5, Math.sin(angle) * 0.75] as [number, number, number]
      })
    }
    return list
  }, [numBrackets])

  const rings = useMemo(() => [
    { y: 0.8, r: 0.58, beadSize: 0.05 },
    { y: 2.2, r: 1.72, beadSize: 0.05 },
    { y: 3.6, r: 3.02, beadSize: 0.06 },
    { y: 5.0, r: 3.66, beadSize: 0.07 }
  ], [])

  return (
    <group>
      {/* Horizontal Rings with Bead Borders */}
      {rings.map((ring, idx) => (
        <group key={`ring-group-${idx}`} position={[0, ring.y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[ring.r, 0.08, 12, 64]} />
            {material}
          </mesh>
          {/* Embedded Bead Ring on the horizontal mounts for luxury filigree feel */}
          {Array.from({ length: idx === 0 ? 16 : idx === 1 ? 24 : idx === 2 ? 36 : 48 }).map((_, i, arr) => {
            const angle = (i / arr.length) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(angle) * (ring.r + 0.04), 0, Math.sin(angle) * (ring.r + 0.04)]}>
                <sphereGeometry args={[ring.beadSize, 12, 12]} />
                {material}
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Vertical Scroll Brackets */}
      {brackets.map((item, idx) => (
        <group key={`bracket-${idx}`}>
          {/* Main Bracket Rib */}
          <mesh castShadow receiveShadow>
            <tubeGeometry args={[item.curve, 32, 0.08, 10, false]} />
            {material}
          </mesh>

          {/* Top Classical Scroll Curl (Acanthus / Rococo scroll) */}
          <group position={item.topPos} rotation={[0, -item.angle, 0]}>
            <mesh castShadow>
              <torusGeometry args={[0.22, 0.06, 8, 24, Math.PI * 1.5]} />
              {material}
            </mesh>
            <mesh position={[0.22, 0, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              {material}
            </mesh>
          </group>

          {/* Bottom Scroll Leg Flange */}
          <group position={item.bottomPos} rotation={[0, -item.angle, 0]}>
            <mesh castShadow>
              <torusGeometry args={[0.16, 0.05, 8, 24, Math.PI * 1.5]} />
              {material}
            </mesh>
          </group>
        </group>
      ))}

      {/* Decorative Rosettes on the top belt intersection and middle ring */}
      {brackets.map((item, idx) => {
        const midX = Math.cos(item.angle) * 1.76
        const midZ = Math.sin(item.angle) * 1.76
        const topX = Math.cos(item.angle + Math.PI / numBrackets) * 3.7
        const topZ = Math.sin(item.angle + Math.PI / numBrackets) * 3.7
        return (
          <group key={`rosette-group-${idx}`}>
            <Rosette
              position={[midX, 2.2, midZ]}
              rotation={[0, -item.angle, 0]}
              material={material}
            />
            <Rosette
              position={[topX, 5.0, topZ]}
              rotation={[0, -(item.angle + Math.PI / numBrackets), 0]}
              material={material}
            />
          </group>
        )
      })}
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

// Helper function to query the exact profile radius of the vase at height y
function getVaseRadius(y: number): number {
  if (y < 1.8) {
    const t = (y - 0.8) / 1.0
    return 0.5 + t * 0.7
  } else if (y < 3.2) {
    const t = (y - 1.8) / 1.4
    return 1.2 + t * 1.4
  } else if (y < 4.6) {
    const t = (y - 3.2) / 1.4
    return 2.6 + t * 0.9
  } else if (y < 5.2) {
    return 3.5
  } else if (y < 6.6) {
    const t = (y - 5.2) / 1.4
    return 3.5 - t * 0.7
  } else if (y < 8.0) {
    const t = (y - 6.6) / 1.4
    return 2.8 - t * 1.0
  } else if (y < 9.0) {
    const t = (y - 8.0) / 1.0
    return 1.8 - t * 0.6
  } else if (y < 10.2) {
    const t = (y - 9.0) / 1.2
    return 1.2 - t * 0.2
  } else if (y < 11.2) {
    const t = (y - 10.2) / 1.0
    return 1.0 + t * 0.2
  } else {
    const t = (y - 11.2) / 1.0
    return 1.2 + t * 1.6
  }
}

// Double-helix golden threads winding around the neck
function GoldenThreadVine({ material }: { material: React.ReactNode }) {
  const points1 = useMemo(() => {
    const pts = []
    const turns = 3.5
    for (let t = 0; t <= 1; t += 0.01) {
      const angle = t * Math.PI * 2 * turns
      const y = 6.6 + t * 3.2
      const r = getVaseRadius(y) + 0.06
      pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  const points2 = useMemo(() => {
    const pts = []
    const turns = 3.5
    for (let t = 0; t <= 1; t += 0.01) {
      const angle = t * Math.PI * 2 * turns + Math.PI
      const y = 6.6 + t * 3.2
      const r = getVaseRadius(y) + 0.06
      pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[points1, 100, 0.05, 8, false]} />
        {material}
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[points2, 100, 0.05, 8, false]} />
        {material}
      </mesh>
    </group>
  )
}

// Ornate gothic loops hanging under the rim
interface RimFiligreeProps {
  radius: number
  y: number
  count: number
  material: React.ReactNode
}

function RimFiligree({ radius, y, count, material }: RimFiligreeProps) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
            {/* Hanging arch */}
            <mesh rotation={[0, 0, Math.PI]} position={[0, -0.15, 0]} castShadow>
              <torusGeometry args={[0.18, 0.04, 8, 16, Math.PI]} />
              {material}
            </mesh>
            {/* Hanging pearl bead */}
            <mesh position={[0, -0.33, 0]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              {material}
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Detailed Ornate Gold Relief Sculpture Medallion with Ruby Center and Leaf Carvings
interface ReliefSculptureProps {
  position: [number, number, number]
  rotation: [number, number, number]
  material: React.ReactNode
}

function ReliefSculpture({ position, rotation, material }: ReliefSculptureProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. Base Medallion Plate */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.85, 0.1, 32]} />
        {material}
      </mesh>

      {/* 2. Beaded Ring Border */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.72, 0.08, Math.sin(angle) * 0.72]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            {material}
          </mesh>
        )
      })}

      {/* 3. Central Sculpted Emblem: Crown or Star Motif */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <dodecahedronGeometry args={[0.26]} />
        {material}
      </mesh>

      {/* Radiating Leaf / Petal Carvings (Symmetric wings) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const curvePoints = [
          new THREE.Vector3(0, 0.05, 0),
          new THREE.Vector3(Math.cos(angle) * 0.25, 0.12, Math.sin(angle) * 0.25),
          new THREE.Vector3(Math.cos(angle) * 0.5, 0.08, Math.sin(angle) * 0.5),
          new THREE.Vector3(Math.cos(angle) * 0.6, 0.04, Math.sin(angle) * 0.6)
        ]
        const curve = new THREE.CatmullRomCurve3(curvePoints)
        
        return (
          <group key={i}>
            <mesh castShadow>
              <tubeGeometry args={[curve, 8, 0.04, 6, false]} />
              {material}
            </mesh>
            <mesh position={[Math.cos(angle) * 0.6, 0.06, Math.sin(angle) * 0.6]} castShadow>
              <sphereGeometry args={[0.05, 8, 8]} />
              {material}
            </mesh>
          </group>
        )
      })}

      {/* 4. Fine central gem / detail */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshPhysicalMaterial
          color="#ff0044" // Crimson ruby gem center
          roughness={0.0}
          metalness={0.1}
          clearcoat={1.0}
          transmission={0.9}
          thickness={0.2}
          ior={2.4}
        />
      </mesh>
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

        {/* Main Body with Pearl-Glaze Iridescence & Jade Translucency */}
        <mesh castShadow receiveShadow>
          <latheGeometry args={[points, 128]} />
          <meshPhysicalMaterial
            color={colors.teal}
            metalness={0.08}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            transmission={0.12}
            thickness={1.5}
            ior={1.65}
            reflectivity={1.0}
            sheen={1.0}
            sheenColor="#00d9aa"
            sheenRoughness={0.05}
            specularIntensity={1.2}
            specularColor="#9b8585"
            iridescence={0.85}
            iridescenceIOR={1.45}
            iridescenceThicknessRange={[100, 350]}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Light source inside the vase to highlight transmission/translucency */}
        <pointLight position={[0, 5.0, 0]} intensity={1.8} color="#00ffcc" distance={6} decay={2} />

        {/* Ornate Gold Relief Sculpture Medallions on front and back of the vase body */}
        <ReliefSculpture position={[0, 4.9, 3.52]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial} />
        <ReliefSculpture position={[0, 4.9, -3.52]} rotation={[-Math.PI / 2, 0, Math.PI]} material={goldMaterial} />

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

        {/* Architectural Body Band (Jeweled Gold Belt at the waist of the body) */}
        <mesh position={[0, 5.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[3.48, 0.16, 16, 64]} />
          {goldMaterial}
        </mesh>
        <BeadRing radius={3.58} y={5.4} count={48} beadSize={0.06} material={goldMaterial} />

        {/* Enhanced Custom-Fitted Golden Cage wrapping lower half of bulbous body */}
        <GoldenCage material={goldMaterial} />

        {/* Neck Fluting & Jewelry */}
        {/* Double-helix golden threads winding around the neck */}
        <GoldenThreadVine material={goldMaterial} />

        {/* Jeweled Neck Collar (alternating gold and emerald beads) */}
        <group position={[0, 10.2, 0]}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2
            const isGem = i % 2 === 0
            return (
              <mesh key={i} position={[Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05]} castShadow>
                <sphereGeometry args={[0.07, 12, 12]} />
                {isGem ? (
                  <meshPhysicalMaterial
                    color="#00ff88" // Glowing Emerald green gem
                    roughness={0.0}
                    metalness={0.1}
                    clearcoat={1.0}
                    transmission={0.9}
                    thickness={0.2}
                    ior={2.0}
                  />
                ) : (
                  goldMaterial
                )}
              </mesh>
            )
          })}
        </group>
        <ColumnMotif radius={1.05} y={10.3} count={20} height={0.5} material={goldMaterial} />

        {/* Carved Gold Rim with hanging scallop arches */}
        <mesh position={[0, 12.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[2.8, 0.12, 16, 64]} />
          {goldMaterial}
        </mesh>
        <RimFiligree radius={2.8} y={12.2} count={24} material={goldMaterial} />
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

  const isMobileOrTablet = useMemo(() => viewportWidth < 6.5, [viewportWidth])

  const scale = useMemo(() => {
    if (isMobileOrTablet) {
      // Scale up more on mobile to show details of the upper part
      return (viewportHeight * 0.85) / 12.4
    }
    // Standard scale on desktop to fit the entire vase in the container
    return (viewportHeight * 0.68) / 12.4
  }, [viewportWidth, viewportHeight, isMobileOrTablet])

  const centerY = useMemo(() => {
    if (isMobileOrTablet) {
      // On mobile, focus on the upper neck/handles (9.4) to push the bottom cage/base below the text
      return -3.2 + 9.4 * scale
    }
    // On desktop, focus on the midpoint of the vase (6.2) to ensure the entire vase is fully visible and not clipped
    return -3.2 + 6.2 * scale
  }, [scale, isMobileOrTablet])

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
