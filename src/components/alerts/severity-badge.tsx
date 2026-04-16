import { cn } from '@/lib/utils'
import { SEVERITY_CLASSES, SEVERITY_LABEL } from '@/lib/constants/palette'

type Severity = keyof typeof SEVERITY_CLASSES

export function SeverityBadge({ severity }: { severity: string | null | undefined }) {
  const sev = ((severity ?? 'ok').toLowerCase() as Severity) in SEVERITY_CLASSES
    ? ((severity ?? 'ok').toLowerCase() as Severity)
    : ('ok' as Severity)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase',
        SEVERITY_CLASSES[sev].badge
      )}
    >
      {SEVERITY_LABEL[sev]}
    </span>
  )
}
