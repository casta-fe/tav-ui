import { reactive, unref, watch } from 'vue'
import { ROW_KEY } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { ITableProInstance, TableProInstance, TableProProps } from '../types'
import type { TableProApiParams } from '../typings'

function createExendApis(
  tableRef: Ref<TableProInstance | null>,
  tablePropsRef: ComputedRef<TableProProps>
) {
  function getSelectRowKeys(): string[] {
    const {
      rowConfig: { keyField = ROW_KEY },
    } = unref(tablePropsRef)
    return unref(tableRef)!
      .getCheckboxRecords()
      .map((record) => `${record[keyField]}`)
  }

  function clearSelectedRowByKey(keyField: string | number) {
    const rowKey = `${keyField}`
    const {
      rowConfig: { keyField: _keyField = ROW_KEY },
    } = unref(tablePropsRef)
    const selectedRow = unref(tableRef)!
      .getCheckboxRecords()
      .find((record) => {
        const recordRowKey = `${record[_keyField]}`
        return recordRowKey === rowKey
      })
    unref(tableRef)!.toggleCheckboxRow(selectedRow)
  }

  function getSelectRows(): any[] {
    return unref(tableRef)!.getCheckboxRecords()
  }

  function clearSelectedRows() {
    const { checkboxConfig = {}, radioConfig = {} } = unref(tablePropsRef)

    const hasCheckbox = Object.keys(checkboxConfig).length > 0
    const hasRadioConfig = Object.keys(radioConfig).length > 0
    if (hasCheckbox) unref(tableRef)!.clearCheckboxRow()
    if (hasRadioConfig) unref(tableRef)!.clearRadioRow()
  }

  function reload(options?: TableProApiParams) {
    const { checkboxConfig = {}, radioConfig = {} } = unref(tablePropsRef)

    const hasCheckbox = Object.keys(checkboxConfig).length > 0
    const hasRadioConfig = Object.keys(radioConfig).length > 0
    if (options?.clearSelect && hasCheckbox) unref(tableRef)!.clearCheckboxRow()
    if (options?.clearSelect && hasRadioConfig) unref(tableRef)!.clearRadioRow()

    if (options) {
      const apiParams: TableProApiParams = { filter: options.filter ?? {}, model: {} }
      if (options.page && options.page > 0) {
        apiParams.model = { ...(options.model ?? {}), page: options.page }
      }
      unref(tableRef)!.commitProxy('query', { ...apiParams })
    } else {
      unref(tableRef)!.commitProxy('query')
    }
  }

  return {
    getSelectRowKeys,
    clearSelectedRowByKey,
    getSelectRows,
    clearSelectedRows,
    reload,
  }
}

/** 扩展实例 */
export type TableProExtendApis = ReturnType<typeof createExendApis>

/**
 * 扩展 vxegrid instance 实例
 * @param tableRef
 * @returns
 */
export function useExtendInstance(
  tableRef: Ref<TableProInstance | null>,
  tablePropsRef: ComputedRef<TableProProps>
) {
  const state = reactive<{
    instance: TableProInstance | null
  }>({
    instance: null,
  })

  watch(
    () => tableRef.value,
    (curTableRef, preTableRef) => {
      if (curTableRef && curTableRef !== preTableRef) {
        state.instance = curTableRef
        const extendApis = createExendApis(tableRef, tablePropsRef)
        Object.keys(extendApis).forEach((name) => {
          state.instance![name] = extendApis[name]
        })
      }
    }
  )

  return state as ITableProInstance
}
