import type { ParameterKey } from './thresholds'

/** Recharts için grafik renkleri — CSS değişkenlerinden okunur */
export const CHART_COLORS: Record<ParameterKey, string> = {
  ph: 'var(--chart-1)',
  tds: 'var(--chart-2)',
  temperature: 'var(--chart-3)',
  turbidity: 'var(--chart-4)',
  battery_voltage: 'var(--chart-5)',
}

/** Alarm şiddetine göre renk sınıfları */
export const SEVERITY_CLASSES = {
  ok: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
  },
  warning: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/30',
  },
  critical: {
    badge: 'bg-destructive/15 text-destructive border-destructive/20',
    dot: 'bg-destructive',
    ring: 'ring-destructive/30',
  },
} as const

export const SEVERITY_LABEL = {
  ok: 'Normal',
  warning: 'Uyarı',
  critical: 'Kritik',
} as const
