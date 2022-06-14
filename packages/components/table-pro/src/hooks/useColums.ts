import { unref } from 'vue'
import { MIN_WIDTH, MIN_WIDTH_SMALL } from '../const'
import type { ComputedRef } from 'vue'
import type { TableProColumn, TableProProps } from '../types'

const SELECT_COMPONENTS = ['checkbox', 'radio']
const ACTION_COLUMNS = ['actions', 'action']

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
        } else {
          if (!column.minWidth) column.minWidth = MIN_WIDTH
        }
        return column
      })
    : columns
}

/**
 * 自动添加 checkbox/radio
 * @param tablePropsRef
 * @returns
 */
function autoAddChoosenElement(tablePropsRef: ComputedRef<TableProProps>) {
  const { columns = [], checkboxConfig, radioConfig } = unref(tablePropsRef)
  // const hasCheckbox = Object.keys(checkboxConfig).length > 0
  // const hasRadioConfig = Object.keys(radioConfig).length > 0
  const isColumnsHasCheckbox = columns?.find((column) => column.type === 'checkbox')
  const isColumnsHasRadio = columns?.find((column) => column.type === 'radio')

  // column 可能是promise需要等有值后再执行，减少rerender
  if (!columns.length) return columns

  if (!isColumnsHasCheckbox && checkboxConfig.enabled) {
    columns.unshift({ type: 'checkbox', fixed: 'left' })
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
 * 操作列数据，设置最小宽度，自动注入checkbox等
 * @param propsRef
 */
export function useColumns(tablePropsRef: ComputedRef<TableProProps>) {
  const columns = autoAddChoosenElement(tablePropsRef)
  return setColumnMinWidth(columns)
}
