import { type ComputedRef, type Ref, type SetupContext, onMounted, watch } from 'vue'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import {
  validateDataSourceIsObjectArray,
  validateVersionCachesHasApiFile,
  validateVersionCachesHasLocalFile,
} from '../../../utils'
import {
  type FileActualIdsObjectArray,
  type FileTableEmits,
  type FileTableProps,
  type FileTableReloadApiParams,
} from '../types'
import { type VersionCaches } from './../../../hooks'
import { type UseTableActionsReturn } from './use-table-actions'

export function useDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableCreateRows: UseTableActionsReturn['tableCreateRows']
  tableReadRows: UseTableActionsReturn['tableReadRows']
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
  refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
  dataSource: Ref<FileActionUploadApiResponseRecord[]>
}) {
  const {
    mergedProps,
    tableCreateRows,
    tableReadRows,
    emits,
    VersionCachesController,
    refreshTableDataApiAction,
    dataSource,
  } = options

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
      () => JSON.stringify(dataSource.value),
      async (curdatasource, predatasource) => {
        if (curdatasource && curdatasource !== predatasource) {
          const rows = JSON.parse(
            JSON.stringify([...(dataSource.value ?? [])])
          ) as FileActionUploadApiResponseRecord[]

          VersionCachesController.deleteAllFileCaches()

          if (rows.length > 0) {
            VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)

            // 如果传进来的 datasource 为对象数组这里需要将 versionlist 写入缓存
            if (validateDataSourceIsObjectArray(mergedProps.value.dataSource)) {
              const _dataSource = mergedProps.value.dataSource as FileActualIdsObjectArray
              _dataSource.forEach((data: any) => {
                const row = rows.find((r) => r.actualId === data.actualId)
                const versionList = data.versionList
                if (row && versionList) {
                  VersionCachesController.createFileCaches(row, versionList)
                }

                if (
                  mergedProps.value.mode === 'update' && // datasource 为对象数组的模式只有 update、updateinstantly，而只有 update 模式下会对更新操作做控制需要设置 actualidCaches
                  validateVersionCachesHasApiFile(VersionCachesController.caches[data.actualId]) && // 确定当前数据非本地上传数据，因为本地上传数据无论如何更新 bizid、bizkey均为空
                  validateVersionCachesHasLocalFile(VersionCachesController.caches[data.actualId]) // 通过改判断可确定该接口数据是否被更新过，因为更新后的数据 bizid、bizkey均为空
                ) {
                  // 标识当前数据是否被更新过，如果被更新过则需要在初始化时将 actualId 重置回 actualidCaches 数组，主要用于更新模式
                  VersionCachesController.actualidCaches.add(data.actualId)
                }
              })
            }

            await handleDataSourceChangeEmit(
              rows,
              tableReadRows,
              emits,
              mergedProps,
              VersionCachesController
            )
          }
        }
      },
      {
        immediate: true,
      }
    )
  })

  return {
    handleDataSourceChangeEmit,
  }
}
