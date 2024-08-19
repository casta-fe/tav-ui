import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { type FileCardListItemAction, type FileCardProps } from '../types'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import {
  isDeleteBtnVisible,
  isDownloadBtnVisible,
  isDownloadWatermarkBtnVisible,
  isLogBtnVisible,
  isUpdateBtnVisible,
  isViewBtnVisible,
} from '../../utils'

export function defaultActionsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>,
  row: FileActionUploadApiResponseRecord,
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => void,
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleLogBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  globalConfigUserInfo: Ref<Record<string, any>>
) {
  const mode = mergedProps.value.mode
  const enabledPreview = mergedProps.value.enabledPreview
  const enabledUpdate = mergedProps.value.enabledUpdate

  const DEFAULT_ACTIONS: FileCardListItemAction[] = [
    ...(enabledPreview
      ? [
          {
            field: 'view',
            label: tavI18n('Tav.file.actions.1'),
            enabled: isViewBtnVisible(row.hyperlink!),
            onClick: () => {
              handleViewBtnClick(row)
            },
          },
        ]
      : []),
    {
      field: 'delete',
      label: tavI18n('Tav.file.actions.6'),
      enabled: isDeleteBtnVisible(
        mode,
        mergedProps.value.enabledOwner,
        globalConfigUserInfo.value,
        row.owner
      ),
      popConfirm: {
        title: tavI18n('Tav.file.message.9'),
        confirm: async () => {
          await handleDeleteBtnClick(row)
        },
      },
    },
    ...(isUpdateBtnVisible(
      enabledUpdate,
      mode,
      row.hyperlink!,
      row.auto!,
      mergedProps.value.enabledOwner,
      globalConfigUserInfo.value,
      row.owner
    )
      ? [
          {
            field: 'update',
            label: tavI18n('Tav.file.actions.5'),
            enabled: isUpdateBtnVisible(
              enabledUpdate,
              mode,
              row.hyperlink!,
              row.auto!,
              mergedProps.value.enabledOwner,
              globalConfigUserInfo.value,
              row.owner
            ),
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
      field: 'log',
      label: tavI18n('Tav.file.actions.7'),
      enabled: isLogBtnVisible(
        mergedProps.value.enabledOwner,
        globalConfigUserInfo.value,
        row.owner
      ),
      onClick: async () => {
        await handleLogBtnClick(row)
      },
    },
  ]

  return DEFAULT_ACTIONS
}

export function useActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => void
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  handleLogBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  globalConfigUserInfo: Ref<Record<string, any>>
}) {
  const {
    mergedProps,
    handleViewBtnClick,
    handleUpdateBtnClick,
    handleDownloadWatermarkBtnClick,
    handleDownloadBtnClick,
    handleDeleteBtnClick,
    handleLogBtnClick,
    globalConfigUserInfo,
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
      handleDeleteBtnClick,
      handleLogBtnClick,
      globalConfigUserInfo
    )

    if (actions && isFunction(actions)) {
      result = actions(result, { row })
    }

    return result
  })
}
