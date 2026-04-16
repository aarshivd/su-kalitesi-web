'use client'

import { PageHeader } from '@/components/common/page-header'
import { AlertHistoryTable } from '@/components/alerts/alert-history-table'

export default function AlarmlarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alarmlar"
        description="Tetiklenen alarm geçmişi ve aktif uyarılar"
      />
      <AlertHistoryTable />
    </div>
  )
}
