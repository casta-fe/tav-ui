import { type ComputedRef, type Ref, type SetupContext, computed } from 'vue'
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
import { type ArgumentsOf } from '../../../utils'

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

        // 在初始化时机抛出事件
        setTimeout(() => {
          const rows = JSON.parse(JSON.stringify([...(_apiResult.data[listField] ?? [])]))
          emits('change', rows, rows, 'init')
          emits(
            'actualidsChange',
            rows.map((file: any) => file.actualId)
          )

          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
        }, 150)

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

    // 表格内部数据源用 queryfile/querfilelist 传递给 tablepro 获取数据，外部传入的 datasource 会拼在数据最前方

    const modeQueryApiTypeListConfig: any = {
      api: mergedProps.value.apiQueryFileList,
      beforeApi: mergedProps.value.beforeApiQueryFileList,
      afterApi: async (apiResult: any) => {
        // const _apiResult = (await mergedProps.value.afterApiQueryFileList?.(apiResult)) || apiResult // 与上面 afterApiQueryFile 合并为一个函数
        const _apiResult = (await mergedProps.value.afterApiQueryFile?.(apiResult)) || apiResult

        // 在初始化时机抛出事件
        setTimeout(() => {
          const rows = JSON.parse(JSON.stringify([...(_apiResult.data ?? [])]))
          emits('change', rows, rows, 'init')
          emits(
            'actualidsChange',
            rows.map((file: any) => file.actualId)
          )

          VersionCachesController.createAllFileCaches(rows, mergedProps.value.mode)
        }, 150)

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

    if (
      ['update'].includes(mergedProps.value.mode) &&
      mergedProps.value.modeQueryApiType === 'pager'
    ) {
      // 编辑模式只能使用不分页接口
      console.warn(
        '[tavui TaFileTable] apiQueryFile is only used in "read" or "updateInstantly" mode, force to use apiQueryFileList'
      )
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

  //:========================================: dataSource actions :========================================://
  async function editRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    editDataSourceRow: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode

    function action() {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)

      if (changeEventPayload.name) row.name = changeEventPayload.name
      if (row.hyperlink) {
        if (changeEventPayload.address) row.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) row.fullName = `${changeEventPayload.name}.${row.suffix}`
      }

      rows.splice(idx, 1, row)
      return rows
    }

    if (mode === 'read') {
      dataSource.value = [...action()]
      VersionCachesController.updateFileCaches(row)
      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits(
        'actualidsChange',
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])).map((file: any) => file.actualId)
      )
    } else if (mode === 'create') {
      dataSource.value = [...action()]
      VersionCachesController.updateFileCaches(row)
      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits(
        'actualidsChange',
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])).map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      dataSource.value = [...action()]
      VersionCachesController.updateFileCaches(row)
      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      dataSource.value = [...action()]
      VersionCachesController.updateFileCaches(row)
      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())
      await editDataSourceRow(changeEventPayload)
    }
  }

  async function updateRow(
    _row: FileActionUploadApiResponseRecord,
    _clickedRow: FileActionUploadApiResponseRecord,
    tableReadRows: () => Promise<FileActionUploadApiResponseRecord[]>,
    tableUpdateRows: (
      rows: FileActionUploadApiResponseRecord[],
      deleteRows: FileActionUploadApiResponseRecord[],
      pos: FileActionUploadApiResponseRecord | null | -1
    ) => Promise<void>,
    refreshTableData: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action(updatedVersionRow?: FileActionUploadApiResponseRecord) {
      await tableUpdateRows([updatedVersionRow ?? row], [clickedRow], clickedRow)
    }

    async function getDataSource() {
      const _dataSource = JSON.parse(JSON.stringify(await tableReadRows()))
      return _dataSource.length > 0 ? _dataSource : [row]
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
      const dataSource = await getDataSource()
      emits('change', [row], dataSource, 'update')
      emits(
        'actualidsChange',
        dataSource.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      VersionCachesController.createFileCache(row, mode)
      const latestVersionFileCache = VersionCachesController.readFileCacheLatestVersion(
        row.actualId!
      )
      await action(latestVersionFileCache)
      const dataSource = await getDataSource()
      emits('change', [row], dataSource, 'update')
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.createFileCache(row, mode)
      await action()
      const dataSource = await getDataSource()
      emits('change', [row], dataSource, 'update')
      emits('actualidsChange', VersionCachesController.getCaches())
      await refreshTableData()
    }
  }

  async function deleteRow(
    _clickedRow: FileActionUploadApiResponseRecord,
    tableReadRows: () => Promise<FileActionUploadApiResponseRecord[]>,
    tableDeleteRows: (rows: FileActionUploadApiResponseRecord[]) => Promise<void>,
    deleteDataSourceRow: () => Promise<void>,
    refreshTableData: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action() {
      await tableDeleteRows([clickedRow])
    }

    async function getDataSource() {
      const _dataSource = JSON.parse(JSON.stringify(await tableReadRows()))
      return _dataSource.length > 0 ? _dataSource : [clickedRow]
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
      const dataSource = await getDataSource()
      emits('change', [clickedRow], dataSource, 'delete')
      emits(
        'actualidsChange',
        dataSource.map((file: any) => file.actualId)
      )
    } else if (mode === 'update') {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      const dataSource = await getDataSource()

      emits('change', [clickedRow], dataSource, 'delete')
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      const dataSource = await getDataSource()
      emits('change', [clickedRow], dataSource, 'delete')
      emits('actualidsChange', VersionCachesController.getCaches())

      await deleteDataSourceRow()
      await refreshTableData()
    }
  }
  //:========================================: dataSource actions :========================================://

  return {
    useModeConfigTable,
    apiActions: {
      apiQueryFileOptions,
      apiQueryFilterFormFileTypeOptions,
      rowEditorApiOptions,
      historyApiOptions,
      deleteApiOptions,
    },
    dataSourceActions: {
      editRow,
      updateRow,
      deleteRow,
    },
  }
}
