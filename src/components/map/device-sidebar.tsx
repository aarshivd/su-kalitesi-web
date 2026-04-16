'use client'

import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeviceLatestLocations } from '@/hooks/use-device-latest-locations'
import { useDeviceStore } from '@/stores/device-store'
import { useDevices } from '@/hooks/use-devices'
import { measurementSeverity } from '@/lib/water-quality'
import { SEVERITY_CLASSES } from '@/lib/constants/palette'
import { cn } from '@/lib/utils'

export function DeviceSidebar() {
  const { data = [] } = useDeviceLatestLocations()
  const { data: allDevices = [] } = useDevices()
  const selected = useDeviceStore((s) => s.selectedDevice)
  const setSelected = useDeviceStore((s) => s.setSelectedDevice)

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-4" /> Cihazlar
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-y-auto pt-0">
        {data.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Konum bilgisi olan cihaz yok
          </p>
        ) : (
          <ul className="space-y-1">
            {data.map((loc) => {
              const sev = measurementSeverity(loc.measurement)
              const active = selected?.id === loc.device_id
              return (
                <li key={loc.device_id}>
                  <button
                    type="button"
                    onClick={() => {
                      const dev = allDevices.find((d) => d.id === loc.device_id)
                      setSelected(dev ?? null)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-accent'
                    )}
                  >
                    <span
                      className={cn('size-2 rounded-full', SEVERITY_CLASSES[sev].dot)}
                    />
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {loc.device_name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
