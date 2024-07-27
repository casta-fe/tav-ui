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
  //:========================================: api actions :========================================://

  //:========================================: validate actions :========================================://
  function withValidateTypeCode(instance: ComponentInternalInstance | null) {
    const parentEl = instance?.proxy?.$el
    if (
      parentEl &&
      parentEl.classList.contains('ta-file-table') &&
      (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly')
    ) {
      // filetable 下的 actionupload 在这俩种模式下不校验
      return false
    }
    return true
  }
  //:========================================: validate actions :========================================://

  return {
    apiActions: {
      uploadApiOptions,
    },
    validateActions: {
      withValidateTypeCode,
    },
  }
}
