export interface ParameterThreshold {
  label: string
  unit: string
  min: number
  max: number
  warningMin: number
  warningMax: number
}

export type ParameterKey =
  | 'ph'
  | 'tds'
  | 'turbidity'
  | 'temperature'
  | 'battery_voltage'

export const PARAMETER_KEYS: ParameterKey[] = [
  'ph',
  'tds',
  'turbidity',
  'temperature',
  'battery_voltage',
]

export const DEFAULT_THRESHOLDS: Record<ParameterKey, ParameterThreshold> = {
  ph: {
    label: 'pH',
    unit: '',
    min: 6.5,
    max: 8.5,
    warningMin: 7.0,
    warningMax: 8.0,
  },
  tds: {
    label: 'TDS',
    unit: 'ppm',
    min: 0,
    max: 500,
    warningMin: 50,
    warningMax: 400,
  },
  turbidity: {
    label: 'Bulanıklık',
    unit: 'NTU',
    min: 0,
    max: 5,
    warningMin: 0,
    warningMax: 2.5,
  },
  temperature: {
    label: 'Sıcaklık',
    unit: '°C',
    min: 0,
    max: 35,
    warningMin: 5,
    warningMax: 30,
  },
  battery_voltage: {
    label: 'Pil',
    unit: 'V',
    min: 3.2,
    max: 4.2,
    warningMin: 3.4,
    warningMax: 4.2,
  },
}
