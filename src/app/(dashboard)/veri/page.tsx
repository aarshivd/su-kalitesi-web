'use client'

import { PageHeader } from '@/components/common/page-header'
import { MeasurementsDataTable } from '@/components/table/measurements-data-table'

export default function VeriPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Veri Tablosu"
        description="Tüm ölçüm kayıtları — filtrele, sırala, dışa aktar"
      />
      <MeasurementsDataTable />
    </div>
  )
}
