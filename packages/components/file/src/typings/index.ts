export * from './types'
export * from './injected-props'

export type Recordable<T = any> = Record<string, T>
export type LabelValueOption<T = any, K = any> = { label: string; value: T } & Recordable<K>
export type LabelValueOptions<T = any, K = any> = LabelValueOption<T, K>[]
