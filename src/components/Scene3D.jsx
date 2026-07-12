import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// PRNG con seed fisso: la "costellazione" di nodi è identica a ogni visita
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Rete di nodi collegati tra loro: un "cluster" che ruota lentamente
function ClusterNetwork() {
  const group = useRef(null)

  const { nodePositions, linePositions } = useMemo(() => {
    const rand = mulberry32(20260712)
    const count = 160
    const points = []

    for (let i = 0; i < count; i += 1) {
      const u = rand() * 2 - 1
      const phi = rand() * Math.PI * 2
      const radius = 2.2 + rand() * 1.5
      const s = Math.sqrt(1 - u * u)
      points.push(
        new THREE.Vector3(
          s * Math.cos(phi) * radius,
          u * radius * 0.72,
          s * Math.sin(phi) * radius,
        ),
      )
    }

    const nodePositions = new Float32Array(count * 3)
    points.forEach((p, i) => p.toArray(nodePositions, i * 3))

    const segments = []
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        if (points[i].distanceTo(points[j]) < 1.05) {
          segments.push(
            points[i].x, points[i].y, points[i].z,
            points[j].x, points[j].y, points[j].z,
          )
        }
      }
    }

    return { nodePositions, linePositions: new Float32Array(segments) }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.055
    group.current.rotation.x += delta * 0.008
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#67e8f9"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

// Nucleo centrale: icosaedro wireframe che "respira"
function Core() {
  const outer = useRef(null)
  const inner = useRef(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outer.current) {
      outer.current.rotation.x = t * 0.12
      outer.current.rotation.y = t * 0.2
      outer.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.045)
    }
    if (inner.current) {
      inner.current.rotation.x = -t * 0.18
      inner.current.rotation.z = t * 0.14
    }
  })

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          wireframe
          color="#7dd3fc"
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial
          wireframe
          color="#a78bfa"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Parallasse: la camera segue dolcemente il mouse
function Rig({ mouse, enabled }) {
  useFrame(({ camera }) => {
    if (!enabled) return
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.75, 0.045)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.current.y * 0.5, 0.045)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D() {
  const mouse = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event) => setReducedMotion(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return undefined
    const onMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reducedMotion])

  return (
    <div className="hero-3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7], fov: 46 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Rig mouse={mouse} enabled={!reducedMotion} />
        <ClusterNetwork />
        <Core />
      </Canvas>
    </div>
  )
}
