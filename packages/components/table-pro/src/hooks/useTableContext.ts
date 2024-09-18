import { inject, provide } from 'vue'
import { type UseCheckboxCacheReturn } from './useCheckboxCache'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { ComputedRef, Ref } from 'vue'
import type { TableProEvent, TableProInstance, TableProProps } from '../types'
import type { TableProInnerInfo } from '../typings'
import type { TableProColumnApiOptions } from './useColumnApi'

const key = Symbol('table-pro')

export interface BasicTableProContext {
  tableRef: Ref<TableProInstance | null>
  tableEmitter: Emitter
  tablePropsRef: ComputedRef<TableProProps & TableProEvent & TableProInnerInfo>
}

export interface TableProContext extends BasicTableProContext {
  columnApiOptions: TableProColumnApiOptions
  setCacheActionWidths?: (...args: any) => void
  calcContent?: (...args: any) => number
  checkboxCaches: UseCheckboxCacheReturn['checkboxCaches']
  isCheckboxCacheEnabled: UseCheckboxCacheReturn['isCheckboxCacheEnabled']
  checkboxCacheList: UseCheckboxCacheReturn['checkboxCacheList']
  createAllCheckboxCache: UseCheckboxCacheReturn['createAllCheckboxCache']
  deleteCheckboxCache: UseCheckboxCacheReturn['deleteCheckboxCache']
  deleteAllCheckboxCache: UseCheckboxCacheReturn['deleteAllCheckboxCache']
}

export function createTableContext(context: TableProContext) {
  provide(key, context)
}

export function useTableContext(): TableProContext {
  return inject(key) as TableProContext
}
