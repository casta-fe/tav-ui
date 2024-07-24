import { type ComputedRef, type Ref, type SetupContext, unref, watch } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileTableEmits, type FileTableProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'
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

  /**
   * 根据不同模式组装事件参数
   * @param dataSource
   * @param _row
   * @param type
   * @param applyVersionCacheToDataSource
   * @returns
   */
  function emitEventOptions(
    _newRows: FileActionUploadApiResponseRecord[],
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    applyVersionCacheToDataSource: (files: FileActionUploadApiResponseRecord[]) => {
      actualId: string
      moduleCode: string | undefined
      versionList: FileActionUploadApiResponseRecord[]
    }[],
    type: string,
    emits: SetupContext<FileTableEmits>['emit']
  ) {
    const newRows = JSON.parse(JSON.stringify([...(_newRows ?? [])]))
    const rows = JSON.parse(JSON.stringify([...(dataSource.value ?? [])]))
    const getVersionDataSource = applyVersionCacheToDataSource(rows)
    const getFileActualIds = rows.map((file: FileActionUploadApiResponseRecord) => file.actualId)

    if (mergedProps.value.mode === 'read') {
      emits('change', newRows, rows, type)
      emits('fileActualIdsChange', getVersionDataSource)
    } else if (mergedProps.value.mode === 'create') {
      emits('change', newRows, rows, type)
      emits('fileActualIdsChange', getVersionDataSource)
    } else if (mergedProps.value.mode === 'update') {
      emits('change', newRows, rows, type)
      emits('fileActualIdsChange', getVersionDataSource)
    } else {
      emits('change', newRows, rows, type)
      emits('fileActualIdsChange', getFileActualIds)
    }
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

  // table action update api: upload || update
  function updateApiOptions(
    apiParams: FileTableProps['apiParams'],
    files: File[],
    row: FileActionUploadApiResponseRecord | undefined
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
        ennabled: true,
        fileFiledName: 'files',
      },
      successMessage: () => {
        return tavI18n('Tav.file.message.8')
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
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

  // function downloadMultiApiOptions(
  //   apiParams: ComputedRef<FileTableProps['apiParams']>,
  //   files: FileActionUploadApiResponseRecord[]
  // ) {
  //   const options: FileActionUploadHandleApiOptions = {
  //     api: mergedProps.value.apiDownloadMultiFile,
  //     beforeApi: mergedProps.value.beforeApiDownloadMultiFile,
  //     afterApi: mergedProps.value.afterApiDownloadMultiFile,
  //     apiParams: {
  //       appId: apiParams.value.appId,
  //       ids: files.map((file) => file.id!),
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
        actualId: row?.actualId,
      }
    }

    return options
  }
  //:========================================: api actions :========================================://

  //:========================================: dataSource actions :========================================://
  async function editRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    _row: FileActionUploadApiResponseRecord,
    changeEventPayload: { id?: string; name?: string; address?: string },
    updateVersionCache: (file: FileActionUploadApiResponseRecord) => void,
    editDataSourceRow: (...args: any[]) => Promise<any>
  ) {
    const mode = mergedProps.value.mode

    if (mode === 'read') {
      const rows = [...(dataSource.value ?? [])]
      const row = { ..._row }
      const idx = rows.findIndex((r) => r.actualId === row.actualId)

      if (changeEventPayload.name) row.name = changeEventPayload.name
      if (row.hyperlink) {
        if (changeEventPayload.address) row.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) row.fullName = `${changeEventPayload.name}.${row.suffix}`
      }

      const oldRow = rows.splice(idx, 1, row)[0]
      // TODO:
      // this.throwResponse([{ ...record, version: oldRecord.version + 1 }], 'update')
      updateVersionCache(row)
      dataSource.value = [...rows]
    } else if (mode === 'create') {
      const rows = [...(dataSource.value ?? [])]
      const row = { ..._row }
      const idx = rows.findIndex((r) => r.actualId === row.actualId)

      if (changeEventPayload.name) row.name = changeEventPayload.name
      if (row.hyperlink) {
        if (changeEventPayload.address) row.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) row.fullName = `${changeEventPayload.name}.${row.suffix}`
      }

      const oldRow = rows.splice(idx, 1, row)[0]
      // TODO:
      // this.throwResponse([{ ...record, version: oldRecord.version + 1 }], 'update')
      updateVersionCache(row)
      dataSource.value = [...rows]
    } else if (mode === 'update') {
      const rows = [...(dataSource.value ?? [])]
      const row = { ..._row }
      const idx = rows.findIndex((r) => r.actualId === row.actualId)

      if (changeEventPayload.name) row.name = changeEventPayload.name
      if (row.hyperlink) {
        if (changeEventPayload.address) row.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) row.fullName = `${changeEventPayload.name}.${row.suffix}`
      }

      const oldRow = rows.splice(idx, 1, row)[0]
      // TODO:
      // this.throwResponse([{ ...record, version: oldRecord.version + 1 }], 'update')
      updateVersionCache(row)
      dataSource.value = [...rows]
    } else {
      const rows = [...(dataSource.value ?? [])]
      const row = { ..._row }
      const idx = rows.findIndex((r) => r.actualId === row.actualId)

      await editDataSourceRow(changeEventPayload)
      if (changeEventPayload.name) row.name = changeEventPayload.name
      if (row.hyperlink) {
        if (changeEventPayload.address) row.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) row.fullName = `${changeEventPayload.name}.${row.suffix}`
      }

      const oldRow = rows.splice(idx, 1, row)[0]
      // TODO:
      // this.throwResponse([{ ...record, version: oldRecord.version + 1 }], 'update')
      updateVersionCache(row)
      dataSource.value = [...rows]
    }
  }

  async function updateRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    rowActualId: string,
    updateVersionCache: (file: FileActionUploadApiResponseRecord) => void,
    refreshDataSource: (...args: any[]) => Promise<any>,
    applyVersionCacheToDataSource: (files: FileActionUploadApiResponseRecord[]) => {
      actualId: string
      moduleCode: string | undefined
      versionList: FileActionUploadApiResponseRecord[]
    }[],
    emits: SetupContext<FileTableEmits>['emit']
  ) {
    const mode = mergedProps.value.mode

    if (mode === 'read') {
      return [] as FileActionUploadApiResponseRecord[]
    } else if (mode === 'create') {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === rowActualId)
      const oldRow = rows.splice(idx, 1, row)[0]
      emitEventOptions(
        [{ ...row, version: oldRow.version + 1 }],
        dataSource,
        applyVersionCacheToDataSource,
        'update',
        emits
      )
      updateVersionCache(row)
      dataSource.value = [...rows]
    } else if (mode === 'update') {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === rowActualId)
      const oldRow = rows.splice(idx, 1, row)[0]
      emitEventOptions(
        [{ ...row, version: oldRow.version + 1 }],
        dataSource,
        applyVersionCacheToDataSource,
        'update',
        emits
      )
      updateVersionCache(row)
      dataSource.value = [...rows]
    } else {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === rowActualId)
      const oldRow = rows.splice(idx, 1, row)[0]
      emitEventOptions(
        [{ ...row, version: oldRow.version + 1 }],
        dataSource,
        applyVersionCacheToDataSource,
        'update',
        emits
      )
      updateVersionCache(row)
      await refreshDataSource()
    }
  }

  async function deleteRow(
    dataSource: Ref<FileActionUploadApiResponseRecord[] | undefined>,
    row: FileActionUploadApiResponseRecord,
    deleteDataSourceRow: (...args: any[]) => Promise<any>,
    refreshDataSource: (...args: any[]) => Promise<any>,
    applyVersionCacheToDataSource: (files: FileActionUploadApiResponseRecord[]) => {
      actualId: string
      moduleCode: string | undefined
      versionList: FileActionUploadApiResponseRecord[]
    }[],
    emits: SetupContext<FileTableEmits>['emit']
  ) {
    const mode = mergedProps.value.mode

    if (mode === 'read') {
      return [] as FileActionUploadApiResponseRecord[]
    } else if (mode === 'create') {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)
      const newRow = rows[idx]
      rows.splice(idx, 1)
      emitEventOptions([{ ...newRow }], dataSource, applyVersionCacheToDataSource, 'delete', emits)
      dataSource.value = [...rows]
    } else if (mode === 'update') {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)
      const newRow = rows[idx]
      rows.splice(idx, 1)
      emitEventOptions([{ ...newRow }], dataSource, applyVersionCacheToDataSource, 'delete', emits)
      dataSource.value = [...rows]
    } else {
      const rows = [...(dataSource.value ?? [])]
      const idx = rows.findIndex((r) => r.actualId === row.actualId)
      const newRow = rows[idx]
      rows.splice(idx, 1)
      emitEventOptions([{ ...newRow }], dataSource, applyVersionCacheToDataSource, 'delete', emits)
      await deleteDataSourceRow()
      await refreshDataSource()
    }
  }
  //:========================================: dataSource actions :========================================://

  return {
    useModeFetchDataSource,
    emitEventOptions,
    apiActions: {
      apiQueryFileOptions,
      rowEditorApiOptions,
      updateApiOptions,
      // downloadApiOptions,
      // downloadWaterMarkerApiOptions,
      // downloadMultiApiOptions,
      deleteApiOptions,
    },
    dataSourceActions: {
      editRow,
      updateRow,
      deleteRow,
    },
  }
}
