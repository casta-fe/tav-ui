import { type ComputedRef, type SetupContext, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import componentSetting from '@tav-ui/settings/src/componentSetting'
import {
  type ApiDeleteFileParams,
  type ApiQueryFilterFormFileTypeParams,
  type ApiUpdateFileNameAndLinkParams,
  type FileTableEmits,
  type FileTableProps,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FileFilterFormFileTypeResponse,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions, type VersionCaches } from '../../../hooks'
import { type ArgumentsOf, type ReturnOf } from '../../../utils'
import { type UseTableActionsReturn } from './use-table-actions'

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
      filter: { ...filter, ...(apiParams?.filter ?? {}) },
      model: { ...model, ...(apiParams?.model ?? {}) },
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

  setTimeout(async () => {
    const rows = JSON.parse(
      JSON.stringify([...(apiResult ?? [])])
    ) as FileActionUploadApiResponseRecord[]
    // 在初始化时机抛出事件
    // emits('change', rows, rows, 'init')
    emits(
      'actualidsChange',
      rows.map((file: any) => file.actualId)
    )

    if (rows.length > 0) {
      VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
    } else {
      VersionCachesController.deleteAllFileCaches()
    }
  }, 150)
}

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  emits: SetupContext<FileTableEmits>['emit']
  VersionCachesController: VersionCaches
}) {
  const { mergedProps, emits, VersionCachesController } = options

  /**
   * 根据 props 来设置 tablepro 的参数，包括：data、api、beforeapi、afterapi、pagerconfig、immediate
   * @returns
   */
  function useModeConfigTable() {
    return computed(() => {
      const hasPager = mergedProps.value.pagerConfig && !!mergedProps.value.pagerConfig.enabled
      const modeQueryApiType = mergedProps.value.modeQueryApiType
      const apiOptions = apiQueryFileOptions(mergedProps.value.apiParams)

      const dataOrApiConfigWithPager: any = {
        data: undefined,
        api: !apiOptions!.api
          ? undefined
          : ({ filter, model }: Record<string, any>) =>
              apiOptions!.api!(
                createQueryApiOptionsWithPagerConfig(
                  apiOptions!.api!.name,
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
                  apiOptions!.api!.name,
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

      // 可以允许用户外部开启分页器
      if (hasPager) {
        // 优先获取外部传入的分页器配置
        dataOrApiConfig = dataOrApiConfigWithPager
      } else {
        if (modeQueryApiType === 'pager') {
          dataOrApiConfig = dataOrApiConfigWithPager
        } else {
          dataOrApiConfig = dataOrApiConfigWithList
        }
      }

      if (
        ['update'].includes(mergedProps.value.mode) &&
        mergedProps.value.modeQueryApiType === 'pager'
      ) {
        // 编辑模式只能使用不分页接口
        console.warn(
          '[tavui TaFileTable] apiQueryFile is only used in "read" or "updateInstantly" mode, force to use apiQueryFileList, "pager" not working'
        )

        dataOrApiConfig = dataOrApiConfigWithList
      }

      if (mergedProps.value.dataSource) {
        // 如果传入 datasource 则不使用接口数据
        dataOrApiConfig = {
          ...dataOrApiConfigWithNull,
          data: mergedProps.value.dataSource,
        }
      }

      if (['create'].includes(mergedProps.value.mode)) {
        // 新增模式必须是空数据，不接收、使用任何 dataSource 与 api
        console.warn(
          '[tavui TaFileTable] "create" mode must empty data, force "dataSource" and "api" empty'
        )

        dataOrApiConfig = dataOrApiConfigWithNull
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
          apiResult: _apiResult.data[listField] ?? [],
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
  async function editRow(
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    _row: FileActionUploadApiResponseRecord,
    tableReadRows: UseTableActionsReturn['tableReadRows'],
    tableCreateRows: UseTableActionsReturn['tableCreateRows'],
    tableDeleteRows: UseTableActionsReturn['tableDeleteRows'],
    editRowApiAction: (...args: any[]) => Promise<any>,
    refreshTableDataApiAction: (...args: any[]) => Promise<any>
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
      await tableDeleteRows([row], false)
      await tableCreateRows([newrow], null, false)
      return newrow
    }

    async function getTableData() {
      const _tableData = JSON.parse(JSON.stringify(await tableReadRows()))
      return _tableData.length > 0 ? _tableData : [row]
    }

    if (mode === 'read') {
      const newrow = await action()
      const tableData = await getTableData()
      VersionCachesController.updateFileCaches(newrow)
      // emits(
      //   'change',
      //   [{ ...newrow }],
      //   JSON.parse(JSON.stringify([...(tableData.value ?? [])])),
      //   'update'
      // )
      emits(
        'actualidsChange',
        JSON.parse(JSON.stringify([...(tableData.value ?? [])])).map((file: any) => file.actualId)
      )
    } else if (mode === 'create') {
      const newrow = await action()
      VersionCachesController.updateFileCaches(newrow)
      const tableData = await getTableData()
      // emits(
      //   'change',
      //   [{ ...newrow }],
      //   JSON.parse(JSON.stringify([...(tableData.value ?? [])])),
      //   'update'
      // )
      emits(
        'actualidsChange',
        JSON.parse(JSON.stringify([...(tableData.value ?? [])])).map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      const newrow = await action()
      VersionCachesController.updateFileCaches(newrow)
      // const tableData = await getTableData()
      // emits(
      //   'change',
      //   [{ ...newrow }],
      //   JSON.parse(JSON.stringify([...(tableData.value ?? [])])),
      //   'update'
      // )
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      const newrow = await action()
      VersionCachesController.updateFileCaches(newrow)
      // const tableData = await getTableData()
      // emits(
      //   'change',
      //   [{ ...newrow }],
      //   JSON.parse(JSON.stringify([...(tableData.value ?? [])])),
      //   'update'
      // )
      emits('actualidsChange', VersionCachesController.getCaches())

      if (!mergedProps.value.dataSource) {
        // 无外部传入的 datasource 才操作
        await editRowApiAction(changeEventPayload)
        await refreshTableDataApiAction()
      }
    }
  }

  async function updateRow(
    _row: FileActionUploadApiResponseRecord,
    _clickedRow: FileActionUploadApiResponseRecord,
    tableReadRows: UseTableActionsReturn['tableReadRows'],
    tableUpdateRows: UseTableActionsReturn['tableUpdateRows'],
    refreshTableDataApiAction: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action(updatedVersionRow?: FileActionUploadApiResponseRecord) {
      await tableUpdateRows([updatedVersionRow ?? row], [clickedRow], clickedRow)
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
      // emits('change', [row], tableData, 'update')
      emits(
        'actualidsChange',
        tableData.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      VersionCachesController.createFileCache(row, mode)
      const latestVersionFileCache = VersionCachesController.readFileCacheLatestVersion(
        row.actualId!
      )
      await action(latestVersionFileCache)
      // const tableData = await getTableData()
      // emits('change', [row], tableData, 'update')
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.createFileCache(row, mode)
      await action()
      // const tableData = await getTableData()
      // emits('change', [row], tableData, 'update')
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
    refreshTableDataApiAction: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action() {
      await tableDeleteRows([clickedRow])
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
      // emits('change', [clickedRow], tableData, 'delete')
      emits(
        'actualidsChange',
        tableData.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      // const tableData = await getTableData()
      // emits('change', [clickedRow], tableData, 'delete')
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      // const tableData = await getTableData()
      // emits('change', [clickedRow], tableData, 'delete')
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
      editRow,
      updateRow,
      deleteRow,
    },
  }
}

export type UseModeReturn = ReturnOf<typeof useMode>
