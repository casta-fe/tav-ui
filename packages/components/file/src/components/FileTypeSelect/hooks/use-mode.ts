import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileTypeSelectApiResponseRecord, type GlobalConfigFileProps } from '../../../typings'
import { type FileTypeSelectProps } from '../types'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTypeSelectProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function typeSelectApiOptions(apiParams: FileTypeSelectProps['apiParams']) {
    if (!mergedProps.value.apiQueryFileType) {
      console.warn('[tavui TaFileTable] apiQueryFileType is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileTypeSelectProps['apiParams'],
      FileTypeSelectApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileType,
      beforeApi: mergedProps.value.beforeApiQueryFileType,
      afterApi: mergedProps.value.afterApiQueryFileType,
      apiParams: {
        appId: apiParams.appId,
        moduleCode: apiParams.moduleCode ?? '',
        typeCodes: apiParams.typeCodes ?? [],
        permissionControl: apiParams.permissionControl ?? false,
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
      typeSelectApiOptions,
    },
  }
}
