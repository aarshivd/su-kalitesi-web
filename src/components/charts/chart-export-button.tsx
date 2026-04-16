'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ChartExportButton({ targetId = 'time-series-chart' }: { targetId?: string }) {
  const handleExport = async () => {
    try {
      const el = document.getElementById(targetId)
      if (!el) {
        toast.error('Grafik bulunamadı')
        return
      }
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scale: 2,
      })
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `aquatrack-grafik-${Date.now()}.png`
      link.click()
      toast.success('Grafik indirildi')
    } catch (e) {
      console.error(e)
      toast.error('Dışa aktarma başarısız')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="size-4" /> PNG İndir
    </Button>
  )
}
