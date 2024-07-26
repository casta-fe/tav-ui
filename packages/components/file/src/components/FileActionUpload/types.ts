import { type PropType, type Ref } from 'vue'
import { type UploadProps as AUploadProps } from 'ant-design-vue'
import {
  type ApiUploadFileParams,
  type FileActionUploadApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'
import { type ArgumentsOf } from '../../utils'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_MODE } from '../../consts'
import type { ExtractPropTypes } from 'vue'

export type FileType = ArgumentsOf<AUploadProps['beforeUpload']>[0]
export type UploadFileType = ArgumentsOf<AUploadProps['onPreview']>[0]

export const fileActionUploadProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['fileActionUpload'],
  apiParams: {
    type: Object as PropType<FileActionUploadApiParams>,
    default: () => ({ ...DEFAULT_FILE_API_PARAMS }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // AUpload props, multiple/accept/maxCount 已从 globalConfigFileProps['fileActionUpload'] 解构
  // /** 暂时不考虑接收外部已上传的 file，因为当前组件不展示 previewlist 只负责上传 */
  // fileList: { type: Array as PropType<AUploadProps['fileList']> },
  icon: { type: String, default: 'ant-design:upload-outlined' },
  disabled: { type: Object as PropType<AUploadProps['disabled']> },
  name: { type: String as PropType<AUploadProps['name']>, default: 'files' },
  openFileDialogOnClick: {
    type: Boolean as PropType<AUploadProps['openFileDialogOnClick']>,
    default: true,
  },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  /** apiUploadFile 已从 ...globalConfigFileProps['fileTypeSelect'] 取到 */
  beforeApiUploadFile: {
    type: Function as PropType<(apiParams: Partial<ApiUploadFileParams>) => Promise<any>>,
  },
  afterApiUploadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileActionUploadProps = ExtractPropTypes<typeof fileActionUploadProps>

export const fileActionUploadEmits = {
  change: (...args: ArgumentsOf<AUploadProps['onChange']>) => args instanceof Object,
  /** 上传成功前校验成功的列表 */
  validateSuccessChange: (...args: [FileType[]]) => args instanceof Object,
  /** 上传成功前校验失败的列表 */
  validateFailureChange: (...args: [FileType[]]) => args instanceof Object,
  /** 上传成功后的列表 */
  uploadedChange: (...args: [FileActionUploadApiResponseRecord[]]) => args instanceof Object,
}

export type FileActionUploadEmits = typeof fileActionUploadEmits

export interface FileActionUploadInstance {
  elRef: Ref<HTMLDivElement | undefined>
  resetFileList: () => void
}
