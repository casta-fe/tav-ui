import { type ExtractPropTypes, type PropType } from 'vue'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { globalConfigEditorProps } from '../../typings'

export const editorCustomUploadfileModalProps = {
  ...globalConfigEditorProps,
  disabled: { type: Boolean, default: false },
  visible: { type: Boolean, default: false },
  // modal props
  width: {
    type: [String, Number] as PropType<ModalProps['width']>,
    default: 1000,
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
}

export type EditorCustomUploadfileModalProps = ExtractPropTypes<
  typeof editorCustomUploadfileModalProps
>

export const editorCustomUploadfileModalEmits = {
  open: () => true,
  close: (...args: any[]) => typeof args,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type EditorCustomUploadfileModalEmits = typeof editorCustomUploadfileModalEmits

export interface EditorCustomUploadfileModalInstance {
  open: () => any
  close: (...args: any[]) => typeof args
  getUploadfileModalValue: () => Promise<Record<string, any>>
  cleanup(): void
}
