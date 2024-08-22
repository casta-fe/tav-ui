import { type ComputedRef, type Ref, type WritableComputedRef, computed, ref, unref } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import {
  type ApiQueryFileByActualIds,
  type FileActualIdsObjectArray,
  type FileTableProps,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'
import { type ReturnOf } from '../../../utils'

export function useHandleDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  loading: WritableComputedRef<Ref<boolean>>
}) {
  const { mergedProps, loading } = options

  function apiQueryFileByActualIdsOptions(apiParams: {
    actualIds: FileTableProps['apiParams']['actualIds']
  }) {
    if (!mergedProps.value.apiQueryFileByActualIds) {
      console.warn('[tavui TaFileTable] apiQueryFileByActualIds is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ApiQueryFileByActualIds,
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileByActualIds,
      beforeApi: mergedProps.value.beforeApiQueryFileByActualIds,
      afterApi: mergedProps.value.afterApiQueryFileByActualIds,
      apiParams: {
        fileActualIds: apiParams.actualIds,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
    }

    // if (mergedProps.value.mode === 'read') {
    // } else if (mergedProps.value.mode === 'create') {
    // } else if (mergedProps.value.mode === 'update') {
    // } else {
    // }

    return options
  }

  const dataSourceRef = ref<FileActionUploadApiResponseRecord[]>([])
  async function handleDataSource(rows: FileTableProps['dataSource'] = []) {
    loading.value.value = true
    if (rows[0]) {
      if (typeof rows[0] === 'string') {
        // 字符串数组，需要查接口处理数据格式
        const options = apiQueryFileByActualIdsOptions({ actualIds: rows as string[] })
        if (!options) {
          loading.value.value = false
          dataSourceRef.value = []
        }
        const { success, data } = await mergedProps.value.apiQueryFileByActualIds!(
          options!.apiParams
        )
        if (success === true && data) {
          loading.value.value = false
          dataSourceRef.value = [...data]
        }
        return
      } else if (Reflect.has(rows[0], 'versionList')) {
        // 对象数组，需要处理数据格式
        dataSourceRef.value = (rows as FileActualIdsObjectArray)
          .map((row) => row.versionList.at(-1))
          .filter(Boolean) as FileActionUploadApiResponseRecord[]

        loading.value.value = false
        return
      }
    }

    dataSourceRef.value = [...(rows as FileActionUploadApiResponseRecord[])]
    loading.value.value = false
    return
  }

  const dataSource = computed(() => unref(dataSourceRef))

  return {
    apiActions: {
      apiQueryFileByActualIdsOptions,
    },
    dataSource,
    handleDataSource,
  }
}

export type UseHandleDataSourceReturn = ReturnOf<typeof useHandleDataSource>
