'use client'

import { useFilterStore } from '@/stores/filter-store'
import { PARAMETER_KEYS, DEFAULT_THRESHOLDS } from '@/lib/constants/thresholds'
import { CHART_COLORS } from '@/lib/constants/palette'
import { cn } from '@/lib/utils'

export function ParameterSelector() {
  const selected = useFilterStore((s) => s.selectedParameters)
  const toggle = useFilterStore((s) => s.toggleParameter)

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Parametreler
      </p>
      <div className="space-y-1.5">
        {PARAMETER_KEYS.map((key) => {
          const isOn = selected.includes(key)
          return (
            <label
              key={key}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                isOn && 'bg-accent/60'
              )}
            >
              <input
                type="checkbox"
                checked={isOn}
                onChange={() => toggle(key)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-4 items-center justify-center rounded border-2 transition-colors',
                  isOn ? 'border-transparent' : 'border-border'
                )}
                style={isOn ? { backgroundColor: CHART_COLORS[key] } : undefined}
              >
                {isOn && (
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="font-medium">{DEFAULT_THRESHOLDS[key].label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {DEFAULT_THRESHOLDS[key].unit}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
