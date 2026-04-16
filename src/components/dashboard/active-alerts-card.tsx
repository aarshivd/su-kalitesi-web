'use client'

import Link from 'next/link'
import { AlertTriangle, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { createClient } from '@/lib/supabase/client'
import { getAlertHistoryClient } from '@/lib/queries/alerts'
import { formatRelativeTR, formatNumber } from '@/lib/format'
import { getParameterLabel, getParameterUnit } from '@/lib/water-quality'
import { SEVERITY_CLASSES } from '@/lib/constants/palette'
import { cn } from '@/lib/utils'

const SEVERITY_RANK = { critical: 0, warning: 1, ok: 2 } as const

export function ActiveAlertsCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['alerts', 'active'],
    queryFn: () => getAlertHistoryClient(createClient(), 20),
    refetchInterval: 30_000,
  })

  const sorted = [...(data ?? [])]
    .sort(
      (a, b) =>
        (SEVERITY_RANK[(a.severity ?? 'ok') as keyof typeof SEVERITY_RANK] ?? 2) -
        (SEVERITY_RANK[(b.severity ?? 'ok') as keyof typeof SEVERITY_RANK] ?? 2)
    )
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-4" />
          Aktif Alarmlar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Aktif alarm yok"
            description="Tüm değerler eşik aralıklarında."
          />
        ) : (
          <>
            <ul className="space-y-2">
              {sorted.map((a) => {
                const sev = (a.severity ?? 'ok') as keyof typeof SEVERITY_CLASSES
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <span className={cn('size-2 rounded-full', SEVERITY_CLASSES[sev].dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {a.devices?.device_name ?? 'Cihaz'} —{' '}
                          {getParameterLabel(a.parameter ?? '')}
                        </p>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase',
                            SEVERITY_CLASSES[sev].badge
                          )}
                        >
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {a.value != null ? formatNumber(a.value) : '—'}{' '}
                        {getParameterUnit(a.parameter ?? '')} ·{' '}
                        {a.created_at ? formatRelativeTR(a.created_at) : ''}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="pt-3">
              <Link
                href="/alarmlar"
                className="text-xs font-medium text-primary hover:underline"
              >
                Tüm alarmları gör →
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
