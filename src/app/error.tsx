'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Bir şeyler ters gitti</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error.message ?? 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>
      </div>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  )
}
