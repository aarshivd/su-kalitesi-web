'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard/error]', error)
  }, [error])

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">Bir hata oluştu</p>
          <p className="text-sm text-muted-foreground">
            {error.message || 'Sayfa yüklenirken beklenmeyen bir hata oluştu.'}
          </p>
        </div>
        <Button onClick={() => reset()} variant="outline">
          <RotateCcw className="size-4" /> Tekrar Dene
        </Button>
      </CardContent>
    </Card>
  )
}
