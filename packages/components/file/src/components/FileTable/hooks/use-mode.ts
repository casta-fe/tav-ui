import { type ComputedRef, type Ref, type SetupContext, unref, watch } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileTableEmits, type FileTableProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions, type VersionCaches } from '../../../hooks'
import { type FileActionUploadProps } from '../../FileActionUpload'
import { type ArgumentsOf } from '../../../utils'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
}) {
  const { mergedProps } = options

  /**
   * 根据不同模式判断是否获取数据
   * @param handleApi
   */
  async function useModeFetchDataSource(handleApi: (...args: any[]) => Promise<any>) {
    watch(
      () => mergedProps.value.mode,
      async (mode) => {
        if (mode === 'read') {
          const options = apiQueryFileOptions(mergedProps.value.apiParams)
          if (!options) return
          await handleApi(options)
        } else if (mode === 'create') {
          //
        } else if (mode === 'update') {
          const options = apiQueryFileOptions(mergedProps.value.apiParams)
          if (!options) return
          await handleApi(options)
        } else {
          const options = apiQueryFileOptions(mergedProps.value.apiParams)
          if (!options) return
          await handleApi(options)
        }
      },
      {
        immediate: true,
      }
    )
  }
  //:========================================: api actions :========================================://
  function apiQueryFileOptions(apiParams: FileTableProps['apiParams']) {
    if (!mergedProps.value.apiQueryFileList) {
      console.warn('[tavui TaFileTable] apiQueryFileList is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileTableProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileList as any,
      beforeApi: mergedProps.value.beforeApiQueryFileList,
      afterApi: mergedProps.value.afterApiQueryFileList,
      apiParams: {
        appId: apiParams.appId,
        moduleCode: apiParams.moduleCode,
        businessKey: apiParams.businessKey,
        ...(apiParams.businessId
          ? {
              businessIds: [apiParams.businessId],
            }
          : {}),
        /** 新增模式为 false，其余为 true */
        businessCheck: true,
        permissionControl: apiParams.permissionControl ?? false,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
    }

    if (mergedProps.value.mode === 'read') {
      // options['api'] = mergedProps.value.apiQueryFile as any
      // options['beforeApi'] = mergedProps.value.beforeApiQueryFile
      // options['afterApi'] = mergedProps.value.afterApiQueryFile
      // options['apiParams'] = {
      //   filter: {
      //     appId: apiParams.appId,
      //     moduleCode: apiParams.moduleCode,
      //     businessKey: apiParams.businessKey,
      //     ...(apiParams.businessId
      //       ? {
      //           businessIds: [apiParams.businessId],
      //         }
      //       : {}),
      //   },
      //   model: { page: 1, limit: 50 },
      // } as any
    } else if (mergedProps.value.mode === 'create') {
      options['apiParams'] = {
        ...options['apiParams'],
        businessCheck: false,
      }
    } else if (mergedProps.value.mode === 'update') {
      //
    } else {
      //
    }

    return options
  }

  function rowEditorApiOptions(apiParams: FileTableProps['apiParams']) {
    if (!mergedProps.value.apiUpdateFileNameAndLink) {
      console.warn('[tavui TaFileTable] apiUpdateFileNameAndLink is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileTableProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiUpdateFileNameAndLink as any,
      beforeApi: mergedProps.value.beforeApiUpdateFileNameAndLink as any,
      afterApi: mergedProps.value.afterApiUpdateFileNameAndLink,
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
      //
    }

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
      FileTableProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileHistory,
      // beforeApi: mergedProps.value.beforeApiQueryFileHistory,
      // afterApi: mergedProps.value.afterApiQueryFileHistory,
      apiParams: {
        // appId: apiParams.appId,
        actualIds: [file.actualId!],
        // permissionControl: apiParams.permissionControl ?? false,
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

  // table action update api: upload || update
  function updateApiOptions(
    apiParams: FileTableProps['apiParams'],
    files: File[],
    row: FileActionUploadApiResponseRecord | undefined,
    callback: () => void
  ) {
    if (!mergedProps.value.apiUploadFile) {
      console.warn('[tavui TaFileTable] apiUploadFile is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileActionUploadProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiUploadFile,
      beforeApi: mergedProps.value.beforeApiUploadFile,
      afterApi: mergedProps.value.afterApiUploadFile,
      apiParams: {
        appId: apiParams.appId,
        files: unref(files),
        moduleCode: apiParams.moduleCode ?? '',
        typeCode: apiParams.typeCode ?? '',
        businessParamsJson: apiParams.businessParamsJson ?? {},
      },
      transformApiParamsToFormData: {
        fileFiledName: 'files',
        filterNames: ['appId', 'fileActualId', 'instantUpdate'],
      },
      successMessage: () => {
        return tavI18n('Tav.file.message.8')
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      callback,
    }
    // 是否为手动上传的文件数据，而非从 api 返回的数据
    const isManualUploadRow = row?.version === 1 && !(row.businessId || row.businessKey)

    if (mergedProps.value.mode === 'read') {
      //
    } else if (mergedProps.value.mode === 'create') {
      //
    } else if (mergedProps.value.mode === 'update') {
      if (!isManualUploadRow) {
        options['transformApiParamsToFormData'] = undefined
        options['api'] = mergedProps.value.apiUpdateFile
        options['beforeApi'] = mergedProps.value.beforeApiUpdateFile
        options['afterApi'] = mergedProps.value.afterApiUpdateFile
        const formData = new FormData()
        files.forEach((file) => formData.append('file', file))
        options['apiParams'] = {
          appId: apiParams.appId,
          fileActualId: row?.actualId,
          instantUpdate: false,
          formData,
        } as any
      } else {
        //
      }
    } else {
      options['transformApiParamsToFormData'] = undefined
      options['api'] = mergedProps.value.apiUpdateFile
      options['beforeApi'] = mergedProps.value.beforeApiUpdateFile
      options['afterApi'] = mergedProps.value.afterApiUpdateFile
      const formData = new FormData()
      files.forEach((file) => formData.append('file', file))
      options['apiParams'] = {
        appId: apiParams.appId,
        fileActualId: row?.actualId,
        instantUpdate: true,
        formData,
        businessParamsJson: apiParams.businessParamsJson ?? {},
      } as any
    }

    return options
  }

  // function downloadApiOptions(
  //   apiParams: ComputedRef<FileTableProps['apiParams']>,
  //   file: FileActionUploadApiResponseRecord
  // ) {
  //   const options: FileActionUploadHandleApiOptions = {
  //     api: mergedProps.value.apiDownloadFile,
  //     beforeApi: mergedProps.value.beforeApiDownloadFile,
  //     afterApi: mergedProps.value.afterApiDownloadFile,
  //     apiParams: {
  //       appId: apiParams.value.appId,
  //       id: file.id,
  //     },
  //     mode: mergedProps.value.mode,
  //     isFormData: false,
  //   }

  //   // if (mergedProps.value.mode === 'read') {
  //   // } else if (mergedProps.value.mode === 'create') {
  //   // } else if (mergedProps.value.mode === 'update') {
  //   // } else {
  //   // }

  //   return options
  // }

  // function downloadWaterMarkerApiOptions(
  //   apiParams: ComputedRef<FileTableProps['apiParams']>,
  //   file: FileActionUploadApiResponseRecord
  // ) {
  //   const options: FileActionUploadHandleApiOptions = {
  //     api: mergedProps.value.apiDownloadWaterMarkerFile,
  //     beforeApi: mergedProps.value.beforeApiDownloadWaterMarkerFile,
  //     afterApi: mergedProps.value.afterApiDownloadWaterMarkerFile,
  //     apiParams: {
  //       appId: apiParams.value.appId,
  //       id: file.id,
  //     },
  //     mode: mergedProps.value.mode,
  //     isFormData: false,
  //   }

  //   // if (mergedProps.value.mode === 'read') {
  //   // } else if (mergedProps.value.mode === 'create') {
  //   // } else if (mergedProps.value.mode === 'update') {
  //   // } else {
  //   // }

  //   return options
  // }

  function deleteApiOptions(
    apiParams: FileTableProps['apiParams'],
    row: FileActionUploadApiResponseRecord | undefined
  ) {
    if (!mergedProps.value.apiDeleteFile) {
      console.warn('[tavui TaFileTable] apiDeleteFile is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ArgumentsOf<FileTableProps['apiDeleteFile']>[0],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiDeleteFile,
      beforeApi: mergedProps.value.beforeApiDeleteFile,
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
        actualIds: [row?.actualId!],
      }
    }

    return options
  }
  //:========================================: api actions :========================================://

  //:========================================: dataSource actions :========================================://
  async function editRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    changeEventPayload: { id?: string; name?: string; address?: string },
    editDataSourceRow: (...args: any[]) => Promise<any>,
    emits: SetupContext<FileTableEmits>['emit'],
    VersionCachesController: VersionCaches
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
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    refreshDataSource: (...args: any[]) => Promise<any>,
    emits: SetupContext<FileTableEmits>['emit'],
    VersionCachesController: VersionCaches
  ) {
    const mode = mergedProps.value.mode

    function action(_row?: FileActionUploadApiResponseRecord) {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)
      rows.splice(idx, 1, _row ?? row)
      return rows
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      dataSource.value = [...action()]

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
      VersionCachesController.createFileCache(row)
      const latestVersionFileCache = VersionCachesController.readFileCacheLatestVersion(
        row.actualId!
      )

      dataSource.value = [...action(latestVersionFileCache)]

      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.createFileCache(row, mode)

      action()

      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())

      await refreshDataSource()
    }
  }

  async function deleteRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    deleteDataSourceRow: (...args: any[]) => Promise<any>,
    refreshDataSource: (...args: any[]) => Promise<any>,
    emits: SetupContext<FileTableEmits>['emit'],
    VersionCachesController: VersionCaches
  ) {
    const mode = mergedProps.value.mode

    function action() {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)
      // const newRow = rows[idx]
      rows.splice(idx, 1)
      return rows
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      dataSource.value = [...action()]

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
      VersionCachesController.deleteFileCaches(row.actualId!)
      dataSource.value = [...action()]

      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      VersionCachesController.deleteFileCaches(row.actualId!)
      action()

      emits(
        'change',
        [{ ...row }],
        JSON.parse(JSON.stringify([...(dataSource.value ?? [])])),
        'update'
      )
      emits('actualidsChange', VersionCachesController.getCaches())

      await deleteDataSourceRow()
      await refreshDataSource()
    }
  }
  //:========================================: dataSource actions :========================================://

  return {
    useModeFetchDataSource,
    apiActions: {
      apiQueryFileOptions,
      rowEditorApiOptions,
      historyApiOptions,
      updateApiOptions,
      // downloadApiOptions,
      // downloadWaterMarkerApiOptions,
      deleteApiOptions,
    },
    dataSourceActions: {
      editRow,
      updateRow,
      deleteRow,
    },
  }
}
