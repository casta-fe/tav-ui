import { type FileInjectedProps } from './typings'

export const RequestErrorTip = '请求出错，请联系系统管理员'
export const Dely = 80

/** 文件类型控制，.tar,.tar.gz,.tgz,.rar,zip,.7z,.bpm,.txt 删除非必要类型，目前只支持 wps 支持的类型与图片类型 */
export const DEFAULT_FILE_ACCPET: Required<FileInjectedProps>['accpet'] =
  '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.gif,.jpeg,.jpg,.png,'

/** 文件大小控制，最小不控制，最大 1G */
export const DEFAULT_FILE_SIZE_RANGE: Required<FileInjectedProps>['sizeRange'] = [
  null,
  1024 * 1024 * 1024,
]

/** 文件是否支持多选 */
export const DEFAULT_MULTIPLE: Required<FileInjectedProps>['multiple'] = true

/** 文件最大上传个数 */
export const DEFAULT_MULTIPLE_FILE_COUNT: Required<FileInjectedProps>['multipleFileCount'] = 10
