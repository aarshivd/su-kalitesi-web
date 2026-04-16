'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { chartAxis, chartGrid, chartTooltipStyle } from '@/lib/chart-theme'
import { CHART_COLORS } from '@/lib/constants/palette'
import { DEFAULT_THRESHOLDS, PARAMETER_KEYS } from '@/lib/constants/thresholds'
import { formatDateTimeTR } from '@/lib/format'
import type { MeasurementWithDevice } from '@/lib/queries/measurements'

export function DeviceDetailChart({ data }: { data: MeasurementWithDevice[] }) {
  const rows = [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((m) => ({
      timestamp: m.timestamp,
      ph: m.ph,
      tds: m.tds,
      turbidity: m.turbidity,
      temperature: m.temperature,
      battery_voltage: m.battery_voltage,
    }))

  return (
    <Card className="h-[420px]">
      <CardHeader>
        <CardTitle>Son 50 Ölçüm</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] p-4">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Ölçüm yok
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
              {PARAMETER_KEYS.map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  name={DEFAULT_THRESHOLDS[k].label}
                  stroke={CHART_COLORS[k]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
