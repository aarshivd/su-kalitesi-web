import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MeasurementWithDevice } from '@/lib/queries/measurements'

export interface DeviceLatestLocation {
  device_id: string
  device_name: string
  latitude: number
  longitude: number
  measurement: MeasurementWithDevice
}

export function useDeviceLatestLocations() {
  return useQuery({
    queryKey: ['device-latest-locations'],
    queryFn: async (): Promise<DeviceLatestLocation[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('measurements')
        .select('*, devices(device_name)')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('timestamp', { ascending: false })
        .limit(500)
      if (error) throw error

      const seen = new Map<string, DeviceLatestLocation>()
      for (const row of (data ?? []) as MeasurementWithDevice[]) {
        if (seen.has(row.device_id)) continue
        if (row.latitude == null || row.longitude == null) continue
        seen.set(row.device_id, {
          device_id: row.device_id,
          device_name: row.devices?.device_name ?? 'Cihaz',
          latitude: row.latitude,
          longitude: row.longitude,
          measurement: row,
        })
      }
      return Array.from(seen.values())
    },
    refetchInterval: 60_000,
  })
}
