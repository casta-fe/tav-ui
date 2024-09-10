import { type PropType } from 'vue'
import { type ButtonProps as AButtonProps, type UploadProps as AUploadProps } from 'ant-design-vue'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'
import { type ArgumentsOf } from '../../utils'
import { DEFAULT_APIPARAM_BUSINESSPARAMSJSON, DEFAULT_FILE_MODE } from '../../consts'
import type { ExtractPropTypes } from 'vue'

// 按照 swagger 编写
export interface ApiUploadFileParams {
  appId: ApiParams['appId']
  files: ApiParams['files']
  moduleCode: ApiParams['moduleCode']
  typeCode: ApiParams['typeCode']
  businessId?: ApiParams['businessId']
  businessKey?: ApiParams['businessKey']
  businessParamsJson?: ApiParams['businessParamsJson']
  fileName?: ApiParams['fileName']
}

// 按照 swagger 编写
export interface ApiUpdateFileParams {
  appId: ApiParams['appId']
  file: ApiParams['file']
  fileActualId: ApiParams['fileActualId']
  instantUpdate: ApiParams['instantUpdate']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileActionUploadApiParams
  extends ApiUploadFileParams,
    Partial<Omit<ApiUpdateFileParams, 'appId'>> {}

export const fileActionUploadProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileActionUpload'],
  apiParams: {
    type: Object as PropType<FileActionUploadApiParams>,
    default: () => ({ ...DEFAULT_APIPARAM_BUSINESSPARAMSJSON }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // AUpload props, multiple/accept/maxCount 已从 globalConfigFileProps['fileActionUpload'] 解构
  // /** 暂时不考虑接收外部已上传的 file，因为当前组件不展示 previewlist 只负责上传 */
  // fileList: { type: Array as PropType<AUploadProps['fileList']> },
  icon: { type: String, default: 'ant-design:upload-outlined' },
  disabled: { type: Boolean as PropType<AUploadProps['disabled']> },
  name: { type: String as PropType<AUploadProps['name']>, default: 'files' },
  openFileDialogOnClick: {
    type: Boolean as PropType<AUploadProps['openFileDialogOnClick']>,
    default: true,
  },
  /** 调用上传接口前执行，可自行停止上传行为 */
  beforeUpload: {
    type: Function as PropType<(files: File[], typeCode: string) => boolean | Promise<boolean>>,
  },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  buttonType: {
    type: String as PropType<AButtonProps['type']>,
    default: 'default',
  },
  buttonSize: {
    type: String as PropType<AButtonProps['size']>,
    default: 'middle',
  },
  buttonIcon: {
    type: Boolean,
    default: true,
  },
  validateTypeCode: {
    type: Boolean,
    default: true,
  },
  /** 更新状态下需要传入要被更新的文件数据 */
  updateFile: {
    type: Object as PropType<
      FileActionUploadApiResponseRecord & { cache: FileActionUploadApiResponseRecord[] | undefined }
    >,
  },
  /** apiUploadFile 已从 ...globalConfigFileProps['fileTypeSelect'] 取到 */
  beforeApiUploadFile: {
    type: Function as PropType<(apiParams: ApiUploadFileParams) => Promise<any>>,
  },
  afterApiUploadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  catchApiUploadFileError: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiUpdateFile: {
    type: Function as PropType<(apiParams: ApiUpdateFileParams) => Promise<any>>,
  },
  afterApiUpdateFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileActionUploadProps = ExtractPropTypes<typeof fileActionUploadProps>

export const fileActionUploadEmits = {
  change: (...args: ArgumentsOf<AUploadProps['onChange']>) => args instanceof Object,
  /** 上传成功前校验成功的列表 */
  validateSuccessChange: (...args: [ArgumentsOf<AUploadProps['beforeUpload']>[0][]]) =>
    args instanceof Object,
  /** 上传成功前校验失败的列表 */
  validateFailureChange: (...args: [ArgumentsOf<AUploadProps['beforeUpload']>[0][]]) =>
    args instanceof Object,
  /** 上传成功后的列表 */
  uploadedChange: (...args: [FileActionUploadApiResponseRecord[]]) => args instanceof Object,
}

export type FileActionUploadEmits = typeof fileActionUploadEmits

export interface FileActionUploadInstance {
  openFilePicker: () => Promise<void>
  cleanup(): void
}
