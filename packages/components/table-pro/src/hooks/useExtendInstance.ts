import { nextTick, reactive, unref, watch } from 'vue'
import { ROW_KEY } from '../const'
import { type UseCheckboxCacheReturn } from './useCheckboxCache'
import type { ComputedRef, Ref } from 'vue'
import type { ITableProInstance, TableProInstance, TableProProps } from '../types'
import type { TableProApiParams } from '../typings'

function createExendApis(
  tableRef: Ref<TableProInstance | null>,
  tablePropsRef: ComputedRef<TableProProps>,
  filterRef: any,
  isCheckboxCacheEnabled: UseCheckboxCacheReturn['isCheckboxCacheEnabled'],
  checkboxCacheList: UseCheckboxCacheReturn['checkboxCacheList'],
  deleteCheckboxCache: UseCheckboxCacheReturn['deleteCheckboxCache'],
  deleteAllCheckboxCache: UseCheckboxCacheReturn['deleteAllCheckboxCache']
) {
  function getSelectRowKeys(): string[] {
    const {
      rowConfig: { keyField = ROW_KEY },
    } = unref(tablePropsRef)

    if (isCheckboxCacheEnabled.value) {
      return checkboxCacheList.value.map((cache) => `${cache[keyField]}`)
    } else {
      return unref(tableRef)!
        .getCheckboxRecords()
        .map((record) => `${record[keyField]}`)
    }
  }

  async function clearSelectedRowByKey(keyField: string | number) {
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

    if (isCheckboxCacheEnabled.value) {
      await deleteCheckboxCache(selectedRow)
    } else {
      await unref(tableRef)!.toggleCheckboxRow(selectedRow)
    }
  }

  function getSelectRows(): any[] {
    if (isCheckboxCacheEnabled.value) {
      return checkboxCacheList.value
    } else {
      return unref(tableRef)!.getCheckboxRecords()
    }
  }

  async function clearSelectedRows() {
    const { checkboxConfig = {}, radioConfig = {} } = unref(tablePropsRef)

    if (isCheckboxCacheEnabled.value) {
      await deleteAllCheckboxCache({
        deleteByPage: false,
      })
    } else {
      const hasCheckbox = Object.keys(checkboxConfig).length > 0
      const hasRadioConfig = Object.keys(radioConfig).length > 0
      if (hasCheckbox) await unref(tableRef)!.clearCheckboxRow()
      if (hasRadioConfig) await unref(tableRef)!.clearRadioRow()
    }
  }

  function insertRow(records: Record<string, any> | Record<string, any>[]) {
    let _records: any[] = []
    if (Array.isArray(records)) {
      _records = [...records]
    } else {
      _records = [records]
    }
    unref(tableRef)!.insertAt(_records, -1)
  }

  function updateRow(records: Record<string, any> | Record<string, any>[]) {
    const {
      rowConfig: { keyField = ROW_KEY },
    } = unref(tablePropsRef)
    const fullData = unref(tableRef)!.getTableData().fullData
    let _records: any[] = []
    if (Array.isArray(records)) {
      _records = [...records]
    } else {
      _records = [records]
    }
    const _data = fullData?.map((record) => {
      const matchedRecord = _records.find((_record) => _record[keyField] === record[keyField])
      if (matchedRecord) {
        return { ...record, ...matchedRecord }
      } else {
        return record
      }
    })
    unref(tableRef)!.loadData(_data)
  }

  function deleteRow(records: Record<string, any> | Record<string, any>[]) {
    let _records: any[] = []
    if (Array.isArray(records)) {
      _records = [...records]
    } else {
      _records = [records]
    }
    unref(tableRef)!.remove(_records)
  }

  async function reload(options?: TableProApiParams) {
    const tableFilterSearchParams = filterRef.value
      ? JSON.parse(filterRef.value.$el.dataset.filterParams)
      : {}

    const { checkboxConfig = {}, radioConfig = {} } = unref(tablePropsRef)

    const hasCheckbox = Object.keys(checkboxConfig).length > 0
    const hasRadioConfig = Object.keys(radioConfig).length > 0
    if (options?.clearSelect && hasCheckbox) unref(tableRef)!.clearCheckboxRow()
    if (options?.clearSelect && hasRadioConfig) unref(tableRef)!.clearRadioRow()

    const apiParams: TableProApiParams = { filter: tableFilterSearchParams, model: {} }
    if (options) {
      if (options.filter) {
        apiParams.filter = { ...apiParams.filter, ...(options.filter ?? {}) }
      }
      apiParams.model = {
        ...(options.model ?? {}),
        ...(options.page && options.page > 0 ? { page: options.page } : {}),
      }
    }

    if (
      isCheckboxCacheEnabled.value &&
      options?.filter &&
      Object.keys(options?.filter).length > 0 &&
      JSON.stringify(options?.filter) !== JSON.stringify(tableFilterSearchParams)
    ) {
      await deleteAllCheckboxCache({
        deleteByPage: false,
      })
      await nextTick()
    }

    // unref(tableRef)!.commitProxy('query', { ...apiParams }) 同一个表格实例下使用 query 无法重置页码，改为 reload
    unref(tableRef)!.commitProxy('reload', { ...apiParams })
  }

  return {
    getSelectRowKeys,
    clearSelectedRowByKey,
    getSelectRows,
    clearSelectedRows,
    insertRow,
    updateRow,
    deleteRow,
    reload,
  }
}

/** 扩展实例 */
type OuterExtendApis = {
  setLoading: (loading: boolean) => void
  resetFilterInput: () => void
  resizeTableHeight: () => void
  showExportModal: () => void
  showColumnsModa: () => void
  clearCellTooltip: () => void
}
export type TableProExtendApis = ReturnType<typeof createExendApis> & OuterExtendApis

/**
 * 扩展 vxegrid instance 实例
 * @param tableRef
 * @returns
 */
export function useExtendInstance(
  tableRef: Ref<TableProInstance | null>,
  tablePropsRef: ComputedRef<TableProProps>,
  outerExtendApis: OuterExtendApis,
  filterRef: Ref<ComputedRef | null>,
  isCheckboxCacheEnabled: UseCheckboxCacheReturn['isCheckboxCacheEnabled'],
  checkboxCacheList: UseCheckboxCacheReturn['checkboxCacheList'],
  deleteCheckboxCache: UseCheckboxCacheReturn['deleteCheckboxCache'],
  deleteAllCheckboxCache: UseCheckboxCacheReturn['deleteAllCheckboxCache']
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
        const extendApis = createExendApis(
          tableRef,
          tablePropsRef,
          filterRef,
          isCheckboxCacheEnabled,
          checkboxCacheList,
          deleteCheckboxCache,
          deleteAllCheckboxCache
        )
        Object.keys(extendApis).forEach((name) => {
          //@ts-ignore
          state.instance![name] = extendApis[name]
        })
        Object.keys(outerExtendApis).forEach((name) => {
          //@ts-ignore
          state.instance![name] = outerExtendApis[name]
        })
        //@ts-ignore
        state.instance!['filterRef'] = filterRef.value
      }
    }
  )

  return state as ITableProInstance
}
