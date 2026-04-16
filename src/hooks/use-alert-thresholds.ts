import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getAlertThresholdsClient } from '@/lib/queries/alerts'

export function useAlertThresholds(deviceId?: string) {
  return useQuery({
    queryKey: ['alert-thresholds', deviceId],
    queryFn: () => getAlertThresholdsClient(createClient(), deviceId),
  })
}
