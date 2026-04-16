/**
 * Recharts için ortak tema nesneleri.
 * CSS değişkenlerini okur → light/dark otomatik.
 */
export const chartGrid = {
  strokeDasharray: '3 3',
  stroke: 'oklch(0 0 0 / 8%)',
  strokeWidth: 1,
}

export const chartAxis = {
  tick: { fontSize: 11, fill: 'var(--muted-foreground)' },
  axisLine: false,
  tickLine: false,
}

export const chartTooltipStyle = {
  backgroundColor: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  color: 'var(--popover-foreground)',
  fontSize: '0.8125rem',
  boxShadow:
    '0 4px 6px -1px oklch(0 0 0 / 10%), 0 2px 4px -2px oklch(0 0 0 / 10%)',
}

export { CHART_COLORS } from '@/lib/constants/palette'
