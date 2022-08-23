import { onDeactivated, onUnmounted, unref } from 'vue'
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
  const { cell, column, $rowIndex, $columnIndex } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip, id: tableId } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `${tableId}:row_${$rowIndex}-${$columnIndex}`
    const el = (cell as HTMLElement).querySelector(`.${ContentPrefixCls}`) as HTMLElement
    let title = ''
    let isCellOverflow = false
    if (el) {
      title = ((column.type === 'html' ? el.innerText : el.textContent) ?? '').trim()
      isCellOverflow = el.scrollWidth > el.clientWidth
    }

    // 单击编辑后cell重新生成，如果还取缓存的instance则tooltip飘到最上方
    // if (!instances.has(id)) {
    //   instance = $Tooltip(el as HTMLElement, {
    //     placement: TOOLTIP_PLACEMENT,
    //     title,
    //     id,
    //     delay: 100,
    //   })
    //   instances.set(id, instance)
    // } else {
    //   instance = instances.get(id)
    // }

    const instance = $Tooltip(el as HTMLElement, {
      placement: TOOLTIP_PLACEMENT,
      title,
      id,
      delay: 100,
    })
    instances.set(id, instance)

    isCellOverflow && instance?.showTooltip()
  }
}

function hideCellTooltip(
  instances: Map<any, any>,
  tablePropsRef: ComputedRef<TableProProps>,
  params: VxeGridDefines.CellMouseenterEventParams
) {
  const { column, $rowIndex, $columnIndex } = params
  const { params: columnParams = {} } = column
  const { showTooltip: columnShowTooltip } = columnParams
  const { showTooltip, id: tableId } = unref(tablePropsRef)
  const isColumnShowTooltip = isBoolean(columnShowTooltip) ? columnShowTooltip : showTooltip
  if (isColumnShowTooltip) {
    const id = `${tableId}:row_${$rowIndex}-${$columnIndex}`
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

export function useCellHover(tablePropsRef: ComputedRef<TableProProps>, emit: TableProGridEmit) {
  let instances: Map<string, any> | null = new Map<string, any>()

  const onCellMouseenter = (params: VxeGridDefines.CellMouseenterEventParams) => {
    // 详情可参考 vxetable body.ts triggerHeaderTooltipEvent/triggerBodyTooltipEvent/triggerFooterTooltipEvent
    if (!params) return
    showCellTooltip(instances!, tablePropsRef, params)
    emit('CellMouseenter', params)
    setTimeout(() => {
      deleteTitle(params.cell)
    }, 150)
  }

  const onCellMouseleave = (params?: VxeGridDefines.CellMouseleaveEventParams) => {
    if (!params) {
      hideCellAllTooltip(instances!)
    } else {
      hideCellTooltip(instances!, tablePropsRef, params)
      emit('CellMouseleave', params)
    }
  }

  const clearInstances = () => {
    const clear = () => {
      instances!.clear()
      instances = null
    }
    onUnmounted(() => {
      clear()
    })
    onDeactivated(() => {
      clear()
    })
  }

  return {
    onCellMouseenter,
    onCellMouseleave,
    instances,
    clearInstances,
  }
}
