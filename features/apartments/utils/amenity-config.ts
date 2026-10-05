import {
  AirVent,
  Check,
  Dumbbell,
  Flower2,
  Mountain,
  ParkingCircle,
  PawPrint,
  Sun,
  Trees,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react"

const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  airconditioning: AirVent,
  parking: ParkingCircle,
  petfriendly: PawPrint,
  pool: Waves,
  gym: Dumbbell,
  spa: Flower2,
  terrace: Sun,
  mountainview: Mountain,
  gardenview: Trees,
}

/** "Wi-Fi", "wifi" and "WiFi" all resolve to "wifi". */
export function getAmenityKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "")
}

export function getAmenityIcon(key: string): LucideIcon {
  return AMENITY_ICONS[key] ?? Check
}
