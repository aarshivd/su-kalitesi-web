import { create } from 'zustand'
import type { Device } from '@/types/device'

interface DeviceState {
  selectedDevice: Device | null
  setSelectedDevice: (device: Device | null) => void
}

export const useDeviceStore = create<DeviceState>((set) => ({
  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
}))
