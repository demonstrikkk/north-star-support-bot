import {
  ArrowLeft,
  Backpack,
  Check,
  ExternalLink,
  Footprints,
  Headphones,
  Home,
  MessageCircle,
  Mountain,
  Package,
  RotateCcw,
  Search,
  Snowflake,
  Sparkles,
  TentTree,
  Truck,
} from 'lucide-react'

const icons = {
  package: Package,
  'rotate-ccw': RotateCcw,
  mountain: Mountain,
  truck: Truck,
  headphones: Headphones,
  home: Home,
  search: Search,
  check: Check,
  'external-link': ExternalLink,
  footprints: Footprints,
  tent: TentTree,
  backpack: Backpack,
  snowflake: Snowflake,
  'arrow-left': ArrowLeft,
  sparkles: Sparkles,
  'message-circle': MessageCircle,
}

export function Icon({ name, className = 'h-4 w-4' }: { name?: string | null; className?: string }) {
  const Component = name ? icons[name as keyof typeof icons] : Sparkles
  return <Component className={className} aria-hidden="true" />
}
