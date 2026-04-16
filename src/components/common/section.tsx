import { cn } from '@/lib/utils'

interface SectionProps {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function Section({ title, description, className, children }: SectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || description) && (
        <div className="space-y-0.5">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
