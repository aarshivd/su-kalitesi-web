import 'server-only'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { _fetchDevices, type Device } from './devices'

export type { Device }

export async function getDevices(): Promise<Device[]> {
  const supabase = await createServerClient()
  return _fetchDevices(supabase)
}

export async function getDevice(id: string): Promise<Device | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}
