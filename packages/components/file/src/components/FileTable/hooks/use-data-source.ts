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
  VersionCachesController: VersionCaches
) {
  const _dataSource = JSON.parse(JSON.stringify(await tableReadRows()))
  const dataSource = _dataSource.length > 0 ? _dataSource : rows

  // emits('change', rows, dataSource, 'upload')
  if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
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
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
  refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
}) {
  const {
    mergedProps,
    tableCreateRows,
    tableReadRows,
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
          await tableCreateRows({
            rows,
            position: null,
          })
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController
          )
          if (mergedProps.value.mode === 'updateInstantly' && !mergedProps.value.dataSource) {
            // 无外部传入的 datasource 才操作
            await refreshTableDataApiAction()
          }
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
          await tableCreateRows({
            rows,
            position: null,
          })
          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController
          )
          if (mergedProps.value.mode === 'updateInstantly' && !mergedProps.value.dataSource) {
            // 无外部传入的 datasource 才操作
            await refreshTableDataApiAction()
          }
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
          curdatasource !== predatasource
          // &&
          // // 因为使用 datasource 时 datasource 传入 vxetable 被自动转为双向绑定数据然后其内部会为每条数据附带 __id 字段这样会再次触发 watch
          // // 为了优化所以判断当 curdatasource 包含 __id 时再执行，!curdatasource.includes('__id') && predatasource === undefined 是为了在初始化时触发一次，将 fileactualids 数据传出去
          // ((!curdatasource.includes('__id') && predatasource === undefined) ||
          //   curdatasource.includes('__id'))
        ) {
          const rows = JSON.parse(
            JSON.stringify([...(mergedProps.value.dataSource ?? [])])
          ) as FileActionUploadApiResponseRecord[]

          VersionCachesController.deleteAllFileCaches()

          if (rows.length > 0) {
            VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
          }

          await handleDataSourceChangeEmit(
            rows,
            tableReadRows,
            emits,
            mergedProps,
            VersionCachesController
          )
        }
      },
      {
        immediate: true,
      }
    )
  })
}
