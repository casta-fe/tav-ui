import { type ComputedRef, type Ref, type WritableComputedRef, toRaw } from 'vue'
import { type ITableProInstance } from '@tav-ui/components/table-pro'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileTableProps } from '../types'
import { type ReturnOf } from './../../../utils'
import { type UseModeReturn } from './use-mode'

export interface TableCreateRowsOptions {
  /** 要新增的行数据 */
  rows: FileActionUploadApiResponseRecord[]
  /** 插入行的位置 */
  position?: FileActionUploadApiResponseRecord[] | FileActionUploadApiResponseRecord | null | -1
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface TableReadRowsOptions {
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface TableUpdateRowsOptions {
  /** 要新增的行数据 */
  rows: FileActionUploadApiResponseRecord[]
  /** 要删除的行数据 */
  deleteRows: FileActionUploadApiResponseRecord[]
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

export interface TableDeleteRowsOptions {
  /** 要删除的行数据，不传的话默认删除全部 */
  rows?: FileActionUploadApiResponseRecord[]
  /** 使用组件内部 loading 状态 */
  useLoading?: boolean
}

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
  const { tableProRef, loading } = options

  async function tableCreateRows(_options: TableCreateRowsOptions) {
    const { rows, position, useLoading } = _options
    const tableProInstance = (tableProRef.value as any)?.instance as
      | ITableProInstance['instance']
      | null

    if (useLoading !== undefined && useLoading) loading.value.value = true
    let promiseAll
    if (Array.isArray(position)) {
      promiseAll = toRaw(rows).map(async (row, idx) => {
        Reflect.deleteProperty(row, '__id') // 删掉 vxetable 自动生成的 id
        const result = await tableProInstance?.insertAt(row, position[idx])
        return result
      })
    } else {
      promiseAll = toRaw(rows).map(async (row) => {
        Reflect.deleteProperty(row, '__id') // 删掉 vxetable 自动生成的 id
        const result = await tableProInstance?.insertAt(row, position)
        return result
      })
    }
    await Promise.all(promiseAll)
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  async function tableReadRows(_options: TableReadRowsOptions = {}) {
    const { useLoading } = _options
    const tableProInstance = (tableProRef.value as any)?.instance as
      | ITableProInstance['instance']
      | null

    if (useLoading !== undefined && useLoading) loading.value.value = true
    // const { fullData, tableData } = await tableProInstance.getTableData()
    const { fullData } = (await tableProInstance?.getTableData()) || { fullData: [], tableData: [] }
    if (useLoading !== undefined && useLoading) loading.value.value = false
    // return configTable.value.api?.name.endsWith('List')
    //   ? (fullData as FileActionUploadApiResponseRecord[])
    //   : (tableData as FileActionUploadApiResponseRecord[])
    return fullData
  }

  async function tableUpdateRows(_options: TableUpdateRowsOptions) {
    const { rows, deleteRows, useLoading } = _options

    if (useLoading !== undefined && useLoading) loading.value.value = true
    await tableCreateRows({
      rows,
      position: deleteRows,
    })
    await tableDeleteRows({ rows: deleteRows })
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  async function tableDeleteRows(_options: TableDeleteRowsOptions) {
    const { rows, useLoading } = _options
    const tableProInstance = (tableProRef.value as any)?.instance as
      | ITableProInstance['instance']
      | null

    if (useLoading !== undefined && useLoading) loading.value.value = true
    // 指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
    if (rows === undefined) {
      await tableProInstance?.remove()
    } else {
      await tableProInstance?.remove(toRaw(rows))
    }
    if (useLoading !== undefined && useLoading) loading.value.value = false
  }

  return {
    tableCreateRows,
    tableReadRows,
    tableUpdateRows,
    tableDeleteRows,
  }
}

export type UseTableActionsReturn = ReturnOf<typeof useTableActions>
