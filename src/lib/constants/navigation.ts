import {
  LayoutDashboard,
  Map,
  BarChart3,
  Table2,
  Cpu,
  Bell,
  Settings,
  Sliders,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'İzleme',
    items: [
      { title: 'Harita', href: '/harita', icon: Map },
      { title: 'Grafikler', href: '/grafikler', icon: BarChart3 },
      { title: 'Veri Tablosu', href: '/veri', icon: Table2 },
    ],
  },
  {
    label: 'Yönetim',
    items: [
      { title: 'Cihazlar', href: '/cihazlar', icon: Cpu },
      { title: 'Alarmlar', href: '/alarmlar', icon: Bell },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { title: 'Ayarlar', href: '/ayarlar', icon: Settings },
      { title: 'Eşik Değerleri', href: '/ayarlar/esikler', icon: Sliders },
    ],
  },
]
