import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// PRNG con seed fisso: la scena è identica a ogni visita
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Easing con leggero "overshoot": i pod compaiono con un pop
function easeOutBack(x) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// Posizioni dei nodi worker attorno al control plane
const NODE_POSITIONS = [
  [3.2, 0.55, 0.3],
  [-1.9, -0.9, 1.9],
  [-2.0, 0.95, -2.4],
]

// Slot dei pod dentro ogni nodo (griglia 2×2)
const POD_SLOTS = [
  [-0.2, -0.2, 0],
  [0.2, -0.2, 0],
  [-0.2, 0.2, 0],
  [0.2, 0.2, 0],
]

const glowMaterial = {
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
}

// Pulviscolo di fondo per dare profondità
function Particles() {
  const ref = useRef(null)

  const positions = useMemo(() => {
    const rand = mulberry32(1337)
    const count = 260
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const u = rand() * 2 - 1
      const phi = rand() * Math.PI * 2
      const r = 5.5 + rand() * 4
      const s = Math.sqrt(1 - u * u)
      arr[i * 3] = s * Math.cos(phi) * r
      arr[i * 3 + 1] = u * r * 0.7
      arr[i * 3 + 2] = s * Math.sin(phi) * r
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.012
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#67e8f9"
        size={0.035}
        sizeAttenuation
        opacity={0.55}
        {...glowMaterial}
      />
    </points>
  )
}

// Il control plane: un timone a 7 razze che gira e "respira"
function HelmWheel() {
  const spin = useRef(null)

  const spokes = useMemo(
    () => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2),
    [],
  )

  useFrame((state, delta) => {
    if (!spin.current) return
    spin.current.rotation.z += delta * 0.22
    spin.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.035)
  })

  return (
    <group rotation={[0.5, -0.35, 0]}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[1.5, 0.055, 20, 96]} />
          <meshBasicMaterial color="#7dd3fc" opacity={0.85} {...glowMaterial} />
        </mesh>

        <mesh>
          <torusGeometry args={[0.34, 0.05, 16, 48]} />
          <meshBasicMaterial color="#a78bfa" opacity={0.9} {...glowMaterial} />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshBasicMaterial color="#c4b5fd" opacity={0.95} {...glowMaterial} />
        </mesh>

        {spokes.map((angle) => (
          <group key={angle}>
            <mesh
              position={[Math.cos(angle) * 0.925, Math.sin(angle) * 0.925, 0]}
              rotation={[0, 0, angle - Math.PI / 2]}
            >
              <cylinderGeometry args={[0.04, 0.04, 1.16, 10]} />
              <meshBasicMaterial color="#7dd3fc" opacity={0.7} {...glowMaterial} />
            </mesh>

            <mesh
              position={[Math.cos(angle) * 1.73, Math.sin(angle) * 1.73, 0]}
              rotation={[0, 0, angle - Math.PI / 2]}
            >
              <cylinderGeometry args={[0.055, 0.055, 0.46, 10]} />
              <meshBasicMaterial color="#a78bfa" opacity={0.85} {...glowMaterial} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// I pod dentro un nodo: nascono, girano e terminano in cicli sfalsati
function Pods({ seed }) {
  const refs = useRef([])

  const cycles = useMemo(() => {
    const rand = mulberry32(seed)
    return POD_SLOTS.map(() => ({
      offset: rand() * 20,
      cycle: 6 + rand() * 6,
    }))
  }, [seed])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const { offset, cycle } = cycles[i]
      const p = ((t + offset) % cycle) / cycle
      let s
      if (p < 0.14) s = easeOutBack(p / 0.14)
      else if (p > 0.86) s = Math.max(0, 1 - (p - 0.86) / 0.14)
      else s = 1
      mesh.scale.setScalar(Math.max(0.001, s))
      mesh.rotation.y = t * 0.6 + i
    })
  })

  return POD_SLOTS.map((pos, i) => (
    <mesh
      key={pos.join(',')}
      position={pos}
      ref={(el) => {
        refs.current[i] = el
      }}
    >
      <boxGeometry args={[0.24, 0.24, 0.24]} />
      <meshBasicMaterial color="#67e8f9" opacity={0.9} {...glowMaterial} />
    </mesh>
  ))
}

// Un nodo worker: box wireframe che ruota piano, con i pod dentro
function WorkerNode({ position, seed }) {
  const box = useRef(null)

  useFrame((_, delta) => {
    if (box.current) box.current.rotation.y += delta * 0.15
  })

  return (
    <group position={position}>
      <mesh ref={box}>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
      <Pods seed={seed} />
    </group>
  )
}

// Connessioni dal control plane ai nodi
function Links() {
  const linePositions = useMemo(() => {
    const arr = []
    NODE_POSITIONS.forEach(([x, y, z]) => arr.push(0, 0, 0, x, y, z))
    return new Float32Array(arr)
  }, [])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" opacity={0.3} {...glowMaterial} />
    </lineSegments>
  )
}

// "Pacchetti" che viaggiano dal control plane verso i nodi
function Packets() {
  const refs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    NODE_POSITIONS.forEach((pos, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const p = (t * 0.22 + i * 0.37) % 1
      mesh.position.set(pos[0] * p, pos[1] * p, pos[2] * p)
      mesh.scale.setScalar(0.4 + Math.sin(Math.PI * p) * 0.6)
    })
  })

  return NODE_POSITIONS.map((pos, i) => (
    <mesh
      key={pos.join(',')}
      ref={(el) => {
        refs.current[i] = el
      }}
    >
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshBasicMaterial color="#67e8f9" opacity={0.9} {...glowMaterial} />
    </mesh>
  ))
}

// Il cluster completo: timone fisso al centro, nodi in orbita lenta
function Cluster() {
  const orbit = useRef(null)

  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.y += delta * 0.09
  })

  return (
    <group position={[1.4, 0.15, 0]} scale={0.92}>
      <HelmWheel />
      <group ref={orbit}>
        <Links />
        <Packets />
        {NODE_POSITIONS.map((pos, i) => (
          <WorkerNode key={pos.join(',')} position={pos} seed={100 + i * 17} />
        ))}
      </group>
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
        camera={{ position: [0, 0, 7.5], fov: 46 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Rig mouse={mouse} enabled={!reducedMotion} />
        <Particles />
        <Cluster />
      </Canvas>
    </div>
  )
}
