import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FilePreviewProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FilePreviewApiResponse,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FilePreviewProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function viewApiOptions(
    apiParams: FilePreviewProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiPreviewFile) {
      console.warn('[tavui TaFilePreview] apiPreviewFile is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FilePreviewProps['apiParams'],
      FilePreviewApiResponse
    > = {
      api: mergedProps.value.apiPreviewFile,
      beforeApi: mergedProps.value.beforeApiPreviewFile,
      afterApi: mergedProps.value.afterApiPreviewFile,
      apiParams: {
        id: file.id!,
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

  return {
    apiActions: {
      viewApiOptions,
    },
  }
}
