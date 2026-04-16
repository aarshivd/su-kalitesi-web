'use client'

import { forwardRef, useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMeasurements } from '@/hooks/use-measurements'
import { useFilterStore } from '@/stores/filter-store'
import { useDeviceStore } from '@/stores/device-store'
import { chartAxis, chartGrid, chartTooltipStyle } from '@/lib/chart-theme'
import { CHART_COLORS } from '@/lib/constants/palette'
import { DEFAULT_THRESHOLDS } from '@/lib/constants/thresholds'
import { formatDateTimeTR } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const TimeSeriesChart = forwardRef<HTMLDivElement>(
  function TimeSeriesChart(_props, ref) {
    const selected = useFilterStore((s) => s.selectedParameters)
    const dateRange = useFilterStore((s) => s.dateRange)
    const device = useDeviceStore((s) => s.selectedDevice)

    const { data, isLoading } = useMeasurements({
      deviceId: device?.id,
      from: dateRange.from,
      to: dateRange.to,
      limit: 500,
    })

    const rows = useMemo(() => {
      const sorted = [...(data ?? [])].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      return sorted.map((m) => ({
        timestamp: m.timestamp,
        ph: m.ph,
        tds: m.tds,
        turbidity: m.turbidity,
        temperature: m.temperature,
        battery_voltage: m.battery_voltage,
      }))
    }, [data])

    if (isLoading) {
      return <Skeleton className="h-[420px] w-full rounded-xl" />
    }

    return (
      <Card ref={ref} className="h-[460px]" id="time-series-chart">
        <CardContent className="h-full p-4">
          {rows.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Seçili aralık için veri yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  dataKey="timestamp"
                  {...chartAxis}
                  tickFormatter={(v) => formatDateTimeTR(v).split(',')[1]?.trim() ?? v}
                  minTickGap={40}
                />
                <YAxis {...chartAxis} width={40} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelFormatter={(v) => formatDateTimeTR(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {selected.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={DEFAULT_THRESHOLDS[key].label}
                    stroke={CHART_COLORS[key]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
                {selected.length === 1 &&
                  (() => {
                    const t = DEFAULT_THRESHOLDS[selected[0]]
                    return (
                      <>
                        <ReferenceLine
                          y={t.min}
                          stroke="var(--destructive)"
                          strokeDasharray="4 4"
                          label={{ value: 'min', fontSize: 10, fill: 'var(--destructive)' }}
                        />
                        <ReferenceLine
                          y={t.max}
                          stroke="var(--destructive)"
                          strokeDasharray="4 4"
                          label={{ value: 'max', fontSize: 10, fill: 'var(--destructive)' }}
                        />
                      </>
                    )
                  })()}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    )
  }
)
