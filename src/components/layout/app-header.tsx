import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { Breadcrumbs } from './breadcrumbs'
import { NotificationBell } from './notification-bell'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <MobileNav />
      <Breadcrumbs />
      <div className="flex-1" />
      <NotificationBell />
      <ThemeToggle />
    </header>
  )
}
