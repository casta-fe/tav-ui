import { nextTick, unref, watchEffect } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { CamelCaseToCls, ComponentActionName } from '../const'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { ComputedRef, Ref } from 'vue'
import type { TableProEvent, TableProInstance, TableProProps } from '../types'

const ComponentActionPrefixCls = CamelCaseToCls(ComponentActionName)
const ACTION_COLUMNS = ['actions', 'action']

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
 * 必须在表格渲染完成后执行
 * @returns
 */
export function useWatchDom(
  getBindValues: ComputedRef<TableProProps & TableProEvent>,
  tableRef: Ref<TableProInstance | null>,
  tableEmitter: Emitter
) {
  watchEffect(() => {
    if (unref(tableRef.value)) {
      // vxeGrid dom挂载完毕事件
      tableEmitter.emit('table-pro:dom-ready', {
        table: unref(tableRef.value)?.$el,
      })

      // vxegrid 渲染完毕事件
      const targetEl = (unref(tableRef.value)?.$el as HTMLElement).querySelector(
        '.vxe-table .vxe-table--body'
      ) as HTMLElement
      const { stop } = useMutationObserver(
        targetEl,
        (mutations) => {
          const mutation = mutations[0]
          if (!mutation) return
          if (mutation.attributeName === 'style') {
            setActionWidth(getBindValues, tableRef)
            tableEmitter.emit('table-pro:render-ready')
            stop()
          }
        },
        { attributes: true }
      )
    }
  })
}
