import { type ComputedRef, type SetupContext, nextTick } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import {
  type ApiDeleteFileParams,
  type ApiQueryFileListParams,
  type ApiUpdateFileNameAndLinkParams,
  type CardValidateCallback,
  type FileCardEmits,
  type FileCardProps,
} from '../types'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { type UseRequestHandleApiDefaultOptions, type VersionCaches } from '../../hooks'
import { type ArgumentsOf, type ReturnOf, validateVersionCachesHasApiFile } from '../../utils'
import { type UseCardActionsReturn } from './use-card-actions'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  emits: SetupContext<FileCardEmits>['emit']
  VersionCachesController: VersionCaches
  handleApiDataSource: (params?: any) => Promise<void>
  hasEmptyDataSource: ComputedRef<boolean>
}) {
  const { mergedProps, VersionCachesController, handleApiDataSource, hasEmptyDataSource } = options

  //:========================================: api actions :========================================://
  function rowEditorApiOptions(
    apiParams: FileCardProps['apiParams'],
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
    apiParams: FileCardProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiQueryFileHistory) {
      console.warn('[tavui TaFileTable] apiQueryFileHistory is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      ArgumentsOf<FileCardProps['apiQueryFileHistory']>[0],
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
    apiParams: FileCardProps['apiParams'],
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
  async function reloadRows(params?: Partial<ApiQueryFileListParams>) {
    if (!mergedProps.value.visible) return
    await nextTick()

    const handleReload = async () => {
      await handleApiDataSource(params)
    }

    if (mergedProps.value.mode === 'read') {
      if (!hasEmptyDataSource.value) {
        console.warn(
          '[tavui TaFileCard] "reload" not working in mode "read" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    } else if (mergedProps.value.mode === 'create') {
      if (!hasEmptyDataSource.value) {
        console.warn(
          '[tavui TaFileCard] "reload" not working in mode "create" combine with "dataSource"'
        )
      } else {
        console.warn('[tavui TaFileCard] "reload" not working in mode "create"')
      }
    } else if (mergedProps.value.mode === 'update') {
      if (!hasEmptyDataSource.value) {
        console.warn(
          '[tavui TaFileCard] "reload" not working in mode "update" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    } else {
      if (!hasEmptyDataSource.value) {
        console.warn(
          '[tavui TaFileCard] "reload" not working in mode "updateInstantly" combine with "dataSource"'
        )
      } else {
        await handleReload()
      }
    }
  }

  async function editRow(
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    _row: FileActionUploadApiResponseRecord,
    cardUpdateRows: UseCardActionsReturn['cardUpdateRows'],
    editRowApiAction: (...args: any[]) => Promise<any>,
    hasEmptyDataSource: ComputedRef<boolean>,
    refreshCardDataApiAction: (params?: Partial<ApiQueryFileListParams>) => Promise<void>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))

    function createNewRow() {
      const newrow = { ...row }
      if (changeEventPayload.name) newrow.name = changeEventPayload.name
      if (newrow.hyperlink) {
        if (changeEventPayload.address) newrow.address = changeEventPayload.address
      } else {
        if (changeEventPayload.name) newrow.fullName = `${changeEventPayload.name}.${newrow.suffix}`
      }
      return newrow
    }

    async function action(newrow: any) {
      await cardUpdateRows({
        rows: [newrow],
        deleteRows: [row],
      })
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      const newrow = createNewRow()
      VersionCachesController.updateFileCaches(newrow)
      await editRowApiAction(changeEventPayload)
      await action(newrow)
    } else if (mode === 'update') {
      const newrow = createNewRow()
      VersionCachesController.updateFileCaches(newrow)
      !validateVersionCachesHasApiFile(VersionCachesController['caches'][row.actualId!]) &&
        (await editRowApiAction(changeEventPayload))
      await action(newrow)
    } else {
      const newrow = createNewRow()
      VersionCachesController.updateFileCaches(newrow)
      await editRowApiAction(changeEventPayload)
      if (hasEmptyDataSource.value) {
        // 无外部传入的 datasource 才操作
        await refreshCardDataApiAction({ typeCodes: [mergedProps.value.value!] }) // 刷新会调用接口进入 watch datasource 逻辑
      } else {
        await action(newrow)
      }
    }
  }

  async function updateRow(
    _row: FileActionUploadApiResponseRecord,
    _clickedRow: FileActionUploadApiResponseRecord,
    cardUpdateRows: UseCardActionsReturn['cardUpdateRows'],
    hasEmptyDataSource: ComputedRef<boolean>,
    refreshCardDataApiAction: (params?: Partial<ApiQueryFileListParams>) => Promise<void>
  ) {
    const mode = mergedProps.value.mode
    const row = JSON.parse(JSON.stringify(_row))
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action(updatedVersionRow?: FileActionUploadApiResponseRecord) {
      await cardUpdateRows({
        rows: [{ ...clickedRow, ...(updatedVersionRow ?? row) }], // merge 原数据，兼容插入的业务字段
        deleteRows: [clickedRow],
      })
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
    } else if (mode === 'update') {
      VersionCachesController.createFileCache(row, mode)
      const latestVersionFileCache = VersionCachesController.readFileCacheLatestVersion(
        row.actualId!
      )
      await action(latestVersionFileCache)
    } else {
      VersionCachesController.createFileCache(row, mode)
      if (hasEmptyDataSource.value) {
        // 无外部传入的 datasource 才操作
        await refreshCardDataApiAction({ typeCodes: [mergedProps.value.value!] }) // 刷新会调用接口进入 watch datasource 逻辑
      } else {
        await action()
      }
    }
  }

  async function deleteRow(
    _clickedRow: FileActionUploadApiResponseRecord,
    cardDeleteRows: UseCardActionsReturn['cardDeleteRows'],
    deleteRowApiAction: () => Promise<void>,
    hasEmptyDataSource: ComputedRef<boolean>,
    refreshCardDataApiAction: (params?: Partial<ApiQueryFileListParams>) => Promise<void>,
    validate: (trigger: string, callback?: CardValidateCallback) => Promise<boolean>
  ) {
    const mode = mergedProps.value.mode
    const clickedRow = JSON.parse(JSON.stringify(_clickedRow))

    async function action() {
      await cardDeleteRows({
        rows: [clickedRow],
      })
    }

    if (mode === 'read') {
      //
    } else if (mode === 'create') {
      await action()
      mergedProps.value.autoValidate && (await validate('change'))
    } else if (mode === 'update') {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      await action()
      mergedProps.value.autoValidate && (await validate('change'))
    } else {
      VersionCachesController.deleteFileCaches(clickedRow.actualId!)
      if (hasEmptyDataSource.value) {
        // 无外部传入的 datasource 才操作
        await deleteRowApiAction()
        await refreshCardDataApiAction({ typeCodes: [mergedProps.value.value!] }) // 刷新会调用接口进入 watch datasource 逻辑
      } else {
        await action()
      }
      mergedProps.value.autoValidate && (await validate('change'))
    }
  }
  //:========================================: data actions :========================================://

  return {
    apiActions: {
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
