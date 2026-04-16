'use client'

import { PageHeader } from '@/components/common/page-header'
import { ThresholdForm } from '@/components/settings/threshold-form'

export default function EsiklerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Eşik Değerleri"
        description="Alarm tetiklemek için parametre sınırlarını yapılandırın"
      />
      <ThresholdForm />
    </div>
  )
}
