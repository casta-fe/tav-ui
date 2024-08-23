import { type ComputedRef, type SetupContext, computed, nextTick } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import componentSetting from '@tav-ui/settings/src/componentSetting'
import { type ITableProInstance } from '@tav-ui/components/table-pro'
import {
  type ApiDeleteFileParams,
  type ApiQueryFilterFormFileTypeParams,
  type ApiUpdateFileNameAndLinkParams,
  type FileTableEmits,
  type FileTableInstance,
  type FileTableProps,
  type FileTableReloadApiParams,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FileFilterFormFileTypeResponse,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions, type VersionCaches } from '../../../hooks'
import {
  type ArgumentsOf,
  type ReturnOf,
  validateFileFromLocal,
  validateVersionCachesHasApiFile,
} from '../../../utils'
import { type UseTableActionsReturn } from './use-table-actions'
import { type UseHandleDataSourceReturn } from './use-handle-data-source'

const {
  table: {
    pageSizeOptions,
    defaultPageSize,
    fetchSetting: { listField, totalField },
  },
} = componentSetting

/**
 * 根据 api 名字来构造分页参数
 * @param name
 * @param filter
 * @param model
 * @param apiParams
 * @returns
 */
function createQueryApiOptionsWithPagerConfig(
  name: string,
  filter: any,
  model: any,
  apiParams: any
) {
  if (name.endsWith('List')) {
    return {
      // ...filter,
      // ...model,
      // ...(apiParams?.filter ?? {}),
      // ...(apiParams?.model ?? {}),
      ...filter,
      ...(apiParams ?? {}),
    }
  } else {
    return {
      filter: { ...(apiParams?.filter ?? {}), ...filter },
      model: { ...(apiParams?.model ?? {}), ...model },
    }
  }
}

function handleAfterApiEmit(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
  apiResult: any
}) {
  const { mergedProps, emits, VersionCachesController, apiResult } = options

  const rows = JSON.parse(
    JSON.stringify([...(apiResult ?? [])])
  ) as FileActionUploadApiResponseRecord[]

  if (rows.length > 0) {
    VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
  } else {
    VersionCachesController.deleteAllFileCaches()
  }

  // 在初始化时机抛出事件
  // emits('change', rows, rows, 'init')
  if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
    emits('actualidsChange', VersionCachesController.getCaches())
  } else {
    emits(
      'actualidsChange',
      rows.map((file: any) => file.actualId)
    )
  }
}

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: FileTableInstance['tableProRef']
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
  dataSource: UseHandleDataSourceReturn['dataSource']
}) {
  const { mergedProps, tableProRef, emits, VersionCachesController, dataSource } = options

  /**
   * 根据 props 来设置 tablepro 的参数，包括：data、api、beforeapi、afterapi、pagerconfig、immediate
   * @returns
   */
  function useModeConfigTable() {
    return computed(() => {
      const apiOptions = apiQueryFileOptions(mergedProps.value.apiParams)

      const dataOrApiConfigWithPager: any = {
        data: undefined,
        api: !apiOptions!.api
          ? undefined
          : ({ filter, model }: Record<string, any>) =>
              apiOptions!.api!(
                createQueryApiOptionsWithPagerConfig(
                  // apiOptions!.api!.name, // 打包之后读取到的函数名为混淆代码！
                  'Pager',
                  filter,
                  model,
                  apiOptions!.apiParams
                ) as any
              ),
        beforeApi: (apiOptions!.beforeApi ?? undefined) as any,
        afterApi: (apiOptions!.afterApi ?? undefined) as any,
        pagerConfig: {
          size: 'mini',
          layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total'],
          pageSize: defaultPageSize,
          pageSizes: pageSizeOptions.map((size) => Number(size)),
          controller: 'backend',
        },
      }

      const dataOrApiConfigWithList: any = {
        data: undefined,
        api: !apiOptions!.api
          ? undefined
          : ({ filter, model }: Record<string, any>) =>
              apiOptions!.api!(
                createQueryApiOptionsWithPagerConfig(
                  // apiOptions!.api!.name, // 打包之后读取到的函数名为混淆代码！
                  'List',
                  filter,
                  model,
                  apiOptions!.apiParams
                ) as any
              ),
        beforeApi: (apiOptions!.beforeApi ?? undefined) as any,
        afterApi: (apiOptions!.afterApi ?? undefined) as any,
        pagerConfig: { enabled: false },
      }

      const dataOrApiConfigWithNull: any = {
        data: undefined,
        api: undefined,
        beforeApi: undefined,
        afterApi: undefined,
        pagerConfig: { enabled: false },
      }

      let dataOrApiConfig: {
        data: FileTableProps['dataSource']
        api?: (...args: any[]) => Promise<any>
        beforeApi?: (...args: any[]) => Promise<any>
        afterApi?: (...args: any[]) => Promise<any>
        pagerConfig: FileTableProps['pagerConfig']
      } = {} as any

      if (mergedProps.value.mode === 'read') {
        if (mergedProps.value.dataSource) {
          /**
           * 只读模式，使用 datasource 数据源
           * 1. 筛选在外部自己实现，筛选后更新 datasource 即可
           * 2. 分页，TODO: 组件内部后期支持，优先级低
           * 3. reload 方法直接返回（给不执行提示）
           */
          dataOrApiConfig = {
            ...dataOrApiConfigWithNull,
            data: dataSource.value,
          }
        } else {
          /**
           * 只读模式，使用 api 数据源
           * 1. 支持分页与不分页接口
           */
          if (mergedProps.value.modeQueryApiType === 'pager') {
            dataOrApiConfig = dataOrApiConfigWithPager
          } else {
            dataOrApiConfig = dataOrApiConfigWithList
          }
        }
      } else if (mergedProps.value.mode === 'create') {
        if (mergedProps.value.dataSource) {
          /**
           * 新增模式，使用 datasource 数据源
           * 1. 筛选在外部自己实现，筛选后更新 datasource 即可
           * 2. 分页，TODO: 组件内部后期支持，优先级低
           * 3. reload 方法直接返回（给不执行提示）
           */
          dataOrApiConfig = {
            ...dataOrApiConfigWithNull,
            data: dataSource.value,
          }
        } else {
          /**
           * 新增模式，不支持 api 数据源，因为此时无 bizid & bizkey。
           * 强制置为empty
           */
          console.warn('[tavui TaFileTable] "create" mode force "api" empty')
          dataOrApiConfig = dataOrApiConfigWithNull
        }
      } else if (mergedProps.value.mode === 'update') {
        if (mergedProps.value.dataSource) {
          /**
           * 编辑模式，使用 datasource 数据源
           * 1. 筛选在外部自己实现，筛选后更新 datasource 即可
           * 2. 分页，TODO: 组件内部后期支持，优先级低
           * 3. reload 方法直接返回（给不执行提示）
           */
          dataOrApiConfig = {
            ...dataOrApiConfigWithNull,
            data: dataSource.value,
          }
        } else {
          /**
           * 编辑模式，使用 api 数据源
           * 1. 只能使用不分页接口
           */
          if (mergedProps.value.modeQueryApiType === 'pager') {
            console.warn(
              '[tavui TaFileTable] apiQueryFile is only used in "read" or "updateInstantly" mode, force to use apiQueryFileList, "pager" not working'
            )
            dataOrApiConfig = dataOrApiConfigWithList
          } else {
            dataOrApiConfig = dataOrApiConfigWithList
          }
        }
      } else {
        if (mergedProps.value.dataSource) {
          /**
           * 立即更新模式，使用 datasource 数据源
           * 1. 筛选在外部自己实现，筛选后更新 datasource 即可
           * 2. 分页，TODO: 组件内部后期支持，优先级低
           * 3. reload 方法直接返回（给不执行提示）
           */
          dataOrApiConfig = {
            ...dataOrApiConfigWithNull,
            data: dataSource.value,
          }
        } else {
          /**
           * 立即更新模式，使用 api 数据源
           * 1. 支持分页与不分页接口
           */
          if (mergedProps.value.modeQueryApiType === 'pager') {
            dataOrApiConfig = dataOrApiConfigWithPager
          } else {
            dataOrApiConfig = dataOrApiConfigWithList
          }
        }
      }

      return dataOrApiConfig
    })
  }

  //:========================================: api actions :========================================://
  function apiQueryFileOptions(apiParams: FileTableProps['apiParams']) {
    if (!mergedProps.value.apiQueryFile) {
      console.warn('[tavui TaFileTable] apiQueryFile is undefined')
      return
    }

    if (!mergedProps.value.apiQueryFileList) {
      console.warn('[tavui TaFileTable] apiQueryFileList is undefined')
      return
    }

    const modeQueryApiTypePagerConfig: any = {
      api: mergedProps.value.apiQueryFile,
      beforeApi: mergedProps.value.beforeApiQueryFile,
      afterApi: async (apiResult: any) => {
        const _apiResult = (await mergedProps.value.afterApiQueryFile?.(apiResult)) || apiResult

        handleAfterApiEmit({
          mergedProps,
          emits,
          VersionCachesController,
          apiResult: _apiResult.data[listField] ?? [],
        })

        return _apiResult
      },
      apiParams: {
        filter: {
          appId: apiParams.appId,
          moduleCode: apiParams.moduleCode,
          ...(apiParams.typeCodes ? { typeCodes: apiParams.typeCodes } : {}),
          businessKey: apiParams.businessKey,
          ...(apiParams.businessIds
            ? {
                businessIds: apiParams.businessIds,
              }
            : {}),
          businessCheck: apiParams.businessCheck,
          permissionControl: apiParams.permissionControl,
        },
        model: { page: 1, limit: 50 },
      },
    }

    const modeQueryApiTypeListConfig: any = {
      api: mergedProps.value.apiQueryFileList,
      beforeApi: mergedProps.value.beforeApiQueryFileList,
      afterApi: async (apiResult: any) => {
        // const _apiResult = (await mergedProps.value.afterApiQueryFileList?.(apiResult)) || apiResult // 与上面 afterApiQueryFile 合并为一个函数
        const _apiResult = (await mergedProps.value.afterApiQueryFile?.(apiResult)) || apiResult

        handleAfterApiEmit({
          mergedProps,
          emits,
          VersionCachesController,
          apiResult: _apiResult.data ?? [],
        })

        // 不分页接口需要劫持 afterapi 组装分页数据将分页器显示出来，这样避免想使用分页器必须传入分页接口的情况
        return {
          data: {
            [listField]: _apiResult.data,
            [totalField]: _apiResult.data.length,
          },
        }
      },
      apiParams: {
        appId: apiParams.appId,
        moduleCode: apiParams.moduleCode,
        ...(apiParams.typeCodes ? { typeCodes: apiParams.typeCodes } : {}),
        businessKey: apiParams.businessKey,
        ...(apiParams.businessIds
          ? {
              businessIds: apiParams.businessIds,
            }
          : {}),
        businessCheck: apiParams.businessCheck,
        permissionControl: apiParams.permissionControl,
      },
    }

    let apiConfig: any = {}
    if (mergedProps.value.modeQueryApiType === 'pager') {
      apiConfig = modeQueryApiTypePagerConfig
    } else {
      apiConfig = modeQueryApiTypeListConfig
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileTableProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      ...apiConfig,
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

  function apiQueryFilterFormFileTypeOptions(apiParams: FileTableProps['apiParams']) {
    if (!mergedProps.value.apiQueryFilterFormFileType) {
      console.warn('[tavui TaFileTable] apiQueryFilterFormFileType is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ApiQueryFilterFormFileTypeParams,
      FileFilterFormFileTypeResponse
    > = {
      api: mergedProps.value.apiQueryFilterFormFileType,
      beforeApi: mergedProps.value.beforeApiQueryFilterFormFileType,
      afterApi: mergedProps.value.afterApiQueryFilterFormFileType,
      apiParams: {
        appId: apiParams.appId,
        ...(apiParams.moduleCode ? { moduleCode: apiParams.moduleCode } : {}),
        ...(apiParams.typeCodes ? { typeCodes: apiParams.typeCodes } : {}),
        permissionControl: apiParams.permissionControl,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      responseDataType: 'object',
    }

    // if (mergedProps.value.mode === 'read') {
    // } else if (mergedProps.value.mode === 'create') {
    // } else if (mergedProps.value.mode === 'update') {
    // } else {
    // }

    return options
  }

  function rowEditorApiOptions(
    apiParams: FileTableProps['apiParams'],
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>
  ) {
    if (!mergedProps.value.apiUpdateFileNameAndLink) {
      console.warn('[tavui TaFileTable] apiUpdateFileNameAndLink is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ApiUpdateFileNameAndLinkParams,
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiUpdateFileNameAndLink,
      beforeApi: mergedProps.value.beforeApiUpdateFileNameAndLink,
      afterApi: mergedProps.value.afterApiUpdateFileNameAndLink,
      apiParams: {
        appId: apiParams.appId,
        ...changeEventPayload,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      useSuccessPassRes: true,
    }

    // if (mergedProps.value.mode === 'read') {
    // } else if (mergedProps.value.mode === 'create') {
    // } else if (mergedProps.value.mode === 'update') {
    // } else {
    // }

    return options
  }

  function historyApiOptions(
    apiParams: FileTableProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiQueryFileHistory) {
      console.warn('[tavui TaFileTable] apiQueryFileHistory is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ArgumentsOf<FileTableProps['apiQueryFileHistory']>[0],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileHistory,
      // beforeApi: mergedProps.value.beforeApiQueryFileHistory,
      // afterApi: mergedProps.value.afterApiQueryFileHistory,
      apiParams: {
        // appId: apiParams.appId,
        actualIds: [file.actualId!],
        // permissionControl: apiParams.permissionControl,
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

  function deleteApiOptions(
    apiParams: FileTableProps['apiParams'],
    row: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiDeleteFile) {
      console.warn('[tavui TaFileTable] apiDeleteFile is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      Omit<ApiDeleteFileParams, 'actualIds'> & {
        actualIds?: ApiDeleteFileParams['actualIds']
      },
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiDeleteFile as any,
      beforeApi: mergedProps.value.beforeApiDeleteFile as any,
      afterApi: mergedProps.value.afterApiDeleteFile,
      apiParams: {
        appId: apiParams.appId,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      useSuccessPassRes: true,
    }

    if (mergedProps.value.mode === 'read') {
      //
    } else if (mergedProps.value.mode === 'create') {
      //
    } else if (mergedProps.value.mode === 'update') {
      //
    } else {
      options['apiParams'] = {
        ...options['apiParams'],
        actualIds: [row.actualId!],
      }
    }

    return options
  }
  //:========================================: api actions :========================================://

  //:========================================: data actions :========================================://
  async function reloadRows(params?: FileTableReloadApiParams) {
    if (!mergedProps.value.visible) return
    await nextTick()

    const handleReload = async () => {
      const tableProInstance = (tableProRef.value as any)?.instance as ITableProInstance['instance']
      await tableProInstance.reload(params)

      // reload 后需清空缓存重新载入数据
      VersionCachesController.deleteAllFileCaches()
      const { fullData } = (await tableProInstance?.getTableData()) || {
        fullData: [],
        tableData: [],
      }
      handleAfterApiEmit({
        mergedProps,
        emits,
        VersionCachesController,
        apiResult: fullData,
      })
    }

    if (mergedProps.value.mode === 'read') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "reload" not working in mode "read" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    } else if (mergedProps.value.mode === 'create') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "reload" not working in mode "create" combine with "dataSource"'
        )
      } else {
        console.warn('[tavui TaFileTable] "reload" not working in mode "create"')
      }
    } else if (mergedProps.value.mode === 'update') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "reload" not working in mode "update" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    } else {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "reload" not working in mode "updateInstantly" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    }
  }

  async function editRow(
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    _row: FileActionUploadApiResponseRecord,
    tableReadRows: UseTableActionsReturn['tableReadRows'],
    tableUpdateRows: UseTableActionsReturn['tableUpdateRows'],
    editRowApiAction: (...args: any[]) => Promise<any>,
    refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))

    async function action() {
      const newrow = { ...row }
      if (changeEventPayload.name) newrow.name = changeEventPayload.name
      if (newrow.hyperlink) {
        if (changeEventPayload.address) newrow.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) newrow.fullName = `${changeEventPayload.name}.${newrow.suffix}`
      }
      await tableUpdateRows({
        rows: [newrow],
        deleteRows: [row],
      })
      return newrow
    }

    async function getTableData() {
      const _tableData = JSON.parse(JSON.stringify(await tableReadRows()))
      return _tableData.length > 0 ? _tableData : [row]
    }

    const newrow = await action()
    VersionCachesController.updateFileCaches(newrow)

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      const tableData = await getTableData()
      emits(
        'actualidsChange',
        tableData.map((file: any) => file.actualId)
      )
      await editRowApiAction(changeEventPayload)
    } else if (mode === 'update') {
      emits('actualidsChange', VersionCachesController.getCaches())

      !validateVersionCachesHasApiFile(VersionCachesController['caches'][row.actualId!]) &&
        (await editRowApiAction(changeEventPayload))
    } else {
      emits('actualidsChange', VersionCachesController.getCaches())

      await editRowApiAction(changeEventPayload)
      if (!mergedProps.value.dataSource) {
        // 无外部传入的 datasource 才操作
        await refreshTableDataApiAction()
      }
    }
  }

  async function updateRow(
    _row: FileActionUploadApiResponseRecord,
    _clickedRow: FileActionUploadApiResponseRecord,
    tableReadRows: UseTableActionsReturn['tableReadRows'],
    tableUpdateRows: UseTableActionsReturn['tableUpdateRows'],
    refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action(updatedVersionRow?: FileActionUploadApiResponseRecord) {
      await tableUpdateRows({
        rows: [{ ...clickedRow, ...(updatedVersionRow ?? row) }], // merge 原数据，兼容插入的业务字段
        deleteRows: [clickedRow],
      })
    }

    async function getTableData() {
      const _tableData = JSON.parse(JSON.stringify(await tableReadRows()))
      return _tableData.length > 0 ? _tableData : [row]
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
      const tableData = await getTableData()
      emits(
        'actualidsChange',
        tableData.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      if (validateFileFromLocal(clickedRow)) {
        VersionCachesController.createFileCache(row, mode, clickedRow)
      } else {
        VersionCachesController.createFileCache(row, mode)
      }
      const latestVersionFileCache = VersionCachesController.readFileCacheLatestVersion(
        row.actualId!
      )
      await action(latestVersionFileCache)
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.createFileCache(row, mode)
      await action()
      emits('actualidsChange', VersionCachesController.getCaches())

      if (!mergedProps.value.dataSource) {
        // 无外部传入的 datasource 才操作
        await refreshTableDataApiAction()
      }
    }
  }

  async function deleteRow(
    _clickedRow: FileActionUploadApiResponseRecord,
    tableReadRows: UseTableActionsReturn['tableReadRows'],
    tableDeleteRows: UseTableActionsReturn['tableDeleteRows'],
    deleteRowApiAction: () => Promise<void>,
    refreshTableDataApiAction: (params?: FileTableReloadApiParams) => Promise<void>
  ) {
    const mode = mergedProps.value.mode
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action() {
      await tableDeleteRows({
        rows: [clickedRow],
      })
    }

    async function getTableData() {
      const _tableData = JSON.parse(JSON.stringify(await tableReadRows()))
      return _tableData.length > 0 ? _tableData : [clickedRow]
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
      const tableData = await getTableData()
      emits(
        'actualidsChange',
        tableData.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      emits('actualidsChange', VersionCachesController.getCaches())

      if (!mergedProps.value.dataSource) {
        // 无外部传入的 datasource 才操作
        await deleteRowApiAction()
        await refreshTableDataApiAction()
      }
    }
  }
  //:========================================: data actions :========================================://

  return {
    useModeConfigTable,
    apiActions: {
      apiQueryFileOptions,
      apiQueryFilterFormFileTypeOptions,
      rowEditorApiOptions,
      historyApiOptions,
      deleteApiOptions,
    },
    dataActions: {
      reloadRows,
      editRow,
      updateRow,
      deleteRow,
    },
  }
}

export type UseModeReturn = ReturnOf<typeof useMode>
