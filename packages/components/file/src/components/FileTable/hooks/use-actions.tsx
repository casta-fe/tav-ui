import { type ComputedRef, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { type FileTableAction, type FileTableProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import {
  isDeleteBtnVisible,
  isDownloadBtnVisible,
  isDownloadWatermarkBtnVisible,
  isUpdateBtnVisible,
  isViewBtnVisible,
} from '../../../utils'

export function defaultActionsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>,
  row: FileActionUploadApiResponseRecord,
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => void,
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
) {
  const mode = mergedProps.value.mode

  const DEFAULT_ACTIONS: FileTableAction[] = [
    ...(mergedProps.value.enabledPreview
      ? [
          {
            field: 'view',
            label: tavI18n('Tav.file.actions.1'),
            // permission: props.tableActionPermission.preview,
            enabled: isViewBtnVisible(row.hyperlink!),
            onClick: () => {
              handleViewBtnClick(row)
            },
          },
        ]
      : []),
    ...(isUpdateBtnVisible(mode, row.hyperlink!, row.auto!)
      ? [
          {
            field: 'update',
            label: tavI18n('Tav.file.actions.5'),
            enabled: isUpdateBtnVisible(mode, row.hyperlink!, row.auto!),
            onClick: async () => {
              await handleUpdateBtnClick(row)
            },
          },
        ]
      : []),
    {
      field: 'downloadWatermark',
      label: tavI18n('Tav.file.actions.4'),
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
    {
      field: 'delete',
      label: tavI18n('Tav.file.actions.6'),
      enabled: isDeleteBtnVisible(mode),
      popConfirm: {
        title: tavI18n('Tav.file.message.9'),
        confirm: async () => {
          await handleDeleteBtnClick(row)
        },
      },
    },
  ]

  return DEFAULT_ACTIONS
}

export function useActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => void
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
}) {
  const {
    mergedProps,
    handleViewBtnClick,
    handleUpdateBtnClick,
    handleDownloadWatermarkBtnClick,
    handleDownloadBtnClick,
    handleDeleteBtnClick,
  } = options

  return computed(() => (row: FileActionUploadApiResponseRecord) => {
    const actions = mergedProps.value.actions

    let result = defaultActionsBuilder(
      mergedProps,
      row,
      handleViewBtnClick,
      handleUpdateBtnClick,
      handleDownloadWatermarkBtnClick,
      handleDownloadBtnClick,
      handleDeleteBtnClick
    )

    if (actions && isFunction(actions)) {
      result = actions(result, { row })
    }

    return result
  })
}
