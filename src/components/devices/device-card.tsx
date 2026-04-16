import Link from 'next/link'
import { Cpu, ArrowRight, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Device } from '@/lib/queries/devices'
import { cn } from '@/lib/utils'

interface DeviceCardProps {
  device: Device
  online?: boolean
  lastSeen?: string | null
}

export function DeviceCard({ device, online = false, lastSeen }: DeviceCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cpu className="size-5" />
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase',
              online
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-border bg-muted text-muted-foreground'
            )}
          >
            <span className={cn('size-1.5 rounded-full', online ? 'bg-emerald-500' : 'bg-muted-foreground')} />
            {online ? 'Çevrimiçi' : 'Çevrimdışı'}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight">{device.device_name}</h3>
          {device.location_name && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {device.location_name}
            </p>
          )}
          {device.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {device.description}
            </p>
          )}
        </div>
        {lastSeen && (
          <p className="text-[10px] text-muted-foreground">Son ölçüm: {lastSeen}</p>
        )}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/cihazlar/${device.id}`}>
            Detay <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
