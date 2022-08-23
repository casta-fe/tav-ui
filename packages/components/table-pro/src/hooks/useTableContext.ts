import { inject, provide } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { TableProInstance, TableProProps } from '../types'
import type { Emitter } from '@tav-ui/utils/mitt'

interface ICustomCell {
  onMouseenter: (params: any) => void
  onMouseleave: (params: any) => void
}

const key = Symbol('table-pro')

interface Context {
  tableRef: Ref<TableProInstance | null>
  tableEmitter: Emitter
  tablePropsRef: ComputedRef<TableProProps>
  customCell: ICustomCell
}

export function createTableContext(context: Context) {
  provide(key, context)
}

export function useTableContext(): Context {
  return inject(key) as Context
}
