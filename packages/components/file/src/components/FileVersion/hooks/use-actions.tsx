import { type ComputedRef, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { type FileVersionProps, type FileVersionTableAction } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import {
  isDownloadBtnVisible,
  isDownloadWatermarkBtnVisible,
  isViewBtnVisible,
} from '../../../utils'

export function defaultActionsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>,
  row: FileActionUploadApiResponseRecord,
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
) {
  const DEFAULT_ACTIONS: FileVersionTableAction[] = [
    {
      field: 'view',
      label: tavI18n('Tav.file.actions.1'),
      enabled: isViewBtnVisible(row.hyperlink!),
      onClick() {
        handleViewBtnClick(row)
      },
    },
    {
      field: 'downloadWatermark',
      label: tavI18n('Tav.file.actions.4'),
      // permission: props.tableActionPermission.download,
      enabled: isDownloadWatermarkBtnVisible(row.hyperlink!, row.watermarkFileDownload!),
      onClick: async () => {
        await handleDownloadWatermarkBtnClick(row)
      },
    },
    {
      field: 'download',
      label: tavI18n('Tav.file.actions.3'),
      enabled: isDownloadBtnVisible(row.hyperlink!, row.sourceFileDownload!),
      onClick: async () => {
        await handleDownloadBtnClick(row)
      },
    },
  ]

  return DEFAULT_ACTIONS
}

export function useActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
}) {
  const {
    mergedProps,
    handleViewBtnClick,
    handleDownloadWatermarkBtnClick,
    handleDownloadBtnClick,
  } = options

  return computed(() => (row: FileActionUploadApiResponseRecord) => {
    const actions = mergedProps.value.actions

    let result = defaultActionsBuilder(
      mergedProps,
      row,
      handleViewBtnClick,
      handleDownloadWatermarkBtnClick,
      handleDownloadBtnClick
    )

    if (actions && isFunction(actions)) {
      result = actions(result, { row })
    }

    return result
  })
}
