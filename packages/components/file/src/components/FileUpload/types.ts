import { type PropType } from 'vue'
import { type UploadProps as AUploadProps } from 'ant-design-vue'
import { type ArgumentsOf } from '../../utils'
import {
  DEFAULT_FILE_ACCEPT,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_SIZE_RANGE,
} from '../../consts'
import type { ExtractPropTypes } from 'vue'

export interface FileUploadApiResponseRecord {
  url: string
  name: string
  suffix: string
  previewUrl?: string
  previewSupportWPS?: boolean
}

export const fileUploadProps = {
  value: {
    type: Array as PropType<FileUploadApiResponseRecord[]>,
    default: () => [],
  },
  apiParams: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  disabled: { type: Boolean as PropType<AUploadProps['disabled']> },
  name: { type: String as PropType<AUploadProps['name']>, default: 'files' },
  openFileDialogOnClick: {
    type: Boolean as PropType<AUploadProps['openFileDialogOnClick']>,
    default: true,
  },
  /** 调用上传接口前执行，可自行停止上传行为 */
  beforeUpload: {
    type: Function as PropType<(files: File[]) => boolean | Promise<boolean>>,
  },
  /** 文件类型控制 */
  accept: { type: String, default: DEFAULT_FILE_ACCEPT },
  /** 文件是否支持多选 */
  multiple: { type: Boolean, default: false },
  /** 文件最大上传个数 */
  maxCount: { type: Number, default: 1 },
  /** 文件大小控制 */
  sizeRange: { type: Array as PropType<(number | null)[]>, default: DEFAULT_FILE_SIZE_RANGE },
  /** 文件名非法字符校验 */
  nameRegExp: { type: Object as PropType<RegExp>, default: DEFAULT_FILE_NAME_REGEXP },
  /** 一旦类型确定，组件内部自动重写 accept */
  fileType: {
    type: String as PropType<'image' | 'office'>,
    default: 'image',
  },
  /** 上传成功后隐藏上传按钮，默认隐藏 */
  keepUploadVisible: {
    type: Boolean,
    default: false,
  },
  beforeApi: {
    type: Function as PropType<(apiParams: Record<string, any>) => Promise<any>>,
  },
  api: {
    type: Function as PropType<(apiParams: Record<string, any>) => Promise<any>>,
  },
  afterApi: {
    type: Function as PropType<(apiResult: any) => Promise<any>>,
  },
  beforePreviewApi: {
    type: Function as PropType<(apiParams: Record<string, any>) => Promise<any>>,
  },
  previewApi: {
    type: Function as PropType<(apiParams: Record<string, any>) => Promise<any>>,
  },
  afterPreviewApi: {
    type: Function as PropType<(apiResult: any) => Promise<any>>,
  },
  catchApiError: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileUploadProps = ExtractPropTypes<typeof fileUploadProps>

export const fileUploadEmits = {
  AUploadChange: (...args: ArgumentsOf<AUploadProps['onChange']>) => args instanceof Object,
  /** 上传成功前校验成功的列表 */
  validateSuccessChange: (...args: [ArgumentsOf<AUploadProps['beforeUpload']>[0][]]) =>
    args instanceof Object,
  /** 上传成功前校验失败的列表 */
  validateFailureChange: (...args: [ArgumentsOf<AUploadProps['beforeUpload']>[0][]]) =>
    args instanceof Object,
  'update:value': (...args: any[]) => args instanceof Object,
  change: (...args: any[]) => args instanceof Object,
}

export type FileUploadEmits = typeof fileUploadEmits

export interface FileUploadInstance {
  openFilePicker: () => Promise<void>
  cleanup(): void
}
