import { type ComputedRef, type Ref, nextTick, toRaw } from 'vue'
import { type ITableProInstance, type TableProProps } from '@tav-ui/components/table-pro'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileTableProps } from '../types'

/**
 * 封装 tablepro（vxetable）操作数据的方法
 * @param options
 * @returns
 */
export function useTableActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<ITableProInstance | undefined>
  configTable: ComputedRef<{
    data: FileActionUploadApiResponseRecord[] | undefined
    api?: ((...args: any[]) => Promise<any>) | undefined
    beforeApi?: ((...args: any[]) => Promise<any>) | undefined
    afterApi?: ((...args: any[]) => Promise<any>) | undefined
    pagerConfig: TableProProps['pagerConfig']
  }>
}) {
  const { tableProRef, configTable } = options

  async function tableCreateRows(
    rows: FileActionUploadApiResponseRecord[],
    /** row 指定位置、null从第一行插入、-1 从最后插入 */
    pos: FileActionUploadApiResponseRecord | null | -1
  ) {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    const promiseAll = toRaw(rows).map(async (row) => tableProInstance.insertAt(row, pos))
    await Promise.all(promiseAll)
  }

  async function tableReadRows() {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    const { fullData, tableData } = await tableProInstance.getTableData()
    return configTable.value.api?.name.endsWith('List')
      ? (fullData as FileActionUploadApiResponseRecord[])
      : (tableData as FileActionUploadApiResponseRecord[])
  }

  async function tableUpdateRows(
    rows: FileActionUploadApiResponseRecord[],
    deleteRows: FileActionUploadApiResponseRecord[],
    /** row 指定位置、null从第一行插入、-1 从最后插入 */
    pos: FileActionUploadApiResponseRecord | null | -1
  ) {
    await nextTick()
    await tableCreateRows(rows, pos)
    await tableDeleteRows(deleteRows)
  }

  async function tableDeleteRows(rows: FileActionUploadApiResponseRecord[]) {
    await nextTick()
    const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']

    // 指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
    await tableProInstance.remove(toRaw(rows))
  }

  return {
    tableCreateRows,
    tableReadRows,
    tableUpdateRows,
    tableDeleteRows,
  }
}
