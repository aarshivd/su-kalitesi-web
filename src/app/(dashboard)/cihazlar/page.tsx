import type { Metadata } from 'next'
import { Cpu } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { DeviceCard } from '@/components/devices/device-card'
import { getDevices } from '@/lib/queries/devices.server'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTR } from '@/lib/format'

export const metadata: Metadata = { title: 'Cihazlar' }

const ONLINE_WINDOW_MS = 5 * 60 * 1000

export default async function CihazlarPage() {
  const devices = await getDevices()

  const supabase = await createClient()
  const { data: latest } = await supabase
    .from('measurements')
    .select('device_id, timestamp')
    .order('timestamp', { ascending: false })
    .limit(500)

  const latestMap = new Map<string, string>()
  for (const row of latest ?? []) {
    if (!latestMap.has(row.device_id)) latestMap.set(row.device_id, row.timestamp)
  }
  const now = Date.now()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cihazlar"
        description="Kayıtlı IoT sensör cihazları"
      />

      {devices.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="Henüz cihaz yok"
          description="İlk IoT cihazınızı ekleyerek izlemeye başlayın"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => {
            const ts = latestMap.get(d.id)
            const online = ts ? now - new Date(ts).getTime() < ONLINE_WINDOW_MS : false
            return (
              <DeviceCard
                key={d.id}
                device={d}
                online={online}
                lastSeen={ts ? formatRelativeTR(ts) : null}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
