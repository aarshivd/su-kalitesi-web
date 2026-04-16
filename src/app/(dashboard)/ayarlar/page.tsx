import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Section } from '@/components/common/section'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = { title: 'Ayarlar' }

export default function AyarlarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ayarlar"
        description="Uygulama ve hesap ayarları"
      />

      <Section title="Genel">
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </Section>

      <Section title="Bildirimler">
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </Section>
    </div>
  )
}
