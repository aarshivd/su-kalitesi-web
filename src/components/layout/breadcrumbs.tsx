'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'
import { navigation } from '@/lib/constants/navigation'

const hrefLabel = new Map<string, string>()
for (const section of navigation) {
  for (const item of section.items) {
    hrefLabel.set(item.href, item.title)
  }
}

export function Breadcrumbs() {
  const pathname = usePathname()
  if (pathname === '/') {
    return (
      <div className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
        <Home className="size-3.5" />
        <span className="text-foreground font-medium">Dashboard</span>
      </div>
    )
  }

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { href: string; label: string }[] = []
  let acc = ''
  for (const seg of segments) {
    acc += '/' + seg
    const label = hrefLabel.get(acc) ?? decodeURIComponent(seg)
    crumbs.push({ href: acc, label })
  }

  return (
    <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
      <Link href="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-3.5" />
      </Link>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1
        return (
          <Fragment key={c.href}>
            <ChevronRight className="size-3.5 opacity-50" />
            {last ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
