import 'server-only'
import { createClient as createServerClient } from '@/lib/supabase/server'
import {
  _fetchMeasurements,
  type GetMeasurementsOptions,
  type MeasurementWithDevice,
} from './measurements'

export type { MeasurementWithDevice, GetMeasurementsOptions }

export async function getMeasurements(
  options: GetMeasurementsOptions = {}
): Promise<MeasurementWithDevice[]> {
  const supabase = await createServerClient()
  return _fetchMeasurements(supabase, options)
}
