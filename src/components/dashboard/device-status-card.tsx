'use client'

import { Cpu, WifiOff, Wifi } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDevices } from '@/hooks/use-devices'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const ONLINE_WINDOW_MS = 5 * 60 * 1000

export function DeviceStatusCard() {
  const { data: devices, isLoading: devicesLoading } = useDevices()

  const { data: latestByDevice, isLoading: latestLoading } = useQuery({
    queryKey: ['device-latest-timestamps'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('measurements')
        .select('device_id, timestamp')
        .order('timestamp', { ascending: false })
        .limit(500)
      if (error) throw error
      const map = new Map<string, string>()
      for (const row of data ?? []) {
        if (!map.has(row.device_id)) map.set(row.device_id, row.timestamp)
      }
      return map
    },
    refetchInterval: 30_000,
  })

  const loading = devicesLoading || latestLoading

  if (loading || !devices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="size-4" /> Cihaz Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24" />
        </CardContent>
      </Card>
    )
  }

  const now = Date.now()
  const classified = devices.map((d) => {
    const ts = latestByDevice?.get(d.id)
    const online = ts ? now - new Date(ts).getTime() < ONLINE_WINDOW_MS : false
    return { ...d, online }
  })
  const total = classified.length
  const onlineCount = classified.filter((d) => d.online).length
  const offlineCount = total - onlineCount
  const pct = total ? Math.round((onlineCount / total) * 100) : 0
  const offline = classified.filter((d) => !d.online).slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="size-4" /> Cihaz Durumu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold leading-none">{onlineCount}</span>
          <span className="pb-1 text-sm text-muted-foreground">/ {total} aktif</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <Wifi className="size-3 text-emerald-500" /> {onlineCount} çevrimiçi
          </span>
          <span className="flex items-center gap-1.5">
            <WifiOff className="size-3 text-destructive" /> {offlineCount} çevrimdışı
          </span>
        </div>
        {offline.length > 0 && (
          <div className="space-y-1 border-t border-border pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Çevrimdışı
            </p>
            {offline.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className={cn('size-1.5 rounded-full bg-destructive')} />
                <span className="truncate">{d.device_name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
