import { type ComputedRef } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import {
  type FileActionUploadApiResponseRecord,
  type FileTypeSelectApiResponseRecord,
} from '../../typings'
import { type FileCardsProps } from '../types'
import { type UseRequestHandleApiDefaultOptions } from '../../hooks'
import { type FileTypeSelectProps } from '../../components/FileTypeSelect'

export function useMode(options: { mergedProps: ComputedRef<FileCardsProps> }) {
  const { mergedProps } = options

  //:========================================: api actions :========================================://
  function typeSelectApiOptions(apiParams: FileCardsProps['apiParams']) {
    if (!mergedProps.value.apiQueryFileType) {
      console.warn('[tavui TaFileCards] apiQueryFileType is undefined')
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
        moduleCode: apiParams.moduleCode,
        typeCodes: apiParams.typeCodes,
        permissionControl: apiParams.permissionControl,
        ...(apiParams.visibleSubModules ? { visibleSubModules: apiParams.visibleSubModules } : {}),
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
  function apiQueryFileListOptions(apiParams: FileCardsProps['apiParams']) {
    if (!mergedProps.value.apiQueryFileList) {
      console.warn('[tavui TaFileCards] apiQueryFileList is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<
      FileCardsProps['apiParams'],
      FileActionUploadApiResponseRecord[]
    > = {
      api: mergedProps.value.apiQueryFileList,
      beforeApi: mergedProps.value.beforeApiQueryFileList,
      afterApi: mergedProps.value.afterApiQueryFileList,
      apiParams: {
        appId: apiParams.appId,
        businessCheck: apiParams.businessCheck,
        ...(apiParams.businessDisplayItem
          ? {
              businessDisplayItem: apiParams.businessDisplayItem,
            }
          : {}),
        ...(apiParams.businessIds
          ? {
              businessIds: apiParams.businessIds,
            }
          : {}),
        businessKey: apiParams.businessKey,
        ...(apiParams.businessSearchItems
          ? {
              businessSearchItems: apiParams.businessSearchItems,
            }
          : {}),
        endTime: apiParams.endTime,
        ...(typeof apiParams.excludeDeleted !== 'undefined'
          ? { excludeDeleted: apiParams.excludeDeleted }
          : {}),
        ...(typeof apiParams.excludeStaging !== 'undefined'
          ? { excludeStaging: apiParams.excludeStaging }
          : {}),
        ...(apiParams.id ? { id: apiParams.id } : {}),
        moduleCode: apiParams.moduleCode,
        owners: apiParams.owners,
        permissionControl: apiParams.permissionControl,
        ...(apiParams.searchValue ? { searchValue: apiParams.searchValue } : {}),
        ...(apiParams.startTime ? { startTime: apiParams.startTime } : {}),
        ...(apiParams.suffix ? { suffix: apiParams.suffix } : {}),
        ...(apiParams.typeCodes ? { typeCodes: apiParams.typeCodes } : {}),
        ...(apiParams.visibleSubModules ? { visibleSubModules: apiParams.visibleSubModules } : {}),
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
      //
    }

    return options
  }
  //:========================================: api actions :========================================://

  return {
    apiActions: {
      typeSelectApiOptions,
      apiQueryFileListOptions,
    },
  }
}
