'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navigation } from '@/lib/constants/navigation'
import { Separator } from '@/components/ui/separator'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Waves className="size-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sidebar-foreground">AquaTrack</span>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navigation.map((section, si) => (
          <div key={si} className="space-y-1">
            {section.label && (
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.title}
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
