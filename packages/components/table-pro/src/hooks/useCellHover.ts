import { unref } from 'vue'
import { $Tooltip } from '@tav-ui/hooks/web/useTooltip'
import { isBoolean } from '@tav-ui/utils/is'
import { ContentPrefixCls } from '../components/cell'
import { TOOLTIP_PLACEMENT } from '../const'
import type { ComputedRef } from 'vue'
import type { VxeGridDefines } from 'vxe-table'
import type { TableProGridEmit, TableProProps } from '../types'

function showCellTooltip(
  instances: Map<any, any>,
  tablePropsRef: ComputedRef<TableProProps>,
  params: VxeGridDefines.CellMouseenterEventParams
) {
  const { cell, column, _rowIndex, _columnIndex } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `row_${_rowIndex}-${_columnIndex}`
    const el = (cell as HTMLElement).querySelector(`.${ContentPrefixCls}`) as HTMLElement
    let title = ''
    let isCellOverflow = false
    if (el) {
      title = ((column.type === 'html' ? el.innerText : el.textContent) ?? '').trim()
      isCellOverflow = el.scrollWidth > el.clientWidth
    }
    let instance
    if (!instances.has(id)) {
      instance = $Tooltip(el as HTMLElement, {
        placement: TOOLTIP_PLACEMENT,
        title,
        id,
        delay: 100,
      })
      instances.set(id, instance)
    } else {
      instance = instances.get(id)
    }
    isCellOverflow && instance?.showTooltip()
  }
}

function hideCellTooltip(
  instances: Map<any, any>,
  tablePropsRef: ComputedRef<TableProProps>,
  params: VxeGridDefines.CellMouseenterEventParams
) {
  const { column, _rowIndex, _columnIndex } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `row_${_rowIndex}-${_columnIndex}`
    const instance = instances.get(id)
    instance?.hideTooltip()
  }
}

export function useCellHover(tablePropsRef: ComputedRef<TableProProps>, emit: TableProGridEmit) {
  const instances = new Map<string, any>()

  const onCellMouseenter = (params: VxeGridDefines.CellMouseenterEventParams, event) => {
    // 详情可参考 vxetable body.ts triggerHeaderTooltipEvent/triggerBodyTooltipEvent/triggerFooterTooltipEvent
    if (!params) return
    showCellTooltip(instances, tablePropsRef, params)
    emit('CellMouseenter', params)
  }
  const onCellMouseleave = (params: VxeGridDefines.CellMouseleaveEventParams, event) => {
    if (!params) return
    hideCellTooltip(instances, tablePropsRef, params)
    emit('CellMouseleave', params)
  }

  return {
    onCellMouseenter,
    onCellMouseleave,
    instances,
  }
}
