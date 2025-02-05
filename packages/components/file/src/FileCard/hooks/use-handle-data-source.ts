import { type ComputedRef, type SetupContext, computed, shallowRef, unref } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type ApiQueryFileByActualIds, type FileCardEmits, type FileCardProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FileActualIdsObjectArray,
  type GlobalConfigFileProps,
} from '../../typings'
import {
  type UseRequestHandleApiDefaultOptions,
  type UseRequestReturn,
  type VersionCaches,
} from '../../hooks'
import {
  type ReturnOf,
  validateDataSourceIsObjectArray,
  validateDataSourceIsStringArray,
} from '../../utils'

export function useHandleDataSource(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  emits: SetupContext<FileCardEmits>['emit']
  VersionCachesController: VersionCaches
  ApiResult: ComputedRef<any>
  ApiError: ComputedRef<string>
  handleApi: UseRequestReturn['handleApi']
}) {
  const { mergedProps, ApiResult, ApiError, handleApi } = options

  //:========================================: api actions :========================================://
  function apiQueryFileOptions(apiParams: FileCardProps['apiParams']) {
    if (!mergedProps.value.apiQueryFileList) {
      console.warn('[tavui TaFileCard] apiQueryFileList is undefined')
      return
    }

    const modeQueryApiTypeListConfig: any = {
      api: mergedProps.value.apiQueryFileList,
      beforeApi: mergedProps.value.beforeApiQueryFileList,
      afterApi: mergedProps.value.afterApiQueryFileList,
      apiParams: {
        appId: apiParams.appId,
        businessCheck: apiParams.businessCheck,
        ...(apiParams.businessDisplayItem
          ? {
              businessDisplayItem: apiParams.businessDisplayItem,
            }
          : {}),
        ...(apiParams.businessIds
          ? {
              businessIds: apiParams.businessIds,
            }
          : {}),
        businessKey: apiParams.businessKey,
        ...(apiParams.businessSearchItems
          ? {
              businessSearchItems: apiParams.businessSearchItems,
            }
          : {}),
        endTime: apiParams.endTime,
        ...(typeof apiParams.excludeDeleted !== 'undefined'
          ? { excludeDeleted: apiParams.excludeDeleted }
          : {}),
        ...(typeof apiParams.excludeStaging !== 'undefined'
          ? { excludeStaging: apiParams.excludeStaging }
          : {}),
        ...(apiParams.ids ? { ids: apiParams.ids } : {}),
        moduleCode: apiParams.moduleCode,
        owners: apiParams.owners,
        permissionControl: apiParams.permissionControl,
        ...(apiParams.searchValue ? { searchValue: apiParams.searchValue } : {}),
        ...(apiParams.startTime ? { startTime: apiParams.startTime } : {}),
        ...(apiParams.suffix ? { suffix: apiParams.suffix } : {}),
        ...(apiParams.typeCodes ? { typeCodes: apiParams.typeCodes } : {}),
        ...(apiParams.visibleSubModules ? { visibleSubModules: apiParams.visibleSubModules } : {}),
      },
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileCardProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      ...modeQueryApiTypeListConfig,
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
    }

    if (mergedProps.value.mode === 'read') {
      //
    } else if (mergedProps.value.mode === 'create') {
      // 必须为空数据状态
    } else if (mergedProps.value.mode === 'update') {
      //
    } else {
      //
    }

    return options
  }

  function apiQueryFileByActualIdsOptions(apiParams: {
    actualIds: FileCardProps['apiParams']['actualIds']
  }) {
    if (!mergedProps.value.apiQueryFileByActualIds) {
      console.warn('[tavui TaFileCard] apiQueryFileByActualIds is undefined')
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
  //:========================================: api actions :========================================://

  async function handleStringArrayDataSource() {
    // 字符串数组，需要查接口处理数据格式
    const options = apiQueryFileByActualIdsOptions({
      actualIds: mergedProps.value.dataSource as string[],
    })
    if (!options) {
      setDataSource([])
      return
    }
    await handleApi(options)
    if (!ApiError.value) {
      setDataSource(ApiResult.value)
      return
    } else {
      setDataSource([])
      return
    }
  }

  function handleObjectArrayDataSource() {
    // 对象数组，需要处理数据格式
    setDataSource(
      (mergedProps.value.dataSource as FileActualIdsObjectArray)
        .map((row) => row.versionList.at(-1))
        .filter(Boolean) as FileActionUploadApiResponseRecord[]
    )
  }

  async function handleApiDataSource(params?: any) {
    const options = apiQueryFileOptions({ ...mergedProps.value.apiParams, ...(params ?? {}) })
    if (!options) {
      setDataSource([])
      return
    }
    await handleApi(options)
    if (!ApiError.value && ApiResult.value.length > 0) {
      setDataSource(ApiResult.value)
      return
    } else {
      setDataSource([])
      return
    }
  }

  const dataSourceRef = shallowRef<FileActionUploadApiResponseRecord[]>([])
  async function handleDataSource() {
    if (mergedProps.value.mode === 'read') {
      if (mergedProps.value.dataSource) {
        /**
         * 只读模式，使用 datasource 数据源
         * 1. reload 方法直接返回（给不执行提示）
         */
        if (validateDataSourceIsStringArray(mergedProps.value.dataSource)) {
          await handleStringArrayDataSource()
        } else if (validateDataSourceIsObjectArray(mergedProps.value.dataSource)) {
          handleObjectArrayDataSource()
        } else {
          setDataSource(mergedProps.value.dataSource as FileActionUploadApiResponseRecord[])
        }
      } else {
        /**
         * 只读模式，使用 api 数据源
         * 1. 支持不分页接口
         */
        await handleApiDataSource()
      }
    } else if (mergedProps.value.mode === 'create') {
      if (mergedProps.value.dataSource) {
        /**
         * 新增模式，使用 datasource 数据源
         * 1. reload 方法直接返回（给不执行提示）
         */
        if (validateDataSourceIsStringArray(mergedProps.value.dataSource)) {
          await handleStringArrayDataSource()
        } else if (validateDataSourceIsObjectArray(mergedProps.value.dataSource)) {
          handleObjectArrayDataSource()
        } else {
          setDataSource([])
        }
      } else {
        /**
         * 新增模式，不支持 api 数据源，因为此时无 bizid & bizkey。
         * 强制置为 empty
         */
        console.warn('[tavui TaFileCard] "create" mode force "api" empty')
        setDataSource([])
      }
    } else if (mergedProps.value.mode === 'update') {
      if (mergedProps.value.dataSource) {
        /**
         * 编辑模式，使用 datasource 数据源
         * 1. reload 方法直接返回（给不执行提示）
         */
        if (validateDataSourceIsStringArray(mergedProps.value.dataSource)) {
          await handleStringArrayDataSource()
        } else if (validateDataSourceIsObjectArray(mergedProps.value.dataSource)) {
          handleObjectArrayDataSource()
        } else {
          setDataSource(mergedProps.value.dataSource as FileActionUploadApiResponseRecord[])
        }
      } else {
        /**
         * 编辑模式，使用 api 数据源
         * 1. 只能使用不分页接口
         */
        await handleApiDataSource()
      }
    } else {
      if (mergedProps.value.dataSource) {
        /**
         * 立即更新模式，使用 datasource 数据源
         * 1. reload 方法直接返回（给不执行提示）
         */
        if (validateDataSourceIsStringArray(mergedProps.value.dataSource)) {
          await handleStringArrayDataSource()
        } else if (validateDataSourceIsObjectArray(mergedProps.value.dataSource)) {
          handleObjectArrayDataSource()
        } else {
          setDataSource(mergedProps.value.dataSource as FileActionUploadApiResponseRecord[])
        }
      } else {
        /**
         * 立即更新模式，使用 api 数据源
         * 1. 支持不分页接口
         */
        await handleApiDataSource()
      }
    }
  }

  function setDataSource(data: FileActionUploadApiResponseRecord[]) {
    dataSourceRef.value = [...data]
  }

  const dataSource = computed(() => unref(dataSourceRef))

  return {
    apiActions: {
      apiQueryFileOptions,
      apiQueryFileByActualIdsOptions,
    },
    dataSource,
    handleDataSource,
    setDataSource,
    handleApiDataSource,
  }
}

export type UseHandleDataSourceReturn = ReturnOf<typeof useHandleDataSource>
