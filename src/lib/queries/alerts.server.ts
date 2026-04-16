import 'server-only'
import { createClient as createServerClient } from '@/lib/supabase/server'
import {
  _fetchAlertHistory,
  _fetchThresholds,
  type AlertHistoryWithDevice,
  type AlertThreshold,
} from './alerts'

export type { AlertHistoryWithDevice, AlertThreshold }

export async function getAlertHistory(limit = 20): Promise<AlertHistoryWithDevice[]> {
  const supabase = await createServerClient()
  return _fetchAlertHistory(supabase, limit)
}

export async function getAlertThresholds(deviceId?: string): Promise<AlertThreshold[]> {
  const supabase = await createServerClient()
  return _fetchThresholds(supabase, deviceId)
}
