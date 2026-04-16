'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getAlertHistoryClient } from '@/lib/queries/alerts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SEVERITY_CLASSES } from '@/lib/constants/palette'
import { formatRelativeTR } from '@/lib/format'

export function NotificationBell() {
  const { data = [] } = useQuery({
    queryKey: ['alerts', 'recent'],
    queryFn: () => getAlertHistoryClient(createClient(), 5),
    refetchInterval: 30_000,
  })

  const unread = data.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Son Alarmlar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            Son 24 saatte alarm yok
          </div>
        ) : (
          data.map((a) => {
            const sev = (a.severity ?? 'ok') as keyof typeof SEVERITY_CLASSES
            return (
              <DropdownMenuItem key={a.id} asChild>
                <Link href="/alarmlar" className="flex flex-col items-start gap-0.5 py-2">
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      {a.devices?.device_name ?? 'Cihaz'}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase',
                        SEVERITY_CLASSES[sev].badge
                      )}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {a.parameter} — {a.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {a.created_at ? formatRelativeTR(a.created_at) : ''}
                  </span>
                </Link>
              </DropdownMenuItem>
            )
          })
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/alarmlar" className="justify-center text-xs font-medium">
            Tümünü Gör
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
