'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDevices } from '@/hooks/use-devices'
import { useAlertThresholds } from '@/hooks/use-alert-thresholds'
import { createClient } from '@/lib/supabase/client'
import { PARAMETER_KEYS, DEFAULT_THRESHOLDS } from '@/lib/constants/thresholds'
import { useState } from 'react'

const paramRowSchema = z
  .object({
    min: z.coerce.number(),
    max: z.coerce.number(),
    active: z.boolean(),
  })
  .refine((d) => d.min < d.max, {
    message: 'Min değer max değerden küçük olmalı',
    path: ['max'],
  })

const formSchema = z.object({
  ph: paramRowSchema,
  tds: paramRowSchema,
  turbidity: paramRowSchema,
  temperature: paramRowSchema,
  battery_voltage: paramRowSchema,
})

type FormValues = z.infer<typeof formSchema>

function buildDefaults(
  rows: ReturnType<typeof useAlertThresholds>['data']
): FormValues {
  const byParam = new Map((rows ?? []).map((r) => [r.parameter ?? '', r]))
  const out = {} as FormValues
  for (const key of PARAMETER_KEYS) {
    const existing = byParam.get(key)
    out[key] = {
      min: existing?.min_value ?? DEFAULT_THRESHOLDS[key].min,
      max: existing?.max_value ?? DEFAULT_THRESHOLDS[key].max,
      active: existing?.is_active ?? true,
    }
  }
  return out
}

export function ThresholdForm() {
  const { data: devices = [] } = useDevices()
  const [deviceId, setDeviceId] = useState<string>('')
  const { data: thresholds, isLoading } = useAlertThresholds(deviceId || undefined)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: buildDefaults(thresholds),
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    reset(buildDefaults(thresholds))
  }, [thresholds, reset])

  useEffect(() => {
    if (!deviceId && devices.length > 0) setDeviceId(devices[0].id)
  }, [devices, deviceId])

  const onSubmit = async (values: FormValues) => {
    if (!deviceId) {
      toast.error('Lütfen bir cihaz seçin')
      return
    }
    const supabase = createClient()
    const rows = PARAMETER_KEYS.map((key) => ({
      device_id: deviceId,
      parameter: key,
      min_value: values[key].min,
      max_value: values[key].max,
      is_active: values[key].active,
    }))
    const { error } = await supabase
      .from('alert_thresholds')
      .upsert(rows, { onConflict: 'device_id,parameter' })
    if (error) {
      toast.error('Kayıt başarısız: ' + error.message)
      return
    }
    toast.success('Eşik değerleri kaydedildi')
    queryClient.invalidateQueries({ queryKey: ['alert-thresholds'] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parametre Eşikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <Label>Cihaz</Label>
            <Select value={deviceId} onValueChange={setDeviceId}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Bir cihaz seçin" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.device_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border">
              {PARAMETER_KEYS.map((key) => {
                const t = DEFAULT_THRESHOLDS[key]
                const rowErr = errors[key]
                return (
                  <div
                    key={key}
                    className="grid gap-3 p-4 sm:grid-cols-[140px_1fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.unit}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Min</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`${key}.min` as const, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Max</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`${key}.max` as const, { valueAsNumber: true })}
                      />
                      {rowErr?.max?.message && (
                        <p className="text-xs text-destructive">{rowErr.max.message}</p>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`${key}.active` as const)}
                        className="size-4 accent-primary"
                      />
                      Aktif
                    </label>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !deviceId}>
              <Save className="size-4" />
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
