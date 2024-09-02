import { unref, watchEffect } from 'vue'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { Ref } from 'vue'
import type { TableProInstance } from '../types'

/**
 * 必须在表格渲染完成后执行
 * @returns
 */
export function useWatchDom(
  tableRef: Ref<TableProInstance | null>,
  operationRef: Ref<any | null>,
  customActionRef: Ref<any | null>,
  tableEmitter: Emitter
) {
  watchEffect(() => {
    if (unref(tableRef.value)) {
      // vxeGrid dom挂载完毕事件
      tableEmitter.emit('table-pro:dom-ready', {
        table: unref(tableRef.value)?.$el,
        operation: operationRef.value,
        action: unref(customActionRef.value)?.actionRef,
      })
    }
  })
}
