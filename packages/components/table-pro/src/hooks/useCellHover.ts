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
  // tableId: TableProProps['id'],
  // showTooltip: TableProProps['showTooltip'],
  params: VxeGridDefines.CellMouseenterEventParams
) {
  const { cell, column, _rowIndex, _columnIndex, rowid } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip, id: tableId } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `${tableId}:row_${_rowIndex}-${_columnIndex}-${rowid}`
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
    isCellOverflow && instance?.showTooltip(el)
  }
}

function hideCellTooltip(
  instances: Map<any, any>,
  tablePropsRef: ComputedRef<TableProProps>,
  // tableId: TableProProps['id'],
  // showTooltip: TableProProps['showTooltip'],
  params: VxeGridDefines.CellMouseenterEventParams
) {
  const { column, _rowIndex, _columnIndex, rowid } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip, id: tableId } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `${tableId}:row_${_rowIndex}-${_columnIndex}-${rowid}`
    const instance = instances.get(id)
    instance?.hideTooltip()
  }
}

function hideCellAllTooltip(instances: Map<any, any>) {
  if (instances.size > 0) {
    instances.forEach((instance) => {
      instance?.hideTooltip()
    })
  }
}

function deleteTitle(cellEl: HTMLElement) {
  const targetCls = ['vxe-header--column', 'vxe-body--column', 'vxe-footer--column']
  const cotainsNum = targetCls.reduce((total, cur) => {
    if (cellEl.classList.contains(cur)) {
      total += 1
    }
    return total
  }, 0)
  const isColumnTdEL = cotainsNum > 0
  if (isColumnTdEL) {
    cellEl.removeAttribute('title')
    cellEl.querySelector('.vxe-cell')!.removeAttribute('title')
  }
}

export function useCellHover(
  tablePropsRef: ComputedRef<TableProProps>,
  // id: TableProProps['id'],
  // showTooltip: TableProProps['showTooltip'],
  emit: TableProGridEmit
) {
  const instances = new Map<string, any>()

  const onCellMouseenter = (params: VxeGridDefines.CellMouseenterEventParams) => {
    // 详情可参考 vxetable body.ts triggerHeaderTooltipEvent/triggerBodyTooltipEvent/triggerFooterTooltipEvent
    if (!params) return
    showCellTooltip(instances, tablePropsRef, params)
    // showCellTooltip(instances, id, showTooltip, params)
    emit('CellMouseenter', params)
    // setTimeout(() => {
    //   deleteTitle(params.cell)
    // }, 150)
  }

  const onCellMouseleave = (params?: VxeGridDefines.CellMouseleaveEventParams) => {
    if (!params) {
      hideCellAllTooltip(instances)
    } else {
      hideCellTooltip(instances, tablePropsRef, params)
      // hideCellTooltip(instances, id, showTooltip, params)
      emit('CellMouseleave', params)
    }
  }

  return {
    onCellMouseenter,
    onCellMouseleave,
    instances,
  }
}
