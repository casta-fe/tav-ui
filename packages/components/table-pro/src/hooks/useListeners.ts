import { computed } from 'vue'
import { kebabCaseToPascalCase } from '@tav-ui/utils/basic'
import { tableProEmits } from '../types'
import type { ComputedRef } from 'vue'
import type { TableProEvent, TableProGridEmit } from '../types'

export function useListeners(emit: TableProGridEmit): ComputedRef<TableProEvent> {
  const tableProEvents = tableProEmits.reduce((tableProEvents, name) => {
    const type = `on${kebabCaseToPascalCase(name)}` as keyof TableProEvent
    if (!tableProEvents[type])
      // 因为 vue 中 emit 的类型是根据 emits 来自动生成函数签名 (...args: any[]) => void，暂时无法修改
      tableProEvents[type] = (...args: any[]) => {
        emit(name, args)
      }
    return tableProEvents
  }, {} as TableProEvent)
  return computed(() => ({ ...tableProEvents }))
}
