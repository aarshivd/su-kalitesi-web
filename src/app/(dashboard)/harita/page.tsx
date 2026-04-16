'use client'

import dynamic from 'next/dynamic'
import { PageHeader } from '@/components/common/page-header'
import { DeviceSidebar } from '@/components/map/device-sidebar'
import { Skeleton } from '@/components/ui/skeleton'

const WaterQualityMap = dynamic(
  () => import('@/components/map/water-quality-map'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
)

export default function HaritaPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader
        title="Harita"
        description="Cihaz konumları ve güncel su kalitesi durumları"
      />
      <div className="grid flex-1 gap-4 lg:grid-cols-[280px_1fr] min-h-[600px]">
        <aside className="hidden lg:block">
          <DeviceSidebar />
        </aside>
        <div className="h-full min-h-[600px]">
          <WaterQualityMap />
        </div>
      </div>
    </div>
  )
}
