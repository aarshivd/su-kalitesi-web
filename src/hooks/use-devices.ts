import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getDevicesClient } from '@/lib/queries/devices'

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevicesClient(createClient()),
  })
}
