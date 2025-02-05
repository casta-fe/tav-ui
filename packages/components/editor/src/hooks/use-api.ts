import { type ComputedRef, unref } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type UseRequestHandleApiDefaultOptions } from '@tav-ui/components/file/src/hooks/use-request'
import { type FileUploadApiResponseRecord } from '@tav-ui/components/file/src/components/FileUpload'
import {
  type EditorProps,
  // type FileUploadImagePropResponse,
  // type FileUploadImageResponseRecord,
} from '../typings'

export function useApi(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  // function uploadImageVarsApiOptions(apiParams: EditorProps['apiParams']) {
  //   if (!mergedProps.value.apiUploadImageVars) {
  //     console.warn('[tavui TaEditor] apiUploadImageVars is undefined')
  //     return
  //   }

  //   const options: UseRequestHandleApiDefaultOptions<
  //     ApiUploadImageVarsParams,
  //     FileUploadImagePropResponse
  //   > = {
  //     api: mergedProps.value.apiUploadImageVars,
  //     beforeApi: mergedProps.value.beforeApiUploadImageVars,
  //     afterApi: mergedProps.value.afterApiUploadImageVars,
  //     apiParams: {
  //       appId: apiParams.appId,
  //     },
  //     // successMessage: () => {
  //     //   return tavI18n('Tav.file.message.6')
  //     // },
  //     failureMessage: () => {
  //       return tavI18n('Tav.common.httpError')
  //     },
  //   }

  //   return options
  // }

  // function uploadImageApiOptions(apiParams: EditorProps['apiParams'], files: File[]) {
  //   if (!mergedProps.value.apiUploadImage) {
  //     console.warn('[tavui TaEditor] apiUploadImage is undefined')
  //     return
  //   }

  //   const options: UseRequestHandleApiDefaultOptions<
  //     ApiUploadImageParams,
  //     FileUploadImageResponseRecord[]
  //   > = {
  //     api: mergedProps.value.apiUploadImage,
  //     beforeApi: mergedProps.value.beforeApiUploadImage,
  //     afterApi: mergedProps.value.afterApiUploadImage,
  //     catchError: mergedProps.value.catchApiUploadImageError,
  //     apiParams: {
  //       appId: apiParams.appId,
  //       files: unref(files),
  //       isCompress: apiParams.isCompress,
  //       isScale: apiParams.isScale,
  //       scaleWidth: apiParams.scaleWidth,
  //       scaleHeight: apiParams.scaleHeight,
  //     },
  //     transformApiParamsToFormData: {
  //       fileFiledName: 'files',
  //       filterNames: ['appId'],
  //     },
  //     successMessage: () => {
  //       return tavI18n('Tav.file.message.6')
  //     },
  //     failureMessage: () => {
  //       return tavI18n('Tav.common.httpError')
  //     },
  //   }

  //   return options
  // }
  function previewFileApiOptions(file: FileUploadApiResponseRecord) {
    if (!mergedProps.value.apiPreviewFile) {
      console.warn('[tavui TaEditor] previewApi is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<any, any> = {
      api: mergedProps.value.apiPreviewFile,
      apiParams: {
        url: unref(file).url,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
    }

    return options
  }
  //:========================================: api actions :========================================://

  return {
    apiActions: {
      // uploadImageVarsApiOptions,
      // uploadImageApiOptions,
      previewFileApiOptions,
    },
  }
}

export type UseApiReturn = ReturnType<typeof useApi>
