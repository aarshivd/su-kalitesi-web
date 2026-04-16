import { create } from 'zustand'
import { PARAMETER_KEYS, type ParameterKey } from '@/lib/constants/thresholds'

interface DateRange {
  from: string | undefined
  to: string | undefined
}

interface FilterState {
  dateRange: DateRange
  selectedParameters: ParameterKey[]
  setDateRange: (range: DateRange) => void
  setSelectedParameters: (params: ParameterKey[]) => void
  toggleParameter: (param: ParameterKey) => void
  resetFilters: () => void
}

const DEFAULT_PARAMETERS: ParameterKey[] = [...PARAMETER_KEYS]

export const useFilterStore = create<FilterState>((set) => ({
  dateRange: { from: undefined, to: undefined },
  selectedParameters: DEFAULT_PARAMETERS,
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedParameters: (params) => set({ selectedParameters: params }),
  toggleParameter: (param) =>
    set((s) => ({
      selectedParameters: s.selectedParameters.includes(param)
        ? s.selectedParameters.filter((p) => p !== param)
        : [...s.selectedParameters, param],
    })),
  resetFilters: () =>
    set({
      dateRange: { from: undefined, to: undefined },
      selectedParameters: DEFAULT_PARAMETERS,
    }),
}))
