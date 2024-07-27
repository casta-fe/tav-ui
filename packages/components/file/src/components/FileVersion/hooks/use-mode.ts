import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileVersionProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function historyApiOptions(
    apiParams: FileVersionProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiQueryFileHistory) {
      console.warn('[tavui TaFileTable] apiQueryFileHistory is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileVersionProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileHistory,
      beforeApi: mergedProps.value.beforeApiQueryFileHistory,
      afterApi: mergedProps.value.afterApiQueryFileHistory,
      apiParams: {
        actualIds: [file.actualId!],
      } as any,
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
      historyApiOptions,
    },
  }
}
