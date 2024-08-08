import { type ComputedRef, type Ref, type WritableComputedRef, nextTick, toRaw } from 'vue'
import { type ITableProInstance } from '@tav-ui/components/table-pro'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileTableProps } from '../types'
import { type ReturnOf } from './../../../utils'
import { type UseModeReturn } from './use-mode'

/**
 * 封装 tablepro（vxetable）操作数据的方法
 * @param options
 * @returns
 */
export function useTableActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<ITableProInstance | undefined>
  configTable: ReturnOf<UseModeReturn['useModeConfigTable']>
  loading: WritableComputedRef<any>
}) {
  const { tableProRef, configTable, loading } = options

  async function tableCreateRows(
    rows: FileActionUploadApiResponseRecord[],
    /** row 指定位置、null从第一行插入、-1 从最后插入 */
    pos: FileActionUploadApiResponseRecord | null | -1,
    useLoading = true
  ) {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    if (useLoading) loading.value.value = true
    const promiseAll = toRaw(rows).map(async (row) => tableProInstance.insertAt(row, pos))
    await Promise.all(promiseAll)
    if (useLoading) loading.value.value = false
  }

  async function tableReadRows(useLoading = true) {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    if (useLoading) loading.value.value = true
    const { fullData, tableData } = await tableProInstance.getTableData()
    if (useLoading) loading.value.value = false
    return configTable.value.api?.name.endsWith('List')
      ? (fullData as FileActionUploadApiResponseRecord[])
      : (tableData as FileActionUploadApiResponseRecord[])
  }

  async function tableUpdateRows(
    rows: FileActionUploadApiResponseRecord[],
    deleteRows: FileActionUploadApiResponseRecord[],
    /** row 指定位置、null从第一行插入、-1 从最后插入 */
    pos: FileActionUploadApiResponseRecord | null | -1,
    useLoading = true
  ) {
    await nextTick()

    if (useLoading) loading.value.value = true
    await tableCreateRows(rows, pos)
    await tableDeleteRows(deleteRows)
    if (useLoading) loading.value.value = false
  }

  async function tableDeleteRows(
    rows: FileActionUploadApiResponseRecord[],
    useLoading = true,
    deleteAll = false
  ) {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    if (useLoading) loading.value.value = true
    // 指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
    if (deleteAll) {
      await tableProInstance.remove()
    } else {
      await tableProInstance.remove(toRaw(rows))
    }
    if (useLoading) loading.value.value = false
  }

  return {
    tableCreateRows,
    tableReadRows,
    tableUpdateRows,
    tableDeleteRows,
  }
}

export type UseTableActionsReturn = ReturnOf<typeof useTableActions>
