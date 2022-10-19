import { nextTick, unref, watchEffect } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { CamelCaseToCls, ComponentActionName } from '../const'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { ComputedRef, Ref } from 'vue'
import type { TableProInstance, TableProProps } from '../types'
import type { CustomActionRef } from '../typings'

const ComponentActionPrefixCls = CamelCaseToCls(ComponentActionName)
const ACTION_COLUMNS = ['actions', 'action']
const MutationObserverState = {
  useApiExecCount: 0,
  useDataExecCount: 0,
}

async function setActionWidth(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  fields = ACTION_COLUMNS
) {
  const { columns = [] } = unref(tablePropsRef)
  if (!columns.length) return
  const column = columns.find((column) => fields.includes(column.field!))
  if (column) {
    const tableEl = unref(tableRef.value)?.$el as HTMLElement
    const targetColumn = unref(tableRef.value)?.getColumnByField(column.field!)
    const targetTdEl = tableEl.querySelector(
      `.vxe-table--body tbody tr td[colid="${targetColumn?.id}"] .${ComponentActionPrefixCls}`
    )
    if (targetTdEl) {
      const totalWidth = Array.from(targetTdEl.children).reduce((totalWidth: number, el) => {
        const { width } = el.getBoundingClientRect()
        if (el.classList.contains('ant-divider')) {
          totalWidth = totalWidth + (width + 10 * 2)
        } else if (el.classList.contains('ant-btn')) {
          totalWidth += width
        } else if (el.classList.contains('ant-dropdown-trigger')) {
          totalWidth = totalWidth + (width + 10)
        } else {
          totalWidth += 0
        }
        return totalWidth
      }, 0)
      // 上述的10均为margin
      column.width = Math.ceil(totalWidth) + 10 * 2 // 10 为 padding
      await nextTick()
      unref(tableRef.value)?.reloadColumn(unref(tablePropsRef).columns!)
    }
  }
}

/**
 * 使用 api 导入数据的监听
 * @param tablePropsRef
 * @param tableRef
 * @param tableEmitter
 */
function useApiTableProObserver(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  tableEmitter: Emitter
) {
  if (MutationObserverState.useDataExecCount > 0) return
  // vxegrid 渲染完毕事件
  const targetEl = (unref(tableRef.value)?.$el as HTMLElement).querySelector(
    '.vxe-table .vxe-table--body'
  ) as HTMLElement
  const { stop } = useMutationObserver(
    targetEl,
    (mutations) => {
      const mutation = mutations[0]
      if (!mutation) return
      // 已 '.vxe-table .vxe-table--body' 的动态宽度变化来作为渲染完成依据
      if (mutation.attributeName === 'style' && (mutation.target as HTMLElement).style.width) {
        setActionWidth(tablePropsRef, tableRef)
        tableEmitter.emit('table-pro:rendered')
        stop()
      }
    },
    { attributes: true }
  )
}

/**
 * 使用 data 导入数据的监听
 * @param tablePropsRef
 * @param tableRef
 * @param tableEmitter
 */
function useDataTableProObserver(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  tableEmitter: Emitter
) {
  if (MutationObserverState.useApiExecCount > 0) return
  // vxegrid 渲染完毕事件
  const targetEl = (unref(tableRef.value)?.$el as HTMLElement).querySelector(
    '.vxe-table .vxe-table--body tbody'
  ) as HTMLElement
  const { stop } = useMutationObserver(
    targetEl,
    (mutations) => {
      const mutation = mutations[0]
      if (!mutation) return
      // 已 '.vxe-table .vxe-table--body' 的动态宽度变化来作为渲染完成依据
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        setActionWidth(tablePropsRef, tableRef)
        tableEmitter.emit('table-pro:rendered')
        stop()
      }
    },
    { childList: true }
  )
}

/**
 * 必须在表格渲染完成后执行
 * @returns
 */
export function useWatchDom(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  customActionRef: Ref<any | null>,
  tableEmitter: Emitter
) {
  watchEffect(() => {
    if (unref(tableRef.value)) {
      // vxeGrid dom挂载完毕事件
      tableEmitter.emit('table-pro:dom-ready', {
        table: unref(tableRef.value)?.$el,
        action: unref(customActionRef.value)?.actionRef,
      })

      // if (unref(tablePropsRef).api) {
      //   useApiTableProObserver(tablePropsRef, tableRef, tableEmitter)
      //   MutationObserverState.useApiExecCount++
      // } else {
      //   useDataTableProObserver(tablePropsRef, tableRef, tableEmitter)
      //   MutationObserverState.useDataExecCount++
      // }
    }
  })
}
