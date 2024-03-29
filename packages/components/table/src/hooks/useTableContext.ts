import { inject, provide } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, TableActionType } from '../types/table'

const key = Symbol('basic-table')
type Nullable<T> = T | null
type Recordable<T = any> = Record<string, T>
type Instance = TableActionType & {
  wrapRef: Ref<Nullable<HTMLElement>>
  getBindValues: ComputedRef<Recordable>
  setCacheActionWidths: (...args: any) => void
}

type RetInstance = Omit<Instance, 'getBindValues'> & {
  getBindValues: ComputedRef<BasicTableProps>
}

export function createTableContext(instance: Instance) {
  provide(key, instance)
}

export function useTableContext(): RetInstance {
  return inject(key) as RetInstance
}
