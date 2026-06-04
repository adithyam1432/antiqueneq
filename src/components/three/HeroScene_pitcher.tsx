'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float as DreiFloat } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

// Premium Brand Integrated Color Palette
const colors = {
  navy: "#050d1a",        // Deep glossy navy/black glaze
  gold: "#d4af37",        // Rich Venetian Gold
  brightGold: "#ffd700",  // Brilliant high-light gold
  darkGold: "#8c6c1b",    // Dark gold bronze
  pewter: "#944e07ff"       // Pewter/metal gray for lid
}

// Glowing Bead Rings
interface BeadRingProps {
  radius: number
  y: number
  count: number
  beadSize?: number
}

function BeadRing({ radius, y, count, beadSize = 0.07 }: BeadRingProps) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[beadSize, 12, 12]} />
            <meshPhysicalMaterial
              color={colors.brightGold}
              metalness={1}
              roughness={0.05}
              clearcoat={1}
              emissive={colors.brightGold}
              emissiveIntensity={1.0}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Floating Gold Dust (Smooth upward float & sway animation)
function FloatingGoldDust() {
  const particles = useMemo(() => {
    const pts = []
    for (let i = 0; i < 45; i++) {
      pts.push({
        position: [
          (Math.random() - 0.5) * 12,
          Math.random() * 14 - 1,
          (Math.random() - 0.5) * 12
        ] as [number, number, number],
        size: Math.random() * 0.04 + 0.015,
        speed: Math.random() * 0.3 + 0.1,
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
        if (p) {
          const newY = ((p.position[1] + time * p.speed) % 14) - 1
          const swayX = p.position[0] + Math.sin(time + p.phase) * 0.3
          const swayZ = p.position[2] + Math.cos(time + p.phase) * 0.3
          child.position.set(swayX, newY, swayZ)
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
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function AntiquePitcher() {
  const meshRef = useRef<THREE.Group>(null)

  // 1. Dynamic Pitcher Geometry: procedurally deformed Lathe to form asymmetric spout & side flares
  const pitcherGeometry = useMemo(() => {
    const pts = []
    // Flared Foot/Base
    pts.push(new THREE.Vector2(0, 0))
    pts.push(new THREE.Vector2(1.9, 0))    // Wide bottom lip
    pts.push(new THREE.Vector2(1.8, 0.15))
    pts.push(new THREE.Vector2(1.6, 0.3))
    pts.push(new THREE.Vector2(1.35, 0.6)) // Waist of foot

    // Bulbous lower body
    pts.push(new THREE.Vector2(1.45, 1.2))
    pts.push(new THREE.Vector2(2.5, 2.5))
    pts.push(new THREE.Vector2(3.5, 4.0))  // Widest section
    pts.push(new THREE.Vector2(3.1, 5.5))  // Shoulder

    // Scalloped neck
    pts.push(new THREE.Vector2(2.5, 7.2))  // Narrow neck start
    pts.push(new THREE.Vector2(2.2, 8.8))  // Neck shaft
    pts.push(new THREE.Vector2(2.2, 9.8))

    // Flared Mouth
    pts.push(new THREE.Vector2(2.4, 10.6))
    pts.push(new THREE.Vector2(2.6, 11.2))
    pts.push(new THREE.Vector2(0, 11.2))   // Top center close

    const geom = new THREE.LatheGeometry(pts, 128)
    const posAttr = geom.getAttribute('position')

    // Apply vertex deformations:
    // - Spout pointing to -X (left) at y > 7.2
    // - Triangular bottom flares along X (left/right) at 0.3 < y < 6.5
    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i)
      let y = posAttr.getY(i)
      let z = posAttr.getZ(i)

      const angle = Math.atan2(z, x) // -PI to PI

      // Spout Deformation
      if (y > 7.2) {
        // spoutFactor is highest at angle = PI or -PI (pointing -X)
        const spoutFactor = Math.pow(Math.max(0, -Math.cos(angle)), 2.5)
        const heightFactor = (y - 7.2) / 4.0

        // Stretch spout in -X, push up in Y, narrow in Z
        posAttr.setX(i, x - spoutFactor * heightFactor * 1.7)
        posAttr.setY(i, y + spoutFactor * heightFactor * 0.9)
        posAttr.setZ(i, z * (1.0 - spoutFactor * heightFactor * 0.25))
      }

      // Bottom skirt flaring (left & right wings)
      if (y > 0.3 && y < 6.5) {
        const wingHeightFactor = Math.sin(((y - 0.3) / 6.2) * Math.PI)

        // Stretch X axis, squeeze Z axis slightly
        const xStretch = 1.0 + Math.pow(Math.cos(angle), 4) * wingHeightFactor * 0.42
        const zCompress = 1.0 - Math.pow(Math.sin(angle), 2) * wingHeightFactor * 0.22

        posAttr.setX(i, x * xStretch)
        posAttr.setZ(i, z * zCompress)
      }
    }

    geom.computeVertexNormals()
    return geom
  }, [])

  // 2. Dynamic Canvas Texture mapping the floral panel, scrolls, gold borders, and navy glaze
  const pitcherTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Deep glossy navy glaze background
    ctx.fillStyle = '#050c18'
    ctx.fillRect(0, 0, 1024, 1024)

    // Thick gold rim details
    ctx.fillStyle = '#d4af37'
    ctx.fillRect(0, 995, 1024, 29)  // base rim
    ctx.fillRect(0, 0, 1024, 30)    // mouth rim

    const drawPanel = (cx: number) => {
      // 1. Olive/Sage Green Panel
      ctx.fillStyle = '#949b7c'
      ctx.beginPath()
      ctx.moveTo(cx - 180, 240)
      ctx.bezierCurveTo(cx - 200, 500, cx - 240, 720, cx - 180, 880)
      ctx.bezierCurveTo(cx - 100, 920, cx + 100, 920, cx + 180, 880)
      ctx.bezierCurveTo(cx + 240, 720, cx + 200, 500, cx + 180, 240)
      ctx.bezierCurveTo(cx + 80, 270, cx - 80, 270, cx - 180, 240)
      ctx.closePath()
      ctx.fill()

      // Main Gold Border Outline
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 10
      ctx.stroke()

      // Thin Darker Gold Accent Outline
      ctx.strokeStyle = '#a87e22'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(cx - 195, 235)
      ctx.bezierCurveTo(cx - 215, 500, cx - 255, 725, cx - 195, 885)
      ctx.bezierCurveTo(cx - 100, 935, cx + 100, 935, cx + 195, 885)
      ctx.bezierCurveTo(cx + 255, 725, cx + 215, 500, cx + 195, 235)
      ctx.bezierCurveTo(cx + 80, 260, cx - 80, 260, cx - 195, 235)
      ctx.closePath()
      ctx.stroke()

      // White bead dots bordering the panel
      ctx.fillStyle = '#ffffff'
      for (let t = 0; t <= 1; t += 0.02) {
        const bx = cx - 180 + 360 * t
        const by = 880 + Math.sin(t * Math.PI) * 40
        ctx.beginPath()
        ctx.arc(bx, by - 14, 3.5, 0, Math.PI * 2)
        ctx.fill()

        const tx = cx - 180 + 360 * t
        const ty = 240 + Math.sin(t * Math.PI) * 30
        ctx.beginPath()
        ctx.arc(tx, ty + 14, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Black/Dark Green Scrolls (Foliage)
      ctx.strokeStyle = '#121914'
      ctx.lineWidth = 14
      ctx.lineCap = 'round'

      ctx.beginPath()
      ctx.arc(cx - 65, 595, 75, 0, Math.PI * 1.45) // Left scroll
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx + 65, 595, 75, Math.PI, Math.PI * 2.45) // Right scroll
      ctx.stroke()

      // Gold highlights on scrolls
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.arc(cx - 65, 595, 68, 0.1, Math.PI * 1.4)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx + 65, 595, 68, Math.PI + 0.1, Math.PI * 2.4)
      ctx.stroke()

      // Gold hatching details inside scrolls
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 1.5
      for (let a = 0.25; a < Math.PI * 1.35; a += 0.18) {
        const x1 = cx - 65 + Math.cos(a) * 58
        const y1 = 595 + Math.sin(a) * 58
        const x2 = cx - 65 + Math.cos(a) * 72
        const y2 = 595 + Math.sin(a) * 72
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      for (let a = Math.PI + 0.25; a < Math.PI * 2.35; a += 0.18) {
        const x1 = cx + 65 + Math.cos(a) * 58
        const y1 = 595 + Math.sin(a) * 58
        const x2 = cx + 65 + Math.cos(a) * 72
        const y2 = 595 + Math.sin(a) * 72
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Stem lines
      ctx.strokeStyle = '#1c2820'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx, 400)
      ctx.quadraticCurveTo(cx - 30, 485, cx - 80, 525)
      ctx.moveTo(cx, 400)
      ctx.quadraticCurveTo(cx + 30, 485, cx + 80, 525)
      ctx.stroke()

      // 3. Daisy Drawing Helper
      const drawDaisy = (dx: number, dy: number, petals: string, center: string, r: number) => {
        ctx.save()
        ctx.translate(dx, dy)

        ctx.fillStyle = petals
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'
        ctx.lineWidth = 1
        for (let i = 0; i < 12; i++) {
          ctx.rotate(Math.PI / 6)
          ctx.beginPath()
          ctx.ellipse(0, r * 0.7, r * 0.22, r * 0.7, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }

        ctx.fillStyle = center
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#121914'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      }

      // Render Daisies matching the reference image
      drawDaisy(cx, 380, '#d1c2e8', '#ffd700', 32)      // Top purple
      drawDaisy(cx - 55, 445, '#ebd873', '#121914', 28)  // Left yellow
      drawDaisy(cx + 45, 495, '#ffffff', '#ffd700', 30)  // Center white
      drawDaisy(cx + 125, 455, '#f5c6e8', '#ebd873', 26) // Right pink
      drawDaisy(cx - 105, 505, '#92acc2', '#ffd700', 25) // Bottom left blue-gray
    }

    drawPanel(256) // Front side panel mapping
    drawPanel(768) // Back side panel mapping

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [])

  // 3. Curved Ornate Handle at +X (right side)
  const handleCurve = useMemo(() => {
    const handlePoints = [
      new THREE.Vector3(2.1, 8.5, 0),    // Connection at neck
      new THREE.Vector3(4.8, 8.2, 0),    // Top scroll flare
      new THREE.Vector3(5.2, 6.0, 0),    // Outer curve peak
      new THREE.Vector3(4.4, 3.8, 0),    // Lower curve return
      new THREE.Vector3(2.8, 3.6, 0)     // Connection at bulbous body
    ]
    return new THREE.CatmullRomCurve3(handlePoints)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <DreiFloat speed={1.0} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={meshRef} position={[0, -3.2, 0]} scale={[0.55, 0.55, 0.55]} rotation={[0, 0.7, 0]}>

        {/* Pitcher Main Body */}
        <mesh castShadow receiveShadow geometry={pitcherGeometry}>
          <meshPhysicalMaterial
            map={pitcherTexture || undefined}
            metalness={0.08}
            roughness={0.04}
            clearcoat={1}
            clearcoatRoughness={0.01}
            reflectivity={1}
            specularIntensity={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Navy Ceramic Handle */}
        <mesh castShadow>
          <tubeGeometry args={[handleCurve, 64, 0.25, 12, false]} />
          <meshPhysicalMaterial
            color={colors.navy}
            metalness={0.1}
            roughness={0.05}
            clearcoat={1}
          />
        </mesh>

        {/* Hand-painted Gold Accent line along outer curve of the Handle */}
        <mesh castShadow position={[0.08, 0.04, 0]}>
          <tubeGeometry args={[handleCurve, 64, 0.07, 8, false]} />
          <meshPhysicalMaterial
            color={colors.brightGold}
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            emissive={colors.gold}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Gold Bead rings on pitcher neck & foot base to replicate picture details */}
        <BeadRing radius={1.38} y={0.65} count={24} beadSize={0.07} />
        <BeadRing radius={2.24} y={7.2} count={32} beadSize={0.07} />

        {/* Pewter Metal Lid */}
        <group position={[-0.4, 11.2, 0]} rotation={[0, 0, -0.07]}>
          <mesh castShadow>
            <cylinderGeometry args={[2.5, 2.6, 0.3, 32]} />
            <meshStandardMaterial
              color={colors.pewter}
              metalness={0.88}
              roughness={0.32}
            />
          </mesh>
          <mesh castShadow position={[0, 0.25, 0]}>
            <sphereGeometry args={[1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={colors.pewter}
              metalness={0.88}
              roughness={0.32}
            />
          </mesh>

          {/* Thumb Lever Hinge */}
          <mesh position={[2.5, 0.1, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.4]} />
            <meshStandardMaterial color={colors.gold} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[2.7, 0.4, 0]} rotation={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial color={colors.pewter} metalness={0.9} roughness={0.3} />
          </mesh>

          {/* White Knob Finial */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.2, 8]} />
            <meshStandardMaterial color={colors.pewter} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshPhysicalMaterial color="#f7f9fa" roughness={0.1} clearcoat={1} />
          </mesh>
        </group>

        {/* Magical floating gold dust to match the luxury showroom vibe */}
        <FloatingGoldDust />
      </group>
    </DreiFloat>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={32} />

      <Environment preset="city" />
      <ambientLight intensity={0.45} />
      <spotLight
        position={[12, 22, 12]}
        angle={0.18}
        penumbra={1}
        intensity={3.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-14, 12, -8]} intensity={1.8} color="#ffd700" />
      <pointLight position={[0, -10, 6]} intensity={1.2} color="#ffffff" />

      <Suspense fallback={null}>
        <AntiquePitcher />
      </Suspense>

      <ContactShadows
        position={[0, -3.2, 0]}
        opacity={0.65}
        scale={15}
        blur={2.5}
        far={5.5}
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
          toneMappingExposure: 1.15
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
