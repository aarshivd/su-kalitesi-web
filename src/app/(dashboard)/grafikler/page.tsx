'use client'

import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { DeviceFilter } from '@/components/dashboard/device-filter'
import { ParameterSelector } from '@/components/charts/parameter-selector'
import { DateRangePicker } from '@/components/charts/date-range-picker'
import { ChartExportButton } from '@/components/charts/chart-export-button'
import { TimeSeriesChart } from '@/components/charts/time-series-chart'

export default function GrafiklerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Grafikler"
        description="Parametre bazlı zaman serisi grafikleri"
      >
        <ChartExportButton />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="space-y-5 py-4">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Cihaz
              </p>
              <DeviceFilter />
            </div>
            <DateRangePicker />
            <ParameterSelector />
          </CardContent>
        </Card>
        <TimeSeriesChart />
      </div>
    </div>
  )
}
