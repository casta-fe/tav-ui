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
  isVersionColVisible,
  isViewBtnVisible,
  validateVersionCachesHasApiFile,
} from '../../utils'
import { type VersionCaches } from '../../hooks'

export function defaultActionsBuilder(
  mode: FileCardProps['mode'],
  enabledPreview: FileCardProps['enabledPreview'],
  enabledUpdate: FileCardProps['enabledUpdate'],
  enabledOwner: FileCardProps['enabledOwner'],
  enabledVersion: FileCardProps['enabledVersion'],
  row: FileActionUploadApiResponseRecord,
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => void,
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  handleLogBtnClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  globalConfigUserInfo: Ref<Record<string, any>>,
  VersionCachesController: VersionCaches
) {
  const DEFAULT_ACTIONS: FileCardListItemAction[] = [
    ...(enabledPreview
      ? [
          {
            field: 'view',
            label: tavI18n('Tav.file.actions.1'),
            enabled: isViewBtnVisible(row.hyperlink!),
            icon: 'ant-design:eye-outlined',
            onClick: () => {
              handleViewBtnClick(row)
            },
          },
        ]
      : []),
    {
      field: 'delete',
      label: tavI18n('Tav.file.actions.6'),
      enabled: isDeleteBtnVisible(mode, enabledOwner, globalConfigUserInfo.value, row.owner),
      icon: 'ant-design:delete-outlined',
      popConfirm: {
        title: tavI18n('Tav.file.message.9'),
        confirm: async () => {
          try {
            await handleDeleteBtnClick(row)
            return true
          } catch (error) {
            console.warn('[tavui TaFileCard] delete has error: ', error)
            return true
          }
        },
      },
    },
    ...(isUpdateBtnVisible(
      enabledUpdate,
      mode,
      row.hyperlink!,
      row.auto!,
      enabledOwner,
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
              enabledOwner,
              globalConfigUserInfo.value,
              row.owner
            ),
            disabled:
              mode === 'create' &&
              !validateVersionCachesHasApiFile(VersionCachesController['caches'][row.actualId!]),
            icon: 'ant-design:upload-outlined',
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
      icon: 'ant-design:cloud-download-outlined',
      onClick: async () => {
        await handleDownloadWatermarkBtnClick(row)
      },
    },
    {
      field: 'download',
      label: tavI18n('Tav.file.actions.3'),
      enabled: isDownloadBtnVisible(row.hyperlink!, row.sourceFileDownload!),
      icon: 'ant-design:download-outlined',
      onClick: async () => {
        await handleDownloadBtnClick(row)
      },
    },
    {
      field: 'log',
      label: tavI18n('Tav.file.actions.7'),
      enabled: isLogBtnVisible(enabledOwner, globalConfigUserInfo.value, row.owner),
      icon: 'ant-design:file-text-outlined',
      onClick: async () => {
        await handleLogBtnClick(row)
      },
    },
    {
      field: 'version',
      label: tavI18n('Tav.file.columns.4'),
      enabled: isVersionColVisible(enabledVersion, row.hyperlink, row.auto),
      icon: 'ant-design:interaction-outlined',
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
  VersionCachesController: VersionCaches
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
    VersionCachesController,
  } = options

  return computed(() => (row: FileActionUploadApiResponseRecord) => {
    const actions = mergedProps.value.actions
    const mode = mergedProps.value.mode
    const enabledPreview = mergedProps.value.enabledPreview
    const enabledUpdate = mergedProps.value.enabledUpdate
    const enabledOwner = mergedProps.value.enabledOwner
    const enabledVersion = mergedProps.value.enabledVersion

    let result = defaultActionsBuilder(
      mode,
      enabledPreview,
      enabledUpdate,
      enabledOwner,
      enabledVersion,
      row,
      handleViewBtnClick,
      handleUpdateBtnClick,
      handleDownloadWatermarkBtnClick,
      handleDownloadBtnClick,
      handleDeleteBtnClick,
      handleLogBtnClick,
      globalConfigUserInfo,
      VersionCachesController
    )

    if (actions && isFunction(actions)) {
      result = actions(result, { row })
    }

    return result
  })
}
