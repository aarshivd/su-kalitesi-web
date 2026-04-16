'use client'

import { Droplets, Gauge, Eye, ThermometerSun, BatteryCharging } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/common/stat-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMeasurements } from '@/hooks/use-measurements'
import { useRealtimeMeasurements } from '@/hooks/use-realtime-measurements'
import { useDeviceStore } from '@/stores/device-store'
import { getSeverity, batteryPercent } from '@/lib/water-quality'
import { formatNumber } from '@/lib/format'
import { DEFAULT_THRESHOLDS, type ParameterKey } from '@/lib/constants/thresholds'
import type { MeasurementWithDevice } from '@/lib/queries/measurements'

type Row = MeasurementWithDevice

const PARAM_META: Record<
  ParameterKey,
  { icon: LucideIcon; digits: number; getVal: (r: Row) => number | null }
> = {
  ph: { icon: Droplets, digits: 2, getVal: (r) => r.ph },
  tds: { icon: Gauge, digits: 0, getVal: (r) => r.tds },
  turbidity: { icon: Eye, digits: 1, getVal: (r) => r.turbidity },
  temperature: { icon: ThermometerSun, digits: 1, getVal: (r) => r.temperature },
  battery_voltage: {
    icon: BatteryCharging,
    digits: 0,
    getVal: (r) => r.battery_voltage,
  },
}

const ORDER: ParameterKey[] = ['ph', 'tds', 'turbidity', 'temperature', 'battery_voltage']

export function KPIGrid() {
  const selected = useDeviceStore((s) => s.selectedDevice)
  useRealtimeMeasurements(selected?.id)

  const { data, isLoading } = useMeasurements({
    deviceId: selected?.id,
    limit: 20,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {ORDER.map((k) => (
          <Skeleton key={k} className="h-[120px] rounded-xl" />
        ))}
      </div>
    )
  }

  const rows = (data ?? []) as Row[]
  const latest = rows[0]
  const prev = rows[1]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {ORDER.map((key) => {
        const meta = PARAM_META[key]
        const threshold = DEFAULT_THRESHOLDS[key]
        const val = latest ? meta.getVal(latest) : null
        const prevVal = prev ? meta.getVal(prev) : null

        const isBattery = key === 'battery_voltage'
        const displayValue =
          val == null
            ? '—'
            : isBattery
              ? `${batteryPercent(val)}`
              : formatNumber(val, {
                  minimumFractionDigits: meta.digits,
                  maximumFractionDigits: meta.digits,
                })
        const unit = isBattery ? '%' : threshold.unit

        const status = getSeverity(key, val)

        let trendValue: string | undefined
        if (val != null && prevVal != null) {
          const diff = val - prevVal
          const sign = diff > 0 ? '+' : ''
          trendValue = `${sign}${formatNumber(diff, { maximumFractionDigits: 2 })} ${threshold.unit}`
        }

        return (
          <StatCard
            key={key}
            title={threshold.label}
            value={displayValue}
            unit={unit}
            icon={meta.icon}
            status={status}
            trendValue={trendValue}
          />
        )
      })}
    </div>
  )
}
