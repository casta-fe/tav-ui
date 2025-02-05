import { createId, createNS } from '@tav-ui/components/file/src/utils'
import {
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '@tav-ui/components/file/src/consts'

export {
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
  DEFAULT_MULTIPLE,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_SIZE_RANGE,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_LINK_REGEXP_STRING,
  DEFAULT_FILE_IGNORE_TYPES,
} from '@tav-ui/components/file/src/consts'

export const ns = createNS('editor')
export const DEFAULT_EDITOR_CLASSNAME = ns.b()
export const DEFAULT_EDITOR_ID = createId(DEFAULT_EDITOR_CLASSNAME)
export const DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME = ns.b('custom-uploadimage-modal')
export const DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_ID = createId(
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME
)
export const DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME = ns.b(
  'custom-uploadimage-modal-tab-image-link'
)
export const DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_ID = createId(
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME
)
export const DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME = ns.b('custom-uploadlink-modal')
export const DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_ID = createId(
  DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME
)
export const DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME = ns.b('custom-uploadfile-modal')
export const DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_ID = createId(
  DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME
)

/** 图片文件类型控制 */
export const DEFAULT_FILE_IMAGE_ACCEPT = DEFAULT_FILE_IMAGE_TYPES.map((t) => `.${t}`).join(',')

/** 文件类型控制 */
export const DEFAULT_FILE_ACCEPT = DEFAULT_FILE_OFFICE_TYPES.map((t) => `.${t}`).join(',')

export const DEFAULT_APIPARAM_UPLOAD_IMAGE = {
  isCompress: 1,
  isScale: 1,
  scaleWidth: 240, // 120 的 2x 图
  scaleHeight: 240, // 120 的 2x 图
}

export const DEFAULT_APIPARAMS = {
  ...DEFAULT_APIPARAM_UPLOAD_IMAGE,
}
