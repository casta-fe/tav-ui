import { type ExtractPropTypes, type PropType } from 'vue'
import {
  DEFAULT_FILE_ACCEPT,
  DEFAULT_FILE_IMAGE_ACCEPT,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_SIZE_RANGE,
  DEFAULT_MULTIPLE,
} from '../consts'

export const globalConfigEditorProps = {
  /** 文件类型控制 */
  imageAccept: { type: String, default: DEFAULT_FILE_IMAGE_ACCEPT },
  fileAccept: { type: String, default: DEFAULT_FILE_ACCEPT },
  /** 文件是否支持多选 */
  multiple: { type: Boolean, default: DEFAULT_MULTIPLE },
  /** 文件最大上传个数 */
  maxCount: { type: Number, default: DEFAULT_FILE_MAX_COUNT },
  /** 文件大小控制 */
  sizeRange: { type: Array as PropType<(number | null)[]>, default: DEFAULT_FILE_SIZE_RANGE },
  /** 文件名非法字符校验 */
  nameRegExp: { type: Object as PropType<RegExp>, default: DEFAULT_FILE_NAME_REGEXP },
  /** 全局注入的 uploadvars */
  uploadVarsJson: {
    type: String,
  },
  /** 编辑器上传图片接口 */
  apiUploadImage: {
    type: Function as PropType<(params: any) => Promise<any>>,
  },
  /** 编辑器上传文件接口 */
  apiUploadFile: {
    type: Function as PropType<(params: any) => Promise<any>>,
  },
  /** 编辑器预览文件接口 */
  apiPreviewFile: {
    type: Function as PropType<(params: any) => Promise<any>>,
  },
}

export type GlobalConfigEditorProps = ExtractPropTypes<typeof globalConfigEditorProps>
