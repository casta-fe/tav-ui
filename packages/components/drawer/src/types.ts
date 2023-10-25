import { tavI18n } from '@tav-ui/locales'
import type { ExtractPropTypes, PropType } from 'vue'

type Recordable<T = any> = Record<string, T>

export const footerProps = {
  confirmLoading: { type: Boolean },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: { type: String, default: tavI18n('Tav.common.cancelText') },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },
  okButtonProps: Object as PropType<Recordable>,
  okText: { type: String, default: tavI18n('Tav.common.okText') },
  okType: { type: String, default: 'primary' },
  showFooter: { type: Boolean },
  footerHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
}

export const drawerProps = {
  isDetail: { type: Boolean },
  title: { type: String, default: '' },
  loadingText: { type: String },
  showDetailBack: { type: Boolean, default: true },
  visible: { type: Boolean },
  loading: { type: Boolean },
  maskClosable: { type: Boolean, default: true },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  destroyOnClose: { type: Boolean },
  ...footerProps,
}

export type DrawerProps = ExtractPropTypes<typeof drawerProps>
