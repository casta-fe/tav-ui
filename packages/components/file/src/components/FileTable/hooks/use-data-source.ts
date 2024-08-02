import { type ComputedRef, type SetupContext, watch } from 'vue'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileTableEmits, type FileTableProps } from '../types'
import { type VersionCaches } from './../../../hooks'
import { type UseTableActionsReturn } from './use-table-actions'

async function handleDataSourceChangeEmit(
  rows: FileActionUploadApiResponseRecord[],
  tableReadRows: UseTableActionsReturn['tableReadRows'],
  emits: SetupContext<FileTableEmits>['emit']
) {
  const _dataSource = JSON.parse(JSON.stringify(await tableReadRows()))
  const dataSource = _dataSource.length > 0 ? _dataSource : rows
  // emits('change', rows, dataSource, 'upload')
  emits(
    'actualidsChange',
    dataSource.map((file: any) => file.actualId)
  )

  // 这里隐藏掉，减少一次刷新，因为立即更新模式下会带着 bizid/bizcode 上传，成功已入库
  // (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') && (await refreshTableData())
}

export function useDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableCreateRows: UseTableActionsReturn['tableCreateRows']
  tableReadRows: UseTableActionsReturn['tableReadRows']
  tableDeleteRows: UseTableActionsReturn['tableDeleteRows']
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
}) {
  const {
    mergedProps,
    tableCreateRows,
    tableReadRows,
    tableDeleteRows,
    emits,
    VersionCachesController,
  } = options

  /** upload 组件上传成功数据源 */
  watch(
    () => JSON.stringify(mergedProps.value.__uploadDataSource),
    async (curdatasource, predatasource) => {
      if (curdatasource && curdatasource !== predatasource) {
        const rows = JSON.parse(
          JSON.stringify([...(mergedProps.value.__uploadDataSource ?? [])])
        ) as FileActionUploadApiResponseRecord[]

        if (rows.length > 0) {
          await tableCreateRows(rows, null)
          await handleDataSourceChangeEmit(rows, tableReadRows, emits)
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
        }
      }
    }
  )

  /** uploadlink 组件上传成功数据源 */
  watch(
    () => JSON.stringify(mergedProps.value.__uploadLinkDataSource),
    async (curdatasource, predatasource) => {
      if (curdatasource && curdatasource !== predatasource) {
        const rows = JSON.parse(
          JSON.stringify([...(mergedProps.value.__uploadLinkDataSource ?? [])])
        ) as FileActionUploadApiResponseRecord[]

        if (rows.length > 0) {
          await tableCreateRows(rows, null)
          await handleDataSourceChangeEmit(rows, tableReadRows, emits)
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
        }
      }
    }
  )

  /** 外部传入数据源 */
  watch(
    () => JSON.stringify(mergedProps.value.dataSource),
    async (curdatasource, predatasource) => {
      if (
        curdatasource &&
        curdatasource !== predatasource &&
        // datasource 载入后变为双向绑定数据，vxetable 会自动带上 __id 这样还会触发 watch 所以手动排除
        !curdatasource.includes('__id')
      ) {
        const rows = JSON.parse(
          JSON.stringify([...(mergedProps.value.dataSource ?? [])])
        ) as FileActionUploadApiResponseRecord[]

        if (rows.length > 0) {
          await tableCreateRows(rows, null)
          await handleDataSourceChangeEmit(rows, tableReadRows, emits)
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
        } else {
          const currentRows = await tableReadRows()
          await tableDeleteRows(currentRows)
          await handleDataSourceChangeEmit([], tableReadRows, emits)
          VersionCachesController.deleteAllFileCaches()
        }
      }
    }
  )
}
