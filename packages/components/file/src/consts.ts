import { type ApiParams } from './typings'
import { createId, createNS } from './utils'

export const DEFAULT_HTTP_ERROR_TIP = (i18n: any) => i18n('Tav.common.httpError')
export const DEFAULT_EMPTY_TIP = (i18n: any) => i18n('Tav.common.emptyText')
export const DEFAULT_DELY_TIME = 80
export const DEFAULT_LOADING_TIP = (i18n: any) => i18n('Tav.common.loadingText')
export const DEFAULT_TYPE_SELECT_PLACEHOLDER = (i18n: any) => i18n('Tav.file.message.5')
export const DEFAULT_UPLOAD_TIP = (i18n: any) => i18n('Tav.file.upload.1')

const ns = createNS('file')
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
export const DEFAULT_FILEVIEW_CLASSNAME = ns.b('view')
export const DEFAULT_FILEVIEW_ID = createId(DEFAULT_FILEVIEW_CLASSNAME)

/** 文件类型控制，.tar,.tar.gz,.tgz,.rar,zip,.7z,.bpm,.txt 删除非必要类型，目前只支持 wps 支持的类型与图片类型 */
export const DEFAULT_FILE_ACCPET = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.gif,.jpeg,.jpg,.png,'

/** 文件是否支持多选 */
export const DEFAULT_MULTIPLE = true

/** 文件最大上传个数 */
export const DEFAULT_FILE_MAX_COUNT = 10

/** 文件大小控制，最小不控制，最大 1G */
export const DEFAULT_FILE_SIZE_RANGE: (number | null)[] = [null, 1024 * 1024 * 1024]

/** 文件名非法字符校验正则 */
export const DEFAULT_FILE_NAME_REGEXP = new RegExp(`[\\\\/:*?"<>|]`, 'g')

/** apiparams 默认值 */
export const DEFAULT_API_PARAMS: ApiParams = {
  moduleCodes: [],
  typeCodes: [],
  businessIds: [],
  businessKeys: [],
  permissionControl: false,
}
