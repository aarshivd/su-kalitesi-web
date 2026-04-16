import { DEFAULT_THRESHOLDS, PARAMETER_KEYS, type ParameterKey } from '@/lib/constants/thresholds'

export type Severity = 'ok' | 'warning' | 'critical'

/**
 * Bir ölçüm değerinin şiddetini hesaplar.
 * critical → min/max'ın dışında
 * warning  → warning aralığının dışında ama min/max içinde
 * ok       → warning aralığı içinde
 */
export function getSeverity(parameter: string, value: number | null | undefined): Severity {
  if (value == null) return 'ok'
  const threshold = DEFAULT_THRESHOLDS[parameter as ParameterKey]
  if (!threshold) return 'ok'

  const { min, max, warningMin, warningMax } = threshold

  if (value < min || value > max) return 'critical'
  if (value < warningMin || value > warningMax) return 'warning'
  return 'ok'
}

/** Birden fazla parametre arasından en yüksek şiddeti döner */
export function aggregateSeverity(severities: Severity[]): Severity {
  if (severities.includes('critical')) return 'critical'
  if (severities.includes('warning')) return 'warning'
  return 'ok'
}

/** Parametre adından okunabilir etiket döner */
export function getParameterLabel(parameter: string): string {
  return DEFAULT_THRESHOLDS[parameter as ParameterKey]?.label ?? parameter
}

/** Parametre birimi */
export function getParameterUnit(parameter: string): string {
  return DEFAULT_THRESHOLDS[parameter as ParameterKey]?.unit ?? ''
}

/** Pil voltajını 0-100 yüzde olarak verir (3.2V = %0, 4.2V = %100) */
export function batteryPercent(voltage: number | null | undefined): number {
  if (voltage == null) return 0
  const min = 3.2
  const max = 4.2
  const pct = ((voltage - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
}

/** Bir ölçüm satırındaki her parametreyi kontrol edip en yüksek şiddeti döner */
export function measurementSeverity(row: {
  ph?: number | null
  tds?: number | null
  turbidity?: number | null
  temperature?: number | null
  battery_voltage?: number | null
}): Severity {
  return aggregateSeverity(
    PARAMETER_KEYS.map((k) => getSeverity(k, row[k] as number | null | undefined))
  )
}
