import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileViewProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FileViewApiResponse,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileViewProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function viewApiOptions(
    apiParams: FileViewProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiViewFile) {
      console.warn('[tavui TaFileTable] apiViewFile is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileViewProps['apiParams'],
      FileViewApiResponse
    > = {
      api: mergedProps.value.apiViewFile,
      beforeApi: mergedProps.value.beforeApiViewFile,
      afterApi: mergedProps.value.afterApiViewFile,
      apiParams: {
        appId: apiParams.appId,
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
