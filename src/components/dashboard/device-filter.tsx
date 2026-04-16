'use client'

import { useDevices } from '@/hooks/use-devices'
import { useDeviceStore } from '@/stores/device-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ALL = '__all__'

export function DeviceFilter() {
  const { data: devices = [] } = useDevices()
  const selected = useDeviceStore((s) => s.selectedDevice)
  const setSelected = useDeviceStore((s) => s.setSelectedDevice)

  return (
    <Select
      value={selected?.id ?? ALL}
      onValueChange={(v) => {
        if (v === ALL) setSelected(null)
        else setSelected(devices.find((d) => d.id === v) ?? null)
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Tüm Cihazlar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Tüm Cihazlar</SelectItem>
        {devices.map((d) => (
          <SelectItem key={d.id} value={d.id}>
            {d.device_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
