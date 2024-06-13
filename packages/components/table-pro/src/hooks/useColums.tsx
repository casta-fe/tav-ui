import { unref } from 'vue'
import { Checkbox } from 'ant-design-vue'
import {
  ACTION_COLUMNS,
  ComponentCellName,
  MIN_WIDTH,
  MIN_WIDTH_SMALL,
  SELECT_COMPONENTS,
} from '../const'
import type { /*ComputedRef,*/ Ref } from 'vue'
import type { TableProColumn, TableProGridEmit, TableProInstance, TableProProps } from '../types'

/**
 * 自动添加 checkbox/radio
 * @param tablePropsRef
 * @returns
 */
function autoAddChoosenElement(
  // tablePropsRef: ComputedRef<TableProProps>,
  columns: TableProProps['columns'] = [],
  checkboxConfig: TableProProps['checkboxConfig'],
  radioConfig: TableProProps['radioConfig'],
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  // const { columns = [], checkboxConfig, radioConfig } = unref(tablePropsRef)
  // const hasCheckbox = Object.keys(checkboxConfig).length > 0
  // const hasRadioConfig = Object.keys(radioConfig).length > 0
  const isColumnsHasCheckbox = columns?.find((column) => column.type === 'checkbox')
  const isColumnsHasRadio = columns?.find((column) => column.type === 'radio')

  // column 可能是promise需要等有值后再执行，减少rerender
  if (!columns.length) return columns

  if (!isColumnsHasCheckbox && checkboxConfig.enabled) {
    columns.unshift({
      field: 'checkboxField',
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
      field: 'radioField',
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
          // if (!column.minWidth) column.minWidth = MIN_WIDTH + 10

          // 测试性能
          if (!column.minWidth) column.minWidth = MIN_WIDTH
          if (!column.maxWidth) column.maxWidth = MIN_WIDTH + 20
          // if (!column.width) column.width = MIN_WIDTH + 20
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
  const handleWrapper = (column: TableProColumn) => {
    const { customRender } = column
    column['cellRender'] = {
      name: ComponentCellName,
      options: [{ customRender }],
    }
    return column
  }
  return columns.length
    ? columns.map((column: TableProColumn) => {
        const { children } = column
        if (children && children.length) {
          column.children = children.map((_column: TableProColumn) => handleWrapper(_column))
          return column
        } else {
          return handleWrapper(column)
        }
      })
    : columns
}

/**
 * 确保固定列无论什么情况都 visible，即使 fixed && !visible 也要显示
 *
 * vxetable 多级表头情况下，以及表头添加 visible 不生效，而添加 fixed 却生效，这里做特殊处理
 *
 * @param columns
 * @returns
 */
function setFixedColumnVisible(columns: TableProColumn[]) {
  const handler = (column: TableProColumn) => {
    if (column.fixed && !column.visible) {
      column.visible = true
    }
    return column
  }

  return columns.length
    ? columns?.map((column: TableProColumn) => {
        const { children } = column
        if (children && children.length) {
          column.children = children.map((_column: TableProColumn) => handler(_column))
          return handler(column)
        } else {
          return handler(column)
        }
      })
    : columns
}

/**
 * 抹平多级表头的 fixed 差异，比如二级表头有 fixed 但是一级没有
 * @param columns
 * @returns
 */
function setFixedMultiHeader(columns: TableProColumn[]) {
  let fixed: any[] = []

  const handler = (column: TableProColumn, idx?: number, parentColumn?: TableProColumn) => {
    // 如果传入父级表头那么进行处理，没传入则不用处理
    if (parentColumn) {
      // 父级表头如果有 fixed 那么依次赋值给子级
      if (Reflect.has(parentColumn, 'fixed')) {
        column.fixed = parentColumn.fixed
      } else {
        // 父级表头没有 fixed 那么依次将子级的 fixed 缓存
        fixed.push(column.fixed)
      }

      // 当循环来到最后一个子级时，将缓存的 fixed 过滤取值，如果有值则说明父级没有 fixed，则取出第一个给父级赋值，第一个如果没值那么说明子级也没有 fixed，那么赋值 undefined 即可
      if (idx === parentColumn.children!.length - 1 && fixed.length) {
        const fixedResult = fixed.filter((val) => val !== undefined)
        parentColumn.fixed = fixedResult.length ? fixedResult[0] : undefined
        // 回溯当前父级下的所有子级
        parentColumn.children!.forEach((childColumn) => (childColumn.fixed = parentColumn.fixed))
      }
    }
    return column
  }

  return columns.length
    ? columns?.map((column: TableProColumn) => {
        const { children } = column
        if (children && children.length) {
          fixed = []
          column.children = children.map((_column: TableProColumn, idx) =>
            handler(_column, idx, column)
          )
          return handler(column)
        } else {
          return handler(column)
        }
      })
    : columns
}

/**
 * 抹平多级表头的 visible 差异，比如二级表头有 visible 但是一级没有
 * @param columns
 * @returns
 */
function setVisibleMultiHeader(columns: TableProColumn[]) {
  let visible: any[] = []

  const handler = (column: TableProColumn, idx?: number, parentColumn?: TableProColumn) => {
    // 如果传入父级表头那么进行处理，没传入则不用处理
    if (parentColumn) {
      // 父级表头如果有 visible 那么依次赋值给子级
      if (Reflect.has(parentColumn, 'visible')) {
        column.visible = parentColumn.visible
      } else {
        // 父级表头没有 visible 那么依次将子级的 visible 缓存
        visible.push(column.visible)
      }

      // 当循环来到最后一个子级时，将缓存的 visible 过滤取值，如果有值则说明父级没有 visible，则取出第一个给父级赋值，第一个如果没值那么说明子级也没有 visible，那么赋值 undefined 即可
      if (idx === parentColumn.children!.length - 1 && visible.length) {
        const visibleResult = visible.filter((val) => val !== undefined)
        parentColumn.visible = visibleResult.length ? visibleResult[0] : undefined
        // 回溯当前父级下的所有子级
        parentColumn.children!.forEach(
          (childColumn) => (childColumn.visible = parentColumn.visible)
        )
      }
    }
    return column
  }

  return columns.length
    ? columns?.map((column: TableProColumn) => {
        const { children } = column
        if (children && children.length) {
          visible = []
          column.children = children.map((_column: TableProColumn, idx) =>
            handler(_column, idx, column)
          )
          return handler(column)
        } else {
          return handler(column)
        }
      })
    : columns
}

/**
 * 操作列数据，设置最小宽度，自动注入checkbox等
 * @param propsRef
 */
export function useColumns(
  // tablePropsRef: ComputedRef<TableProProps>,
  columns: TableProProps['columns'] = [],
  checkboxConfig: TableProProps['checkboxConfig'],
  radioConfig: TableProProps['radioConfig'],
  tableRef: Ref<TableProInstance | null>,
  emit: TableProGridEmit
) {
  // const autoAddChoosenElementColumns = autoAddChoosenElement(tablePropsRef, tableRef, emit)
  const autoAddChoosenElementColumns = autoAddChoosenElement(
    columns,
    checkboxConfig,
    radioConfig,
    tableRef,
    emit
  )
  const setColumnMinWidthColumns = setColumnMinWidth(autoAddChoosenElementColumns)
  const setFixedMultiHeaderColumns = setFixedMultiHeader(setColumnMinWidthColumns)
  const setVisibleMultiHeaderColumns = setVisibleMultiHeader(setFixedMultiHeaderColumns)
  const setFixedColumnVisibleColumns = setFixedColumnVisible(setVisibleMultiHeaderColumns)
  return wrapperColumnSlot(setFixedColumnVisibleColumns)
}
