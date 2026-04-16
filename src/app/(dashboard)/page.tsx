import type { Metadata } from 'next'
import { PageHeader } from '@/components/common/page-header'
import { KPIGrid } from '@/components/dashboard/kpi-grid'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { DeviceStatusCard } from '@/components/dashboard/device-status-card'
import { ActiveAlertsCard } from '@/components/dashboard/active-alerts-card'
import { DeviceFilter } from '@/components/dashboard/device-filter'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Tüm cihazların anlık su kalitesi özeti"
      >
        <DeviceFilter />
      </PageHeader>

      <KPIGrid />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DeviceStatusCard />
        </div>
        <div className="lg:col-span-2">
          <ActiveAlertsCard />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
