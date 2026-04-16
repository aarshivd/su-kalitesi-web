import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'ok' | 'warning' | 'critical'
  className?: string
}

const statusRing: Record<string, string> = {
  ok: 'ring-emerald-500/20',
  warning: 'ring-amber-500/20',
  critical: 'ring-destructive/20',
}

const iconBg: Record<string, string> = {
  ok: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  critical: 'bg-destructive/10 text-destructive',
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trendValue,
  status = 'ok',
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'ring-1 transition-shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        statusRing[status],
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
            {trendValue && (
              <p className="text-xs text-muted-foreground">{trendValue}</p>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', iconBg[status])}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
