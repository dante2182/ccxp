import {
  Activity,
  BatteryCharging,
  Building2,
  Cable,
  Camera,
  Database,
  Factory,
  Flame,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  Leaf,
  LockKeyhole,
  Network,
  RadioTower,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from '@lucide/vue'

export const serviceIcons: Record<string, LucideIcon> = {
  telecom: RadioTower,
  network: Network,
  security: ShieldCheck,
  energy: BatteryCharging,
}

export const categoryIcons: Record<string, LucideIcon> = {
  telecom: RadioTower,
  security: ShieldCheck,
  energy: BatteryCharging,
}

export const featureIcons = {
  cable: Cable,
  server: Server,
  database: Database,
  lock: LockKeyhole,
  camera: Camera,
  flame: Flame,
  leaf: Leaf,
}

export const sectorIcons = [Building2, Factory, Landmark, HeartPulse, GraduationCap, Store]

export const capabilityIcons: Record<string, LucideIcon> = {
  fibra: Activity,
  '5g': Sparkles,
  seguridad: ShieldCheck,
  energia: Headphones,
}
