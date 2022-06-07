import { nextTick, unref } from 'vue'
import { warn } from '@tav-ui/utils/log'
import { CamelCaseToCls, ComponentActionName, MIN_WIDTH, MIN_WIDTH_SMALL } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProColumn, TableProInstance, TableProProps } from '../types'

const SELECT_COMPONENTS = ['checkbox', 'radio']
const ACTION_COLUMNS = ['actions', 'action']
const ComponentActionPrefixCls = CamelCaseToCls(ComponentActionName)

/**
 * 设置最小宽度
 * @param columns
 * @returns
 */
function setColumnMinWidth(columns: TableProColumn[]) {
  return columns?.map((column: TableProColumn) => {
    if (column.type && SELECT_COMPONENTS.includes(column.type)) {
      if (!column.width) column.width = MIN_WIDTH_SMALL
    } else if (column.field && ACTION_COLUMNS.includes(column.field)) {
      // column.showOverflow = false
    } else {
      if (!column.minWidth) column.minWidth = MIN_WIDTH
    }
    return column
  })
}

/**
 * 自动添加 checkbox/radio
 * @param tablePropsRef
 * @returns
 */
function autoAddChoosenElement(tablePropsRef: ComputedRef<TableProProps>) {
  const { columns = [], checkboxConfig = {}, radioConfig = {} } = unref(tablePropsRef)
  const hasCheckbox = Object.keys(checkboxConfig).length > 0
  const hasRadioConfig = Object.keys(radioConfig).length > 0
  const isColumnsHasCheckbox = columns?.find((column) => column.type === 'checkbox')
  const isColumnsHasRadio = columns?.find((column) => column.type === 'radio')

  if (!isColumnsHasCheckbox && hasCheckbox) {
    columns.unshift({ type: 'checkbox', fixed: 'left' })
  }

  if (!isColumnsHasRadio && hasRadioConfig) {
    columns.unshift({
      type: 'radio',
      fixed: 'left',
    })
  }

  return columns
}

export async function setActionWidth(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>,
  fields = ACTION_COLUMNS
) {
  const { columns = [] } = unref(tablePropsRef)
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
  } else {
    warn(`tablePro column field is required, must be 'action'`)
  }
}

/**
 * 操作列数据，设置最小宽度，自动注入checkbox等
 * @param propsRef
 */
export function useColumns(tablePropsRef: ComputedRef<TableProProps>) {
  const columns = autoAddChoosenElement(tablePropsRef)
  return setColumnMinWidth(columns)
}
