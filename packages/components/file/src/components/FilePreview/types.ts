import { type ExtractPropTypes, type PropType } from 'vue'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_FILE_IGNORE_TYPES, DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'

export interface TaFilePreviewPropFile {
  id: FileActionUploadApiResponseRecord['id']
  name: FileActionUploadApiResponseRecord['name']
  suffix: FileActionUploadApiResponseRecord['suffix']
  fileSize: FileActionUploadApiResponseRecord['fileSize']
  createByName: FileActionUploadApiResponseRecord['createByName']
  createTime: FileActionUploadApiResponseRecord['createTime']
  [key: string]: any
}

// 按照 swagger 编写
export interface ApiPreviewFileParams {
  id: ApiParams['id']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FilePreviewApiParams extends ApiPreviewFileParams {}

export const filePreviewProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFilePreview'],
  apiParams: {
    type: Object as PropType<FilePreviewApiParams>,
    default: () => ({}),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // modal props
  width: {
    type: [String, Number] as PropType<ModalProps['width']>,
    default: '100%',
  },
  wrapClassName: {
    type: String as PropType<ModalProps['wrapClassName']>,
  },
  destroyOnClose: {
    type: Boolean as PropType<ModalProps['destroyOnClose']>,
    default: true,
  },
  maskClosable: {
    type: Boolean as PropType<ModalProps['destroyOnClose']>,
    default: false,
  },
  getPopupContainer: {
    type: Function as PropType<ModalProps['getContainer']>,
    default: () => document.body,
  },
  //:============================== extend props ==============================://
  visible: { type: Boolean, default: false },
  /**
   * 自动请求，包含功能：
   * 1. 初始化是否自动请求（如果有 api 的话）
   * 2. api依赖参数变化后是否自动请求（如果有 api 以及 api 参数）
   * 3. 如果组件有除 api 外的其他数据源，关闭该属性后才能使用其他数据源
   */
  immediate: { type: Boolean, default: true },
  /** 预览文件 */
  file: {
    type: Object as PropType<TaFilePreviewPropFile>,
    default: () => ({} as TaFilePreviewPropFile),
    required: true,
    validator(value: TaFilePreviewPropFile) {
      return !DEFAULT_FILE_IGNORE_TYPES.includes(value.suffix)
    },
  },
  /** apiPreviewFile 已从 ...globalConfigFileProps['filePreview'] 取到 */
  beforeApiPreviewFile: {
    type: Function as PropType<(apiParams: ApiPreviewFileParams) => Promise<any>>,
  },
  afterApiPreviewFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FilePreviewProps = ExtractPropTypes<typeof filePreviewProps>

export const filePreviewEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FilePreviewEmits = typeof filePreviewEmits

export interface FilePreviewInstance {
  open: () => any
  close: () => any
  cleanup(): void
}
