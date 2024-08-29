import { type FileActionUploadApiResponseRecord } from '../typings'

/**
 * 继承当前行的权限判断数据
 * @param row
 * @param data
 * @returns
 */
export function extendCurrentRowActionsAuth(
  row: FileActionUploadApiResponseRecord,
  data?: FileActionUploadApiResponseRecord[]
) {
  if (!data) return []

  return data.map((d: FileActionUploadApiResponseRecord) => ({
    ...d,
    hyperlink: row.hyperlink,
    watermarkFileDownload: row.watermarkFileDownload,
    sourceFileDownload: row.sourceFileDownload,
  }))
}
