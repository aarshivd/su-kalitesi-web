'use client'

import Link from 'next/link'
import { Activity, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { useMeasurements } from '@/hooks/use-measurements'
import { formatRelativeTR } from '@/lib/format'
import { measurementSeverity } from '@/lib/water-quality'
import { SEVERITY_CLASSES, SEVERITY_LABEL } from '@/lib/constants/palette'
import { cn } from '@/lib/utils'

export function RecentActivity() {
  const { data, isLoading } = useMeasurements({ limit: 10 })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4" />
          Son Aktiviteler
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={Activity} title="Henüz ölçüm yok" />
        ) : (
          <ul className="divide-y divide-border">
            {data.map((m) => {
              const sev = measurementSeverity(m)
              return (
                <li key={m.id}>
                  <Link
                    href={`/cihazlar/${m.device_id}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-accent/40 rounded-md px-2 -mx-2 transition-colors"
                  >
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        SEVERITY_CLASSES[sev].dot
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {m.devices?.device_name ?? 'Cihaz'}
                        </p>
                        <span
                          className={cn(
                            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                            SEVERITY_CLASSES[sev].badge
                          )}
                        >
                          {SEVERITY_LABEL[sev]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        pH {m.ph ?? '—'} · TDS {m.tds ?? '—'} · {m.temperature ?? '—'}°C ·{' '}
                        {formatRelativeTR(m.timestamp)}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
