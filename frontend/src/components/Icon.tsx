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
  RefreshCcw,
  RotateCcw,
  Search,
  Snowflake,
  Sparkles,
  Star,
  TentTree,
  Truck,
} from 'lucide-react'

const icons = {
  package: Package,
  'rotate-ccw': RotateCcw,
  'refresh-ccw': RefreshCcw,
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
  star: Star,
}

export function Icon({ name, className = 'h-4 w-4' }: { name?: string | null; className?: string }) {
  const Component = name ? icons[name as keyof typeof icons] : Sparkles
  return <Component className={className} aria-hidden="true" />
}
