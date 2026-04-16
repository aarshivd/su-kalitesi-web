import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MapPin, Clock } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeviceDetailChart } from '@/components/devices/device-detail-chart'
import { SeverityBadge } from '@/components/alerts/severity-badge'
import { getDevice } from '@/lib/queries/devices.server'
import { getMeasurements } from '@/lib/queries/measurements.server'
import { createClient } from '@/lib/supabase/server'
import { formatDateTimeTR, formatNumber } from '@/lib/format'
import { DEFAULT_THRESHOLDS, PARAMETER_KEYS } from '@/lib/constants/thresholds'

export const metadata: Metadata = { title: 'Cihaz Detayı' }

export default async function CihazDetayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const device = await getDevice(id)
  if (!device) notFound()

  const [measurements, supabase] = await Promise.all([
    getMeasurements({ deviceId: id, limit: 50 }),
    createClient(),
  ])

  const { data: alerts } = await supabase
    .from('alert_history')
    .select('*')
    .eq('device_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const latest = measurements[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title={device.device_name}
        description={device.description ?? 'Cihaz detayları ve ölçüm geçmişi'}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son Ölçüm</CardTitle>
          </CardHeader>
          <CardContent>
            {latest ? (
              <>
                <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" /> {formatDateTimeTR(latest.timestamp)}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {PARAMETER_KEYS.map((k) => {
                    const threshold = DEFAULT_THRESHOLDS[k]
                    const val = latest[k]
                    return (
                      <div key={k} className="rounded-lg border border-border p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {threshold.label}
                        </p>
                        <p className="mt-1 text-lg font-bold tabular-nums">
                          {val != null ? formatNumber(val) : '—'}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            {threshold.unit}
                          </span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Bu cihaz için ölçüm yok</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4" /> Konum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{device.location_name ?? '—'}</p>
            {latest?.latitude != null && latest?.longitude != null && (
              <p className="text-xs text-muted-foreground">
                {formatNumber(latest.latitude, { maximumFractionDigits: 5 })},{' '}
                {formatNumber(latest.longitude, { maximumFractionDigits: 5 })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <DeviceDetailChart data={measurements} />

      <Card>
        <CardHeader>
          <CardTitle>Son Alarmlar</CardTitle>
        </CardHeader>
        <CardContent>
          {!alerts || alerts.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Bu cihaz için alarm yok
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <SeverityBadge severity={a.severity} />
                  <span className="flex-1 truncate">
                    {a.parameter} — {a.value != null ? formatNumber(a.value) : '—'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {a.created_at ? formatDateTimeTR(a.created_at) : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
