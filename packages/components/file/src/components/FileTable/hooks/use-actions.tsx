import { type ComputedRef, type Ref, computed, reactive, unref } from 'vue'
import { Spin } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { Cell } from '@tav-ui/components/table-pro/src/components/cell'
import { TaFileVersion } from '../../FileVersion'
import { type FileTableAction, type FileTableInstance, type FileTableProps } from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type FileMode,
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
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => any
) {
  const mode = mergedProps.value.mode
  const enabledVersion = mergedProps.value.enabledVersion

  const DEFAULT_ACTIONS: FileTableAction[] = [
    {
      field: 'view',
      label: tavI18n('Tav.file.actions.1'),
      // 抛出去通过 field 控制
      // permission: props.tableActionPermission.preview,
      enabled: isViewBtnVisible(row.hyperlink!),
      onClick() {
        handleViewBtnClick(row)
        // if (row.hyperlink === 1) {
        //   window.open(row.address)?.focus()
        //   return
        // }
        // previewRecord.value = [record]
        // showPreview.value = true
      },
    },
    ...(isUpdateBtnVisible(mode, enabledVersion, row.hyperlink!, row.auto!)
      ? [
          {
            field: 'update',
            label: tavI18n('Tav.file.actions.5'),
            enabled: isUpdateBtnVisible(mode, enabledVersion, row.hyperlink!, row.auto!),
            onClick() {
              handleUpdateBtnClick(row)
            },
          },
        ]
      : []),
    {
      field: 'downloadWatermark',
      label: tavI18n('Tav.file.actions.4'),
      // permission: props.tableActionPermission.download,
      enabled: isDownloadWatermarkBtnVisible(row.hyperlink!, row.watermarkFileDownload!),
      onClick() {
        handleDownloadWatermarkBtnClick(row)
        // props.download?.(record, undefined, true)
      },
    },
    {
      field: 'download',
      label: tavI18n('Tav.file.actions.3'),
      enabled: isDownloadBtnVisible(row.hyperlink!, row.sourceFileDownload!),
      onClick() {
        handleDownloadBtnClick(row)
        // props.download?.(record)
      },
    },
    {
      field: 'delete',
      label: tavI18n('Tav.file.actions.6'),
      enabled: isDeleteBtnVisible(mode),
      popConfirm: {
        title: tavI18n('Tav.file.message.9'),
        confirm: () => {
          handleDeleteBtnClick(row)
          // emit('delete', record)
        },
      },
    },
  ]

  return DEFAULT_ACTIONS
}

export function useActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleUpdateBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDeleteBtnClick: (row: FileActionUploadApiResponseRecord) => any
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
