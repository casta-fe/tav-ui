import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_IGNORE_TYPES, DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiViewFileParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  type FileViewApiParams,
  globalConfigFileProps,
} from '../../typings'

export const fileViewProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['fileView'],
  apiParams: {
    type: Object as PropType<FileViewApiParams>,
    default: () => DEFAULT_FILE_API_PARAMS,
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
  /** 预览文件 */
  file: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    default: () => ({} as FileActionUploadApiResponseRecord),
    required: true,
    validator(value: FileActionUploadApiResponseRecord) {
      return !DEFAULT_FILE_IGNORE_TYPES.includes(value.suffix)
    },
  },
  /** apiViewFile 已从 ...globalConfigFileProps['fileVersion'] 取到 */
  beforeApiViewFile: {
    type: Function as PropType<(apiParams: Partial<ApiViewFileParams>) => Promise<any>>,
  },
  afterApiViewFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileViewProps = ExtractPropTypes<typeof fileViewProps>

export const fileViewEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FileViewEmits = typeof fileViewEmits

export interface FileViewInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
