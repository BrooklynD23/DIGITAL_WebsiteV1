import { cn } from '@/lib/utils';
import {
  Plus,
  AtSign,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Wrench,
  MessageSquare,
  Check,
  CheckCircle2,
  Code,
  PenTool,
  Plug,
  Calendar,
  Lightbulb,
  Link as LinkIcon,
  MapPin,
  Mail,
  Cpu,
  Bell,
  Contact,
  Camera,
  Factory,
  Globe,
  Rocket,
  Clock,
  GraduationCap,
  Search,
  SearchX,
  Smartphone,
  ChevronDown,
  BatteryCharging,
  Building2,
  Presentation,
  Users,
  Network,
  UserPlus,
  UsersRound,
  Headset,
  Award,
  Briefcase,
  Handshake,
  HeartHandshake,
  Vibrate,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps legacy `material-symbols-outlined` names (used across the repo's
 * data + pages) to Lucide equivalents. Add entries here as new names appear.
 */
const iconMap: Record<string, LucideIcon> = {
  add: Plus,
  alternate_email: AtSign,
  arrow_forward: ArrowRight,
  arrow_outward: ArrowUpRight,
  article: FileText,
  battery_charging_full: BatteryCharging,
  build: Wrench,
  business: Building2,
  camera: Camera,
  chat: MessageSquare,
  check: Check,
  check_circle: CheckCircle2,
  co_present: Presentation,
  code: Code,
  design_services: PenTool,
  electrical_services: Plug,
  event: Calendar,
  expand_more: ChevronDown,
  groups: UsersRound,
  handshake: Handshake,
  hub: Network,
  lightbulb: Lightbulb,
  link: LinkIcon,
  location_on: MapPin,
  mail: Mail,
  memory: Cpu,
  notifications: Bell,
  perm_contact_calendar: Contact,
  person_add: UserPlus,
  photo_camera: Camera,
  podium: Presentation,
  precision_manufacturing: Factory,
  public: Globe,
  rocket_launch: Rocket,
  schedule: Clock,
  school: GraduationCap,
  search: Search,
  search_off: SearchX,
  smartphone: Smartphone,
  supervisor_account: Users,
  support_agent: Headset,
  vibration: Vibrate,
  volunteer_activism: HeartHandshake,
  work: Briefcase,
  workspace_premium: Award,
};

const sizeMap: Record<NonNullable<IconProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

interface IconProps {
  /** material-symbols name (legacy) or a Lucide icon key */
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Accessible label; when omitted the icon is decorative (aria-hidden) */
  label?: string;
}

/**
 * Thin Lucide wrapper. Renders an SVG icon by `name` using the
 * material-symbols → Lucide map. Unknown names fall back to a circle-less
 * dev warning + null render.
 */
export function Icon({ name, className, size = 'md', label }: IconProps) {
  const LucideComp = iconMap[name];

  if (!LucideComp) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] No Lucide mapping for "${name}".`);
    }
    return null;
  }

  return (
    <LucideComp
      className={cn('inline-block shrink-0', className)}
      size={sizeMap[size]}
      strokeWidth={1.75}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
