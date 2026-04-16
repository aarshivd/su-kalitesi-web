import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export type AlertHistory = Database['public']['Tables']['alert_history']['Row']
export type AlertThreshold = Database['public']['Tables']['alert_thresholds']['Row']
export type AlertHistoryWithDevice = AlertHistory & {
  devices: { device_name: string } | null
}

/** Client Component için */
export async function getAlertHistoryClient(
  supabase: SupabaseClient<Database>,
  limit = 20
): Promise<AlertHistoryWithDevice[]> {
  return _fetchAlertHistory(supabase, limit)
}

/** Client Component için */
export async function getAlertThresholdsClient(
  supabase: SupabaseClient<Database>,
  deviceId?: string
): Promise<AlertThreshold[]> {
  return _fetchThresholds(supabase, deviceId)
}

export async function _fetchAlertHistory(
  supabase: SupabaseClient<Database>,
  limit: number
): Promise<AlertHistoryWithDevice[]> {
  const { data, error } = await supabase
    .from('alert_history')
    .select('*, devices(device_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as AlertHistoryWithDevice[]
}

export async function _fetchThresholds(
  supabase: SupabaseClient<Database>,
  deviceId?: string
): Promise<AlertThreshold[]> {
  let query = supabase
    .from('alert_thresholds')
    .select('*')
    .eq('is_active', true)

  if (deviceId) query = query.eq('device_id', deviceId)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
