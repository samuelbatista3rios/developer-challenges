
export const SENSOR_TYPES = {
  TCAg: 'TcAg',
  TCAs: 'TcAs',
  HF_PLUS: 'HF+'
} as const;

export const MACHINE_TYPES = {
  PUMP: 'Pump',
  FAN: 'Fan'
} as const;

export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 25, 50]
} as const;