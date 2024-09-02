import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileLogProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileLogProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function logApiOptions(
    apiParams: FileLogProps['apiParams'],
    file: FileActionUploadApiResponseRecord
  ) {
    if (!mergedProps.value.apiQueryFileLog) {
      console.warn('[tavui TaFileLog] apiQueryFileLog is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileLogProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileLog as any,
      beforeApi: mergedProps.value.beforeApiQueryFileLog,
      afterApi: mergedProps.value.afterApiQueryFileLog,
      apiParams: {
        // appId: apiParams.appId,
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
      logApiOptions,
    },
  }
}
