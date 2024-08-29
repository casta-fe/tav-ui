import { type FileMode } from '../typings'

export function isReadMode(mode: FileMode) {
  return mode === 'read'
}

export function isUpdateMode(mode: FileMode) {
  return mode === 'update' || mode === 'updateInstantly'
}

export function isHyperlinkRow(rowHyperlink?: number) {
  return rowHyperlink === 1
}

export function isAutoRow(rowAuto?: number) {
  return rowAuto === 1
}

export function isOwnerOrAdmin(globalConfigUserInfo: Record<string, any>, owner?: string) {
  return (owner && owner === `${globalConfigUserInfo.userId}`) || globalConfigUserInfo.isAdmin
}

/** 是否有下载水印权限，后端判断通过该字段体现 */
export function isWatermarkFileDownloadRow(rowWatermarkFileDownload?: number) {
  return !!rowWatermarkFileDownload
}

/** 是否有下载水印权限，后端判断通过该字段体现 */
export function isSourceFileDownloadRow(rowSourceFileDownload?: number) {
  return !!rowSourceFileDownload
}

export function isFullNameColEdit(
  enabledRowEdit: boolean,
  mode: FileMode,
  enabledOwner: boolean,
  globalConfigUserInfo: Record<string, any>,
  owner?: string
) {
  return !isReadMode(mode)
    ? enabledRowEdit && (enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo, owner) : true)
    : false
}

export function isVersionColVisible(
  enabledVersion: boolean,
  rowHyperlink?: number,
  rowAuto?: number
) {
  return enabledVersion && !(isHyperlinkRow(rowHyperlink) || isAutoRow(rowAuto))
}

/** 上传节点列，只读默认隐藏，其他模式默认显示。开发可通过 column 控制 */
export function isModuleFullNameColVisible(mode: FileMode) {
  return isReadMode(mode) ? true : false
}

export function isViewBtnVisible(rowHyperlink: number) {
  return !isHyperlinkRow(rowHyperlink)
}

export function isUpdateBtnVisible(
  enabledUpdate: boolean,
  mode: FileMode,
  rowHyperlink: number,
  rowAuto: number,
  enabledOwner: boolean,
  globalConfigUserInfo: Record<string, any>,
  owner?: string
) {
  return (
    !isReadMode(mode) &&
    enabledUpdate &&
    !(isHyperlinkRow(rowHyperlink) || isAutoRow(rowAuto)) &&
    (enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo, owner) : true)
  )
}

export function isDownloadWatermarkBtnVisible(
  rowHyperlink: number,
  rowWatermarkFileDownload: number
) {
  return !isHyperlinkRow(rowHyperlink) && isWatermarkFileDownloadRow(rowWatermarkFileDownload)
}

export function isDownloadBtnVisible(rowHyperlink: number, rowSourceFileDownload: number) {
  return !isHyperlinkRow(rowHyperlink) && isSourceFileDownloadRow(rowSourceFileDownload)
}

export function isDeleteBtnVisible(
  mode: FileMode,
  enabledOwner: boolean,
  globalConfigUserInfo: Record<string, any>,
  owner?: string
) {
  return !isReadMode(mode) && (enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo, owner) : true)
}

export function isLogBtnVisible(
  enabledOwner: boolean,
  globalConfigUserInfo: Record<string, any>,
  owner?: string
) {
  return enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo, owner) : true
}
