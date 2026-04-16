'use client'

import { useFilterStore } from '@/stores/filter-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Preset {
  label: string
  hours: number
}

const PRESETS: Preset[] = [
  { label: '1s', hours: 1 },
  { label: '24s', hours: 24 },
  { label: '7g', hours: 24 * 7 },
  { label: '30g', hours: 24 * 30 },
]

export function DateRangePicker() {
  const { dateRange, setDateRange } = useFilterStore()

  const applyPreset = (hours: number) => {
    const to = new Date()
    const from = new Date(to.getTime() - hours * 3600 * 1000)
    setDateRange({ from: from.toISOString(), to: to.toISOString() })
  }

  const activeHours = (() => {
    if (!dateRange.from || !dateRange.to) return null
    const diff =
      (new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / 3600 / 1000
    return PRESETS.find((p) => Math.abs(p.hours - diff) < 0.5)?.hours ?? null
  })()

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Zaman Aralığı
      </p>
      <div className="grid grid-cols-4 gap-1">
        {PRESETS.map((p) => (
          <Button
            key={p.hours}
            size="sm"
            variant={activeHours === p.hours ? 'default' : 'outline'}
            onClick={() => applyPreset(p.hours)}
            className={cn('h-8 px-2 text-xs')}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
