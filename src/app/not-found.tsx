import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Waves } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Waves className="size-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-primary">404</h1>
        <h2 className="text-xl font-semibold">Sayfa Bulunamadı</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  )
}
