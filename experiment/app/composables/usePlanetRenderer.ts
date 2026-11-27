import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'
import * as THREE from 'three'
import type { Theme } from '~/types/content.types'

type Palette = ReturnType<typeof getPalette>

const continentCenters = [
  { center: new THREE.Vector3(-0.75, 0.35, 0.56).normalize(), threshold: 0.8 },
  { center: new THREE.Vector3(0.08, -0.48, 0.87).normalize(), threshold: 0.84 },
  { center: new THREE.Vector3(0.62, -0.08, 0.78).normalize(), threshold: 0.83 },
  { center: new THREE.Vector3(-0.38, 0.66, -0.64).normalize(), threshold: 0.76 },
  { center: new THREE.Vector3(0.78, -0.5, -0.37).normalize(), threshold: 0.89 },
  { center: new THREE.Vector3(0.15, 0.78, 0.6).normalize(), threshold: 0.9 },
  { center: new THREE.Vector3(-0.65, -0.45, -0.61).normalize(), threshold: 0.89 },
  { center: new THREE.Vector3(0.45, 0.55, -0.7).normalize(), threshold: 0.88 },
] as const

function getPalette(theme: Theme) {
  const dark = theme === 'dark'
  return {
    dark,
    core: dark ? 0x0a1f44 : 0x1b4777,
    coreEmissive: dark ? 0x061429 : 0x174ea6,
    grid: dark ? 0x4c79bd : 0x3975c6,
    dots: dark ? 0xb7c8dc : 0x91afd0,
    bright: dark ? 0x73c2da : 0xeaf1fa,
    star: dark ? 0xf7fafc : 0x344e6c,
    starAccent: dark ? 0x70a7d8 : 0x174ea6,
    glow: dark ? 0x3d7bff : 0x3975c6,
    ring: dark ? 0x4b9b9b : 0xafc8e7,
    arc: dark ? 0x5cb6b0 : 0x8ab1e0,
    pulse: dark ? 0xf3ad70 : 0xffffff,
    metal: dark ? 0x9caec4 : 0x0b1f42,
    panel: dark ? 0x29466a : 0x3975c6,
    signal: dark ? 0xf2a36d : 0x8db5e6,
    ambient: dark ? 0xa0aec0 : 0xdce6f3,
    ambientIntensity: dark ? 0.7 : 1.2,
    glowIntensity: dark ? 0.5 : 0.38,
    starOpacity: dark ? 0.85 : 0.76,
  }
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function continentNoise(v: THREE.Vector3) {
  const { x, y, z } = v
  const roughness =
    Math.sin(x * 8.4 + y * 5.3 - z * 6.1) * 0.5 +
    Math.cos(y * 10.2 - z * 8.4 + x * 4.3) * 0.3 +
    Math.sin(z * 14 + x * 11 - y * 9) * 0.2
  return Math.max(
    ...continentCenters.map(
      ({ center, threshold }) => v.dot(center) - threshold - 0.06 + roughness * 0.1,
    ),
  )
}

function buildSatellite(p: Palette) {
  const satellite = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: p.metal, roughness: 0.32, metalness: 0.82 })
  const panel = new THREE.MeshStandardMaterial({
    color: p.panel,
    roughness: 0.3,
    metalness: 0.65,
    emissive: new THREE.Color(p.panel),
    emissiveIntensity: p.dark ? 0.32 : 0.18,
  })
  const accentEdge = new THREE.LineBasicMaterial({
    color: p.bright,
    transparent: true,
    opacity: p.dark ? 0.85 : 0.9,
  })

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.36), metal)
  satellite.add(body)
  const bodyEdges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), accentEdge)
  satellite.add(bodyEdges)

  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.1, 0.11, 16), metal)
  nose.rotation.x = Math.PI / 2
  nose.position.z = 0.235
  satellite.add(nose)

  const strutGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8)
  const strut = new THREE.Mesh(strutGeometry, metal)
  strut.rotation.z = Math.PI / 2
  satellite.add(strut)

  ;[-1, 1].forEach((side) => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.016, 0.27), panel)
    wing.position.x = side * 0.51
    satellite.add(wing)
    const wingEdges = new THREE.LineSegments(new THREE.EdgesGeometry(wing.geometry), accentEdge)
    wingEdges.position.copy(wing.position)
    satellite.add(wingEdges)
    for (let i = -1; i <= 1; i += 1) {
      if (i === 0) continue
      const row = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.019, 0.27),
        new THREE.MeshBasicMaterial({
          color: p.bright,
          transparent: true,
          opacity: p.dark ? 0.35 : 0.68,
        }),
      )
      row.position.set(side * 0.51 + i * 0.14, 0, 0)
      satellite.add(row)
    }
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 8), metal)
    arm.rotation.z = Math.PI / 2
    arm.position.x = side * 0.19
    satellite.add(arm)
  })

  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.115, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.42),
    new THREE.MeshStandardMaterial({
      color: p.metal,
      roughness: 0.28,
      metalness: 0.9,
      side: THREE.DoubleSide,
    }),
  )
  dish.position.set(0, 0.125, -0.12)
  dish.rotation.x = Math.PI * 0.78
  satellite.add(dish)

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.24, 6), metal)
  antenna.position.set(0.055, 0.2, 0.13)
  antenna.rotation.z = 0.25
  satellite.add(antenna)

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 10, 10),
    new THREE.MeshBasicMaterial({ color: p.signal }),
  )
  beacon.position.set(0.06, 0.33, 0.13)
  satellite.add(beacon)

  const beaconGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 12),
    new THREE.MeshBasicMaterial({
      color: p.signal,
      transparent: true,
      opacity: p.dark ? 0.24 : 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  beaconGlow.position.copy(beacon.position)
  satellite.add(beaconGlow)

  const beaconLight = new THREE.PointLight(p.signal, p.dark ? 2.8 : 1.1, 2.8, 2)
  beaconLight.position.copy(beacon.position)
  satellite.add(beaconLight)

  return { satellite, beacon, beaconGlow, beaconLight }
}

/**
 * Render de la escena WebGL. El componente solo entrega el contenedor,
 * el tema y el estado de fallback; aquí vive todo el ciclo de render.
 */
export function usePlanetRenderer(theme: MaybeRefOrGetter<Theme>) {
  const containerRef = shallowRef<HTMLDivElement | null>(null)
  const setContainer = (el: unknown) => {
    containerRef.value = el as HTMLDivElement | null
  }
  const failed = ref(false)
  let cleanup: (() => void) | undefined

  function initialize() {
    const container = containerRef.value
    if (!container) return

    const p = getPalette(toValue(theme))
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      failed.value = true
      return
    }
    failed.value = false

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = p.dark ? 1.12 : 1.04
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0.15, 8.4)

    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(p.glow) },
        uAuroraColor: { value: new THREE.Color(p.dark ? p.glow : 0x6abda7) },
        uStrength: { value: p.dark ? 0.035 : 0.12 },
        uAuroraStrength: { value: p.dark ? 0 : 1 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAuroraColor;
        uniform float uStrength;
        uniform float uAuroraStrength;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 centered = (vUv - 0.5) * 2.0;
          float radius = length(centered);
          float haze = exp(-radius * radius * 4.2) + 0.18 * exp(-radius * radius * 1.3);
          float x = centered.x;
          float wave = 0.14 * sin(x * 3.0 + uTime * 0.36) + 0.065 * sin(x * 7.0 - uTime * 0.24);
          float mainCurtain = exp(-pow(centered.y - wave, 2.0) * 12.0);
          float upperCurtain = exp(-pow(centered.y - wave - 0.18 - 0.04 * sin(x * 4.2 - uTime * 0.2), 2.0) * 18.0);
          float curtains = (mainCurtain + upperCurtain * 0.44) * exp(-x * x * 1.3) * exp(-radius * radius * 0.42);
          float colorShift = 0.5 + 0.5 * sin(x * 2.0 - uTime * 0.16);
          vec3 aurora = mix(uColor, uAuroraColor, colorShift * 0.75);
          float alpha = haze * uStrength + curtains * uStrength * uAuroraStrength * 0.95;
          gl_FragColor = vec4(aurora, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const nebula = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), nebulaMaterial)
    nebula.position.z = -2.2
    scene.add(nebula)

    scene.add(new THREE.AmbientLight(p.ambient, p.ambientIntensity))
    const key = new THREE.DirectionalLight(0xffffff, p.dark ? 2.1 : 1.55)
    key.position.set(4.5, 5, 6)
    scene.add(key)
    const rimLight = new THREE.PointLight(p.glow, p.dark ? 26 : 5.5, 22, 2)
    rimLight.position.set(-4.5, -1.5, 4)
    scene.add(rimLight)
    const fillLight = new THREE.PointLight(p.glow, p.dark ? 9 : 2, 16, 2)
    fillLight.position.set(4, -3.2, -1.5)
    scene.add(fillLight)

    const planet = new THREE.Group()
    scene.add(planet)

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 72, 72),
      new THREE.MeshStandardMaterial({
        color: p.core,
        roughness: p.dark ? 0.58 : 0.78,
        metalness: p.dark ? 0.34 : 0.12,
        emissive: new THREE.Color(p.coreEmissive),
        emissiveIntensity: p.dark ? 0.5 : 0.12,
      }),
    )
    planet.add(core)

    const radius = 1.455
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: p.grid,
      transparent: true,
      opacity: p.dark ? 0.25 : 0.42,
      depthWrite: false,
    })
    const addGridLine = (points: THREE.Vector3[], closed: boolean) => {
      const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal')
      const geometry = new THREE.TubeGeometry(curve, closed ? 96 : 64, 0.012, 5, closed)
      planet.add(new THREE.Mesh(geometry, gridMaterial))
    }
    const latCount = 11
    for (let i = 1; i < latCount; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / latCount
      const ringRadius = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const points: THREE.Vector3[] = []
      for (let j = 0; j < 96; j += 1) {
        const angleAround = (j / 96) * Math.PI * 2
        points.push(
          new THREE.Vector3(
            Math.cos(angleAround) * ringRadius,
            y,
            Math.sin(angleAround) * ringRadius,
          ),
        )
      }
      addGridLine(points, true)
    }
    for (let i = 0; i < 24; i += 1) {
      const lon = (i / 24) * Math.PI * 2
      const points: THREE.Vector3[] = []
      for (let j = 0; j <= 64; j += 1) {
        const latitude = -Math.PI / 2 + (j / 64) * Math.PI
        points.push(
          new THREE.Vector3(
            Math.cos(latitude) * Math.cos(lon) * radius,
            Math.sin(latitude) * radius,
            Math.cos(latitude) * Math.sin(lon) * radius,
          ),
        )
      }
      addGridLine(points, false)
    }

    const rand = seededRandom(1337)
    const landPositions: number[] = []
    const cityPositions: number[] = []
    const cityBands: THREE.Vector3[][] = Array.from({ length: 6 }, () => [])
    const dotCount = 6500
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < dotCount; i += 1) {
      const y = 1 - (i / (dotCount - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const v = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
      if (continentNoise(v) > 0) {
        const pos = v.clone().multiplyScalar(1.466)
        landPositions.push(pos.x, pos.y, pos.z)
        if (rand() > 0.88) {
          const band = Math.min(cityBands.length - 1, Math.floor(((y + 1) / 2) * cityBands.length))
          if (cityBands[band]!.length < 8) cityBands[band]!.push(v.clone())
        }
      }
    }
    const cityPoints = cityBands.flat()
    cityPoints.forEach((point) => {
      const position = point.clone().multiplyScalar(1.466)
      cityPositions.push(position.x * 1.004, position.y * 1.004, position.z * 1.004)
    })
    const landGeometry = new THREE.BufferGeometry()
    landGeometry.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3))
    planet.add(
      new THREE.Points(
        landGeometry,
        new THREE.PointsMaterial({
          color: p.dots,
          size: p.dark ? 0.028 : 0.024,
          transparent: true,
          opacity: p.dark ? 0.96 : 0.86,
          depthWrite: false,
          blending: THREE.NormalBlending,
          sizeAttenuation: true,
        }),
      ),
    )
    const cityGeometry = new THREE.BufferGeometry()
    cityGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cityPositions, 3))
    planet.add(
      new THREE.Points(
        cityGeometry,
        new THREE.PointsMaterial({
          color: p.bright,
          size: p.dark ? 0.05 : 0.05,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      ),
    )

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(p.glow) },
          uStrength: { value: p.glowIntensity },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.8);
            gl_FragColor = vec4(uColor, rim * uStrength * 0.34);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    atmosphere.scale.setScalar(1.12)
    scene.add(atmosphere)

    const arcs: {
      curve: THREE.QuadraticBezierCurve3
      pulse: THREE.Mesh
      speed: number
      offset: number
    }[] = []
    const routeMaterial = new THREE.MeshBasicMaterial({
      color: p.arc,
      transparent: true,
      opacity: p.dark ? 0.54 : 0.36,
      depthWrite: false,
    })
    const arcCount = Math.min(9, Math.floor(cityPoints.length / 3))
    for (let i = 0; i < arcCount; i += 1) {
      const a = cityPoints[(i * 3) % cityPoints.length]
      const b = cityPoints[(i * 3 + Math.floor(cityPoints.length / 3) + 2) % cityPoints.length]
      if (!a || !b) continue
      const start = a.clone().multiplyScalar(1.462)
      const end = b.clone().multiplyScalar(1.462)
      const distance = start.distanceTo(end)
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1.462 + distance * 0.44)
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const geometry = new THREE.TubeGeometry(curve, 48, 0.009, 5, false)
      planet.add(new THREE.Mesh(geometry, routeMaterial))

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 12, 12),
        new THREE.MeshBasicMaterial({ color: p.pulse }),
      )
      planet.add(pulse)
      arcs.push({ curve, pulse, speed: 0.1 + (i % 4) * 0.028, offset: i / arcCount })
    }

    const orbitGroup = new THREE.Group()
    orbitGroup.rotation.x = Math.PI / 2.18
    orbitGroup.rotation.z = -0.15
    planet.add(orbitGroup)
    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, 0.008, 6, 220),
      new THREE.MeshBasicMaterial({
        color: p.ring,
        transparent: true,
        opacity: p.dark ? 0.7 : 0.46,
      }),
    )
    orbitGroup.add(ringA)
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(1.84, 0.006, 6, 200),
      new THREE.MeshBasicMaterial({
        color: p.ring,
        transparent: true,
        opacity: p.dark ? 0.3 : 0.28,
      }),
    )
    orbitGroup.add(ringB)

    const satOrbit = new THREE.Group()
    satOrbit.rotation.x = Math.PI / 2.18
    satOrbit.rotation.z = -0.15
    planet.add(satOrbit)
    const orbitRadius = 2.12
    const orbitPoints: THREE.Vector3[] = []
    for (let i = 0; i <= 180; i += 1) {
      const a = (i / 180) * Math.PI * 2
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * orbitRadius, Math.sin(a) * orbitRadius, 0))
    }
    const orbitLineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
    const orbitLine = new THREE.Line(
      orbitLineGeometry,
      new THREE.LineDashedMaterial({
        color: p.ring,
        transparent: true,
        opacity: p.dark ? 0.35 : 0.3,
        dashSize: 0.05,
        gapSize: 0.11,
      }),
    )
    orbitLine.computeLineDistances()
    satOrbit.add(orbitLine)

    const { satellite, beacon, beaconGlow, beaconLight } = buildSatellite(p)
    const orbitSpin = new THREE.Group()
    const satHolder = new THREE.Group()
    satHolder.position.set(orbitRadius, 0, 0)
    satellite.rotation.set(0.24, -0.5, 0.3)
    satellite.scale.setScalar(0.82)
    satHolder.add(satellite)
    orbitSpin.add(satHolder)
    orbitSpin.add(orbitLine)
    satOrbit.add(orbitSpin)

    const starRand = seededRandom(90210)
    const starCount = p.dark ? 1100 : 850
    const starPositions: number[] = []
    const accentStarPositions: number[] = []
    for (let i = 0; i < starCount; i += 1) {
      const r = 9 + starRand() * 21
      const theta = starRand() * Math.PI * 2
      const phi = Math.acos(2 * starRand() - 1)
      const position = [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ]
      starPositions.push(...position)
      if (starRand() > (p.dark ? 0.91 : 0.94)) accentStarPositions.push(...position)
    }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const stars = new THREE.Group()
    stars.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: p.star,
          size: p.dark ? 0.055 : 0.075,
          transparent: true,
          opacity: p.starOpacity,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      ),
    )
    const accentStarGeometry = new THREE.BufferGeometry()
    accentStarGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(accentStarPositions, 3),
    )
    stars.add(
      new THREE.Points(
        accentStarGeometry,
        new THREE.PointsMaterial({
          color: p.starAccent,
          size: p.dark ? 0.075 : 0.105,
          transparent: true,
          opacity: p.dark ? 0.92 : 0.68,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      ),
    )
    scene.add(stars)

    const layout = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (!w || !h) return
      const mobile = w < 860
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      const scale = mobile ? 0.68 : 0.86
      const planetX = mobile
        ? 0.15
        : Math.max(1.0, Math.min(6.0, (6.0 * 860) / Math.max(container.clientWidth, 860)))
      planet.position.set(planetX, mobile ? -1.35 : -0.1, 0)
      planet.scale.setScalar(scale)
      nebula.position.set(planetX, mobile ? -1.35 : -0.1, -2.2)
      const nebulaSize = mobile ? 6.8 : 7.6
      nebula.scale.set(nebulaSize, nebulaSize, 1)
      atmosphere.position.copy(planet.position)
      atmosphere.scale.setScalar(scale * 1.12)
      camera.position.z = mobile ? 9.6 : 8.8
      camera.updateProjectionMatrix()
    }
    layout()

    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const dragTarget = { x: 0, y: 0 }
    const currentDrag = { x: 0, y: 0 }
    let isDragging = false
    let lastDragPos = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      pointer.x = (event.clientX / w - 0.5) * 2
      pointer.y = (event.clientY / h - 0.5) * 2

      if (isDragging) {
        const deltaX = event.clientX - lastDragPos.x
        const deltaY = event.clientY - lastDragPos.y
        dragTarget.x += deltaX * 0.005
        dragTarget.y += deltaY * 0.005
        lastDragPos = { x: event.clientX, y: event.clientY }
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      isDragging = true
      lastDragPos = { x: event.clientX, y: event.clientY }
      container.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }

    const onPointerUp = () => {
      isDragging = false
      container.style.cursor = 'grab'
      document.body.style.userSelect = ''
    }

    container.style.cursor = 'grab'
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(container)

    const clock = new THREE.Clock()
    let frame = 0
    let visible = true
    const onVisibility = () => {
      visible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!visible) return
      const t = clock.getElapsedTime()
      const speed = reducedMotion ? 0 : 1
      nebulaMaterial.uniforms.uTime!.value = t * speed

      currentDrag.x += (dragTarget.x - currentDrag.x) * 0.08
      currentDrag.y += (dragTarget.y - currentDrag.y) * 0.08

      planet.rotation.y = t * 0.035 * speed + currentDrag.x
      planet.rotation.x = currentDrag.y

      orbitGroup.rotation.z = -0.15 + Math.sin(t * 0.14) * 0.02 * speed
      orbitSpin.rotation.z = 3.32 + t * 0.12 * speed
      satellite.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.05 * speed
      beaconLight.intensity = p.dark
        ? 1.8 + Math.sin(t * 3.4) * 0.6
        : 0.75 + Math.sin(t * 3.4) * 0.25
      beacon.scale.setScalar(0.8 + Math.sin(t * 3.4) * 0.25)
      beaconGlow.scale.setScalar(1.1 + Math.sin(t * 3.4) * 0.2)

      arcs.forEach((arc) => {
        const progress = (t * arc.speed + arc.offset) % 1
        arc.pulse.position.copy(arc.curve.getPointAt(progress))
        const fade = Math.sin(progress * Math.PI)
        arc.pulse.scale.setScalar(0.5 + fade * 0.8)
      })

      stars.rotation.y = t * 0.006 * speed + currentDrag.x * 0.2
      stars.rotation.x = t * 0.002 * speed + currentDrag.y * 0.2

      target.x += (pointer.x * 0.34 - target.x) * 0.035
      target.y += (pointer.y * 0.22 - target.y) * 0.035
      camera.position.x = target.x
      camera.position.y = 0.15 - target.y
      camera.lookAt(planet.position.x * 0.42, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    cleanup = () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      document.body.style.userSelect = ''
      document.removeEventListener('visibilitychange', onVisibility)
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
          object.geometry?.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach((m) => m.dispose())
          else material?.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
    }
  }

  onMounted(() => {
    initialize()
    watch(
      () => toValue(theme),
      () => {
        cleanup?.()
        initialize()
      },
    )
  })
  onBeforeUnmount(() => cleanup?.())

  return { failed, setContainer }
}
