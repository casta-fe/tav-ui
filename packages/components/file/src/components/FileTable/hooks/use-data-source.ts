import { type ComputedRef, type SetupContext, onMounted, watch } from 'vue'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileTableEmits, type FileTableProps, type FileTableReloadApiParams } from '../types'
import { type VersionCaches } from './../../../hooks'
import { type UseTableActionsReturn } from './use-table-actions'

async function handleDataSourceChangeEmit(
  rows: FileActionUploadApiResponseRecord[],
  tableReadRows: UseTableActionsReturn['tableReadRows'],
  emits: SetupContext<FileTableEmits>['emit'],
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>,
  VersionCachesController: VersionCaches,
  refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
) {
  const _dataSource = JSON.parse(JSON.stringify(await tableReadRows()))
  const dataSource = _dataSource.length > 0 ? _dataSource : rows

  // emits('change', rows, dataSource, 'upload')
  if (mergedProps.value.mode === 'updateInstantly') {
    emits('actualidsChange', VersionCachesController.getCaches())
  } else if (mergedProps.value.mode === 'update') {
    emits('actualidsChange', VersionCachesController.getCaches())
  } else {
    emits(
      'actualidsChange',
      dataSource.map((file: any) => file.actualId)
    )
  }
}

export function useDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableCreateRows: UseTableActionsReturn['tableCreateRows']
  tableReadRows: UseTableActionsReturn['tableReadRows']
  tableDeleteRows: UseTableActionsReturn['tableDeleteRows']
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
  refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
}) {
  const {
    mergedProps,
    tableCreateRows,
    tableReadRows,
    tableDeleteRows,
    emits,
    VersionCachesController,
    refreshTableDataApiAction,
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
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController,
            refreshTableDataApiAction
          )
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
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController,
            refreshTableDataApiAction
          )
        }
      }
    }
  )

  onMounted(() => {
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

          if (predatasource !== undefined) {
            await tableDeleteRows([], true, true)
          }

          if (rows.length > 0) {
            await tableCreateRows(rows, null)
            VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          } else {
            await tableDeleteRows([], true, true)
            VersionCachesController.deleteAllFileCaches()
          }
          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController,
            refreshTableDataApiAction
          )
        }
      },
      {
        immediate: true,
      }
    )
  })
}
