import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { type FileActionUploadLinkProps } from '../types'
import { type UseRequestHandleApiDefaultOptions } from '../../../hooks'

export function useMode(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileActionUploadLinkProps>
}) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function uploadLinkApiOptions(
    apiParams: FileActionUploadLinkProps['apiParams'],
    payload: {
      name?: string
      address?: string
    }
  ) {
    if (!mergedProps.value.apiUploadFileLink) {
      console.warn('[tavui TaFileActionUploadLink] apiUploadFileLink is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileActionUploadLinkProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiUploadFileLink,
      beforeApi: mergedProps.value.beforeApiUploadFileLink,
      afterApi: mergedProps.value.afterApiUploadFileLink,
      apiParams: {
        appId: apiParams.appId,
        address: payload.address ?? apiParams.address,
        moduleCode: apiParams.moduleCode,
        name: payload.name ?? apiParams.name,
        typeCode: apiParams.typeCode,
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
        businessParamsJson: apiParams.businessParamsJson,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
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

  return {
    apiActions: {
      uploadLinkApiOptions,
    },
  }
}
