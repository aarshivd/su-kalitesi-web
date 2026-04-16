'use client'

import { Download, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toCsv, downloadCsv } from '@/lib/csv-export'
import { toast } from 'sonner'

interface ExportButtonsProps<T extends Record<string, unknown>> {
  data: T[]
  filenameBase?: string
  fields?: string[]
}

export function ExportButtons<T extends Record<string, unknown>>({
  data,
  filenameBase = 'aquatrack-veri',
  fields,
}: ExportButtonsProps<T>) {
  const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-')

  const handleCsv = () => {
    if (data.length === 0) return toast.error('İndirilecek veri yok')
    const csv = toCsv(data, fields)
    downloadCsv(csv, `${filenameBase}-${timestamp()}.csv`)
    toast.success('CSV indirildi')
  }

  const handleJson = () => {
    if (data.length === 0) return toast.error('İndirilecek veri yok')
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filenameBase}-${timestamp()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('JSON indirildi')
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCsv}>
        <Download className="size-4" /> CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleJson}>
        <FileJson className="size-4" /> JSON
      </Button>
    </div>
  )
}
