'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

/**
 * Supabase Realtime üzerinden gelen yeni ölçümleri dinler ve
 * TanStack Query cache'ini invalidate eder.
 */
export function useRealtimeMeasurements(deviceId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime-measurements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'measurements',
          filter: deviceId ? `device_id=eq.${deviceId}` : undefined,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['measurements'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [deviceId, queryClient])
}
