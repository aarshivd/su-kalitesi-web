import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export type Device = Database['public']['Tables']['devices']['Row']

/** Client Component için */
export async function getDevicesClient(
  supabase: SupabaseClient<Database>
): Promise<Device[]> {
  return _fetchDevices(supabase)
}

export async function _fetchDevices(
  supabase: SupabaseClient<Database>
): Promise<Device[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
