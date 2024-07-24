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
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => any,
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => any
) {
  const DEFAULT_ACTIONS: FileVersionTableAction[] = [
    {
      field: 'view',
      label: tavI18n('Tav.file.actions.1'),
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
  ]

  return DEFAULT_ACTIONS
}

export function useActions(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>
  handleViewBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDownloadWatermarkBtnClick: (row: FileActionUploadApiResponseRecord) => any
  handleDownloadBtnClick: (row: FileActionUploadApiResponseRecord) => any
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
