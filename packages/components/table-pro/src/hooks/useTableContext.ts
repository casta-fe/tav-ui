import { inject, provide } from 'vue'
import type { Ref } from 'vue'
import type { TableProInstance } from '../types'
import type { Emitter } from '@tav-ui/utils/mitt'

const key = Symbol('table-pro')

interface Context {
  tableRef: Ref<TableProInstance | null>
  tableEmitter: Emitter
}

export function createTableContext(context: Context) {
  provide(key, context)
}

export function useTableContext(): Context {
  return inject(key) as Context
}
