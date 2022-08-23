import { unref } from 'vue'
import { Checkbox } from 'ant-design-vue'
import {
  ACTION_COLUMNS,
  ComponentCellName,
  ComponentEditCellName,
  MIN_WIDTH,
  MIN_WIDTH_SMALL,
  SELECT_COMPONENTS,
} from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProColumn, TableProGridEmit, TableProInstance, TableProProps } from '../types'

/**
 * 自动添加 checkbox/radio
 * @param tablePropsRef
 * @returns
 */
function autoAddChoosenElement(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const { columns = [], checkboxConfig, radioConfig } = unref(tablePropsRef)
  const isColumnsHasCheckbox = columns?.find((column) => column.type === 'checkbox')
  const isColumnsHasRadio = columns?.find((column) => column.type === 'radio')

  // column 可能是promise需要等有值后再执行，减少rerender
  if (!columns.length) return columns

  if (!isColumnsHasCheckbox && checkboxConfig.enabled) {
    columns.unshift({
      type: 'checkbox',
      fixed: 'left',
      slots: {
        header: (info: any) => {
          const { checked, indeterminate } = info
          return [
            <Checkbox
              indeterminate={indeterminate}
              checked={checked}
              onChange={() => {
                unref(tableRef)?.toggleAllCheckboxRow()
                emit('CheckboxAll', info)
              }}
            />,
          ]
        },
        checkbox: (info: any) => {
          const { row, checked, indeterminate } = info
          return [
            <Checkbox
              indeterminate={indeterminate}
              checked={checked}
              onChange={() => {
                unref(tableRef)?.toggleCheckboxRow(row)
                emit('CheckboxChange', info)
              }}
            />,
          ]
        },
      },
    })
  }

  if (!isColumnsHasRadio && radioConfig.enabled) {
    columns.unshift({
      type: 'radio',
      fixed: 'left',
    })
  }

  return columns
}

/**
 * 设置最小宽度
 * @param columns
 * @returns
 */
function setColumnMinWidth(columns: TableProColumn[]) {
  return columns.length
    ? columns?.map((column: TableProColumn) => {
        if (column.type && SELECT_COMPONENTS.includes(column.type)) {
          if (!column.width) column.width = MIN_WIDTH_SMALL
        } else if (column.field && ACTION_COLUMNS.includes(column.field)) {
          // column.showOverflow = false
          if (!column.minWidth) column.minWidth = MIN_WIDTH + 10
        } else {
          if (!column.minWidth) column.minWidth = MIN_WIDTH
        }
        return column
      })
    : columns
}

/**
 * 包装单元格
 * @param columns
 * @returns
 */
function wrapperColumnSlot(columns: TableProColumn[]) {
  /** 包装单元格，解决tooltip错位问题 */
  const cellRender = (column: TableProColumn) => {
    const { customRender } = column
    column['cellRender'] = {
      name: ComponentCellName,
      options: [{ customRender }],
    }
    return column
  }
  /** 包装可编辑单元格 */
  const cellEditRender = (column: TableProColumn) => {
    const { customEditRenderProp, customEditRender, customRender } = column
    if (customEditRender) {
      let editRender = {}
      if (customEditRenderProp) {
        editRender = customEditRenderProp
      }
      column['editRender'] = {
        ...editRender,
        name: ComponentEditCellName,
        options: [{ customEditRender, customRender }],
      }
    }
    return column
  }

  return columns.length
    ? columns.map((column: TableProColumn) => {
        const wrapperCellRenderedColumn = cellRender(column)
        const wrapperCellEditRenderedColumn = cellEditRender(wrapperCellRenderedColumn)
        return wrapperCellEditRenderedColumn
      })
    : columns
}

/**
 * 操作列数据，设置最小宽度，自动注入checkbox等
 * @param propsRef
 */
export function useColumns(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  const autoAddChoosenElementColumns = autoAddChoosenElement(tablePropsRef, tableRef, emit)
  const setColumnMinWidthColumns = setColumnMinWidth(autoAddChoosenElementColumns)
  const columns = wrapperColumnSlot(setColumnMinWidthColumns)
  return columns
}
