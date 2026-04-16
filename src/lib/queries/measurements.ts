import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export type Measurement = Database['public']['Tables']['measurements']['Row']
export type MeasurementWithDevice = Measurement & {
  devices: { device_name: string } | null
}

export interface GetMeasurementsOptions {
  deviceId?: string
  limit?: number
  from?: string
  to?: string
}

/** Client Component için */
export async function getMeasurementsClient(
  supabase: SupabaseClient<Database>,
  options: GetMeasurementsOptions = {}
): Promise<MeasurementWithDevice[]> {
  return _fetchMeasurements(supabase, options)
}

export async function _fetchMeasurements(
  supabase: SupabaseClient<Database>,
  { deviceId, limit = 50, from, to }: GetMeasurementsOptions
): Promise<MeasurementWithDevice[]> {
  let query = supabase
    .from('measurements')
    .select('*, devices(device_name)')
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (deviceId) query = query.eq('device_id', deviceId)
  if (from) query = query.gte('timestamp', from)
  if (to) query = query.lte('timestamp', to)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as MeasurementWithDevice[]
}
