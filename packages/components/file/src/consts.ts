import { type FileMode } from './typings/types'
import { createId, createNS } from './utils'

export const DEFAULT_HTTP_ERROR_TIP = (i18n: any) => i18n('Tav.common.httpError')
export const DEFAULT_EMPTY_TIP = (i18n: any) => i18n('Tav.common.emptyText')
export const DEFAULT_DELY_TIME = 80
export const DEFAULT_LOADING_TIP = (i18n: any) => i18n('Tav.common.loadingText')
export const DEFAULT_TYPE_SELECT_PLACEHOLDER = (i18n: any) => i18n('Tav.file.message.5')
export const DEFAULT_UPLOAD_TIP = (i18n: any) => i18n('Tav.file.upload.1')
export const DEFAULT_UPLOADLINK_TIP = (i18n: any) => i18n('Tav.file.upload.3')
export const DEFAULT_UPLOADLINK_CLOSE_TIP = (i18n: any) => i18n('Tav.file.upload.2')

export const ns = createNS('file')
export const DEFAULT_FILE_CLASSNAME = ns.b()
export const DEFAULT_FILE_ID = createId(DEFAULT_FILE_CLASSNAME)
export const DEFAULT_FILEACTIONS_CLASSNAME = ns.b('actions')
export const DEFAULT_FILEACTIONS_ID = createId(DEFAULT_FILEACTIONS_CLASSNAME)
export const DEFAULT_FILETYPESELECT_CLASSNAME = ns.b('type-select')
export const DEFAULT_FILETYPESELECT_ID = createId(DEFAULT_FILETYPESELECT_CLASSNAME)
export const DEFAULT_FILEACTIONUPLOAD_CLASSNAME = ns.b('action-upload')
export const DEFAULT_FILEACTIONUPLOAD_ID = createId(DEFAULT_FILEACTIONUPLOAD_CLASSNAME)
export const DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME = ns.b('action-upload-link')
export const DEFAULT_FILEACTIONUPLOADLINK_ID = createId(DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME)
export const DEFAULT_FILEACTIONUPLOADLINKFORM_CLASSNAME = ns.b('action-upload-link-form')
export const DEFAULT_FILEACTIONUPLOADLINKFORM_ID = createId(
  DEFAULT_FILEACTIONUPLOADLINKFORM_CLASSNAME
)
export const DEFAULT_FILETABLE_CLASSNAME = ns.b('table')
export const DEFAULT_FILETABLE_ID = createId(DEFAULT_FILETABLE_CLASSNAME)
export const DEFAULT_FILEVERSION_CLASSNAME = ns.b('version')
export const DEFAULT_FILEVERSION_ID = createId(DEFAULT_FILEVERSION_CLASSNAME)
export const DEFAULT_FILEPREVIEW_CLASSNAME = ns.b('preview')
export const DEFAULT_FILEPREVIEW_ID = createId(DEFAULT_FILEPREVIEW_CLASSNAME)
export const DEFAULT_FILELOG_CLASSNAME = ns.b('log')
export const DEFAULT_FILELOG_ID = createId(DEFAULT_FILELOG_CLASSNAME)
export const DEFAULT_ROWEDITOR_CLASSNAME = ns.b('table-row-editor')
export const DEFAULT_ROWEDITOR_ID = createId(DEFAULT_ROWEDITOR_CLASSNAME)
export const DEFAULT_FILECARDS_CLASSNAME = ns.b('cards')
export const DEFAULT_FILECARD_CLASSNAME = ns.b('card')
export const DEFAULT_FILECARDS_ID = createId(DEFAULT_FILECARDS_CLASSNAME)
export const DEFAULT_CARD_ROWEDITOR_CLASSNAME = ns.b('card-row-editor')
export const DEFAULT_CARD_ROWEDITOR_ID = createId(DEFAULT_CARD_ROWEDITOR_CLASSNAME)
export const DEFAULT_FILEUPLOAD_CLASSNAME = ns.b('upload')
export const DEFAULT_FILEUPLOAD_ID = createId(DEFAULT_FILEUPLOAD_CLASSNAME)
export const DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME = ns.b('upload-preview')
export const DEFAULT_FILEUPLOAD_PREVIEW_ID = createId(DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME)

export const DEFAULT_FILE_OFFICE_TYPES = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
export const DEFAULT_FILE_IMAGE_TYPES = ['gif', 'jpeg', 'jpg', 'png']
/** 支持的文件类型，目前只支持 wps 支持的类型与图片类型 */
export const DEFAULT_FILE_ACCEPT_TYPES = [
  ...DEFAULT_FILE_OFFICE_TYPES, // office
  ...DEFAULT_FILE_IMAGE_TYPES, // image
]
/** 不支持的文件类型 */
export const DEFAULT_FILE_IGNORE_TYPES = [
  ...['zip', 'tar', '7z'], // previous ignoreList
  ...['mp3', 'mp3', 'wav', 'rm', 'rpm'], // audio
  ...['mpeg', 'mpg', 'avi', 'movie'], // video
  ...['txt'], // text
]
/** 文件类型控制 */
export const DEFAULT_FILE_ACCEPT = DEFAULT_FILE_ACCEPT_TYPES.map((t) => `.${t}`).join(',')

/** 文件是否支持多选 */
export const DEFAULT_MULTIPLE = true

/** 文件最大上传个数 */
export const DEFAULT_FILE_MAX_COUNT = 10

/** 文件大小控制，最小不控制，最大 1G */
export const DEFAULT_FILE_SIZE_RANGE: (number | null)[] = [null, 1024 * 1024 * 1024]

/** 文件名非法字符校验正则 */
export const DEFAULT_FILE_NAME_REGEXP = new RegExp(`[\\\\/:*?"<>|]`, 'g')

/** mode 默认值 */
export const DEFAULT_FILE_MODE: FileMode = 'read'

/** 链接地址校验 */
export const DEFAULT_FILE_LINK_REGEXP_STRING =
  /^((?<protocol>http|https|ftp):\/\/)?(?<hostname>[a-zA-Z0-9\u4e00-\u9fa5])+(?<dot>\.){1}(?<rootdomainPathQuery>[a-zA-Z0-9\u4e00-\u9fa5])+/

/** apiparams 默认的 businessParamsJson */
export const DEFAULT_APIPARAM_BUSINESSPARAMSJSON = {
  businessParamsJson: JSON.stringify({}),
}
/** apiparams 默认的 permissionControl */
export const DEFAULT_APIPARAM_PERMISSIONCONTROL = {
  permissionControl: false,
}
/** apiparams 默认的 businessCheck */
export const DEFAULT_APIPARAM_BUSINESSCHECK = {
  businessCheck: true,
}
/** apiparams 默认的 excludeDeleted */
export const DEFAULT_APIPARAM_EXCLUDEDELETED = {
  excludeDeleted: true,
}
/** apiparams 默认的 excludeStaging */
export const DEFAULT_APIPARAM_EXCLUDESTAGING = {
  excludeStaging: false,
}
export const DEFAULT_APIPARAMS = {
  ...DEFAULT_APIPARAM_BUSINESSPARAMSJSON,
  ...DEFAULT_APIPARAM_PERMISSIONCONTROL,
  ...DEFAULT_APIPARAM_BUSINESSCHECK,
  // ...DEFAULT_APIPARAM_EXCLUDEDELETED,
  // ...DEFAULT_APIPARAM_EXCLUDESTAGING,
}
