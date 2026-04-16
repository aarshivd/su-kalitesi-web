import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getMeasurementsClient } from '@/lib/queries/measurements'
import type { GetMeasurementsOptions } from '@/lib/queries/measurements'

export function useMeasurements(options: GetMeasurementsOptions = {}) {
  return useQuery({
    queryKey: ['measurements', options],
    queryFn: () => getMeasurementsClient(createClient(), options),
  })
}
