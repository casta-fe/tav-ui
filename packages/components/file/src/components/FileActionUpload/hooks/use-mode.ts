import { type ComponentInternalInstance, type ComputedRef, unref } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileActionUploadProps } from '../types'
// import { type FileActionUploadHandleApiOptions } from './use-request'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileActionUploadProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function uploadApiOptions(
    apiParams: FileActionUploadProps['apiParams'],
    files: File[],
    callback: () => void
  ) {
    if (!mergedProps.value.apiUploadFile) {
      console.warn('[tavui TaFileActionUpload] apiUploadFile is undefined')
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
        moduleCode: apiParams.moduleCode,
        typeCode: apiParams.typeCode,
        businessParamsJson: apiParams.businessParamsJson,
        ...(apiParams.fileName
          ? {
              fileName: apiParams.fileName,
            }
          : {}),
      },
      transformApiParamsToFormData: {
        fileFiledName: mergedProps.value.name!,
        filterNames: ['appId'],
      },
      successMessage: () => {
        if (mergedProps.value.mode === 'read' || mergedProps.value.mode === 'create') {
          return tavI18n('Tav.file.message.6')
        } else {
          return tavI18n('Tav.file.message.8')
        }
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      callback,
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
        ...(apiParams.businessId
          ? {
              businessId: apiParams.businessId,
            }
          : {}),
        ...(apiParams.businessKey
          ? {
              businessKey: apiParams.businessKey,
            }
          : {}),
      }
    }

    return options
  }
  function updateApiOptions(
    apiParams: FileActionUploadProps['apiParams'],
    files: File[],
    row: FileActionUploadApiResponseRecord | undefined,
    callback: () => void
  ) {
    if (!mergedProps.value.apiUpdateFile) {
      console.warn('[tavui TaFileActionUpload] apiUpdateFile is undefined')
      return
    }

    if (!apiParams.moduleCode || !apiParams.typeCode) {
      console.warn('[tavui TaFileActionUpload] apiUpdateFile moduleCode & typeCode required!')
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
        moduleCode: apiParams.moduleCode,
        typeCode: apiParams.typeCode,
        businessParamsJson: apiParams.businessParamsJson,
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
        options['api'] = mergedProps.value.apiUpdateFile as any
        options['beforeApi'] = mergedProps.value.beforeApiUpdateFile as any
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
      options['api'] = mergedProps.value.apiUpdateFile as any
      options['beforeApi'] = mergedProps.value.beforeApiUpdateFile as any
      options['afterApi'] = mergedProps.value.afterApiUpdateFile
      const formData = new FormData()
      files.forEach((file) => formData.append('file', file))
      options['apiParams'] = {
        appId: apiParams.appId,
        fileActualId: row?.actualId,
        instantUpdate: true,
        formData,
      } as any
    }

    return options
  }
  //:========================================: api actions :========================================://

  //:========================================: validate actions :========================================://
  function withValidateTypeCode(instance: ComponentInternalInstance | null) {
    const parentEl = instance?.proxy?.$el?.parentElement
    if (parentEl && parentEl.classList.contains('ta-file-table')) {
      // filetable 下的 actionupload 不对 typecode 校验
      return false
    }
    return true
  }
  //:========================================: validate actions :========================================://

  return {
    apiActions: {
      uploadApiOptions,
      updateApiOptions,
    },
    validateActions: {
      withValidateTypeCode,
    },
  }
}
