import { type ComputedRef, type Ref, type SetupContext, onMounted, watch } from 'vue'
import {
  type FileActionUploadApiResponseRecord,
  type FileActualIdsObjectArray,
  type GlobalConfigFileProps,
} from '../../typings'
import {
  validateDataSourceIsObjectArray,
  validateVersionCachesHasApiFile,
  validateVersionCachesHasLocalFile,
} from '../../utils'
import { type FileCardEmits, type FileCardProps } from '../types'
import { type VersionCaches } from './../../hooks'

export function useDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  emits: SetupContext<FileCardEmits>['emit']
  VersionCachesController: VersionCaches
  dataSource: Ref<FileActionUploadApiResponseRecord[]>
}) {
  const { mergedProps, emits, VersionCachesController, dataSource } = options

  async function handleDataSourceChangeEmit(
    rows: FileActionUploadApiResponseRecord[],
    emits: SetupContext<FileCardEmits>['emit'],
    mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>,
    VersionCachesController: VersionCaches
  ) {
    const dataSource = rows

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

  onMounted(() => {
    /** 外部传入数据源 */
    watch(
      () => JSON.stringify(dataSource.value),
      async (curdatasource, predatasource) => {
        if (curdatasource && curdatasource !== predatasource) {
          const rows = JSON.parse(
            JSON.stringify([...(dataSource.value ?? [])])
          ) as FileActionUploadApiResponseRecord[]

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
          } else {
            VersionCachesController.deleteAllFileCaches()
          }

          await handleDataSourceChangeEmit(rows, emits, mergedProps, VersionCachesController)
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
