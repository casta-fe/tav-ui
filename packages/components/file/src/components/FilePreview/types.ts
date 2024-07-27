import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_FILE_IGNORE_TYPES, DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'

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
  /** 是否自动请求 */
  immediate: { type: Boolean, default: true },
  /** 预览文件 */
  file: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    default: () => ({} as FileActionUploadApiResponseRecord),
    required: true,
    validator(value: FileActionUploadApiResponseRecord) {
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
  elRef: Ref<HTMLDivElement | undefined>
  open: () => any
  close: () => any
}
