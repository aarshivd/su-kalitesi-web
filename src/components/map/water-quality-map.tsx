'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { useDeviceLatestLocations } from '@/hooks/use-device-latest-locations'
import { useDeviceStore } from '@/stores/device-store'
import { measurementSeverity } from '@/lib/water-quality'
import { formatDateTimeTR, formatNumber } from '@/lib/format'

const COLORS = {
  ok: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
}

function severityIcon(severity: 'ok' | 'warning' | 'critical') {
  const color = COLORS[severity]
  return L.divIcon({
    className: 'aqua-marker',
    html: `<div style="
      width: 28px; height: 28px; border-radius: 9999px;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
      display: flex; align-items: center; justify-content: center;
    "><div style="width:8px;height:8px;border-radius:9999px;background:white;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function FlyToSelected() {
  const map = useMap()
  const selected = useDeviceStore((s) => s.selectedDevice)
  const { data } = useDeviceLatestLocations()
  useEffect(() => {
    if (!selected || !data) return
    const loc = data.find((d) => d.device_id === selected.id)
    if (loc) map.flyTo([loc.latitude, loc.longitude], 14, { duration: 0.8 })
  }, [selected, data, map])
  return null
}

export default function WaterQualityMap() {
  const { data = [], isLoading } = useDeviceLatestLocations()

  const center = useMemo<[number, number]>(() => {
    if (data.length === 0) return [39.9208, 32.8541] // Ankara
    const lat = data.reduce((s, d) => s + d.latitude, 0) / data.length
    const lng = data.reduce((s, d) => s + d.longitude, 0) / data.length
    return [lat, lng]
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        Harita yükleniyor…
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected />
      {data.map((d) => {
        const sev = measurementSeverity(d.measurement)
        return (
          <Marker
            key={d.device_id}
            position={[d.latitude, d.longitude]}
            icon={severityIcon(sev)}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="text-sm font-semibold">{d.device_name}</p>
                <p className="text-muted-foreground">
                  {formatDateTimeTR(d.measurement.timestamp)}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1">
                  <span>pH:</span>
                  <span className="text-right">{formatNumber(d.measurement.ph ?? 0)}</span>
                  <span>TDS:</span>
                  <span className="text-right">{formatNumber(d.measurement.tds ?? 0)} ppm</span>
                  <span>Bulanıklık:</span>
                  <span className="text-right">
                    {formatNumber(d.measurement.turbidity ?? 0)} NTU
                  </span>
                  <span>Sıcaklık:</span>
                  <span className="text-right">
                    {formatNumber(d.measurement.temperature ?? 0)} °C
                  </span>
                </div>
                <Link
                  href={`/cihazlar/${d.device_id}`}
                  className="mt-1 block font-medium text-primary hover:underline"
                >
                  Detay →
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
