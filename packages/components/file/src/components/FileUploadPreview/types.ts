import { type ExtractPropTypes, type PropType } from 'vue'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { type FileUploadApiResponseRecord } from '../FileUpload'

export const fileUploadPreviewProps = {
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
  visible: { type: Boolean, default: false },
  /** 预览文件 */
  file: {
    type: Object as PropType<FileUploadApiResponseRecord>,
    default: () => ({} as FileUploadApiResponseRecord),
    required: true,
  },
  close: {
    type: Function as PropType<(...args: any[]) => any>,
  },
}

export type FileUploadPreviewProps = ExtractPropTypes<typeof fileUploadPreviewProps>

export const fileUploadPreviewEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FileUploadPreviewEmits = typeof fileUploadPreviewEmits

export interface FileUploadPreviewInstance {
  open: () => any
  close: () => any
  cleanup(): void
}
