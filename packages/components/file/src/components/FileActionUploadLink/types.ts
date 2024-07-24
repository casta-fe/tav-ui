import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_MODE } from '../../consts'
import {
  type FileActionUploadLinkApiParams,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'

export const fileActionUploadLinkProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['fileActionUploadLink'],
  apiParams: {
    type: Object as PropType<FileActionUploadLinkApiParams>,
    default: () => ({ ...DEFAULT_FILE_API_PARAMS }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },

  icon: { type: String, default: 'ant-design:upload-outlined' },
  //:============================== extend props ==============================://
  // 点开后是弹窗不需要控制显示隐藏，有无由业务数据控制提取到 filetable type 中
  visible: { type: Boolean, default: true },
}

export type FileActionUploadLinkProps = ExtractPropTypes<typeof fileActionUploadLinkProps>

export const fileActionUploadLinkEmits = {
  click: (...args: any[]) => args instanceof Object,
}

export type FileActionUploadLinkEmits = typeof fileActionUploadLinkEmits

export interface FileActionUploadLinkInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
