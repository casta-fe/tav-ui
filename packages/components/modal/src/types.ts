import type { CSSProperties, ComputedRef, PropType, VNodeChild } from 'vue'
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
export type VueNode = VNodeChild | JSX.Element
export const modalProps = {
  visible: { type: Boolean },
  scrollTop: { type: Boolean, default: true },
  height: { type: Number },
  minHeight: { type: Number },
  // open drag
  draggable: { type: Boolean, default: false },
  centered: { type: Boolean },
  cancelText: { type: String, default: '取消' },
  okText: { type: String, default: '确认' },

  closeFunc: Function as PropType<() => Promise<boolean>>,
}
// export type ModalProps = ExtractPropTypes<typeof modalProps>
export const basicProps = Object.assign({}, modalProps, {
  defaultFullscreen: { type: Boolean },
  // Can it be full screen
  canFullscreen: { type: Boolean, default: false },
  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: { type: Number, default: 0 },
  // Warm reminder message
  helpMessage: [String, Array] as PropType<string | string[]>,
  // Whether to setting wrapper
  useWrapper: { type: Boolean, default: true },
  loading: { type: Boolean },
  loadingTip: { type: String },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },

  wrapperProps: Object as PropType<Partial<ModalWrapperProps>>,

  afterClose: Function as PropType<() => Promise<VueNode>>,

  bodyStyle: Object as PropType<CSSProperties>,
  style: Object as PropType<CSSProperties>,

  closable: { type: Boolean, default: true },

  closeIcon: Object as PropType<VueNode>,

  confirmLoading: { type: Boolean },

  destroyOnClose: { type: Boolean },

  footer: Object as PropType<VueNode>,

  getContainer: Function as PropType<() => any>,

  mask: { type: Boolean, default: true },

  maskClosable: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },

  maskStyle: Object as PropType<CSSProperties>,

  okType: { type: String, default: 'primary' },

  okButtonProps: Object as PropType<ButtonProps>,

  cancelButtonProps: Object as PropType<ButtonProps>,

  title: { type: String },

  visible: { type: Boolean },

  width: [String, Number] as PropType<string | number>,

  wrapClassName: { type: String },

  zIndex: { type: Number },
})
/**
 * @description: 弹窗对外暴露的方法
 */
export interface ModalMethods {
  setModalProps: (props: Partial<ModalProps>) => void
  emitVisible?: (visible: boolean, uid: number) => void
  redoModalHeight?: () => void
}

type RegisterFn = (modalMethods: ModalMethods, uuid?: string) => void

export interface ModalReturnMethods extends ModalMethods {
  openModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void
  closeModal: () => void
  getVisible?: ComputedRef<boolean>
}

export type UseModalReturnType = [RegisterFn, ModalReturnMethods]

export interface ReturnInnerMethods extends ModalMethods {
  closeModal: () => void
  changeLoading: (loading: boolean) => void
  changeOkLoading: (loading: boolean) => void
  getVisible?: ComputedRef<boolean>
  redoModalHeight: () => void
}

export type UseModalInnerReturnType = [RegisterFn, ReturnInnerMethods]

export interface ModalProps {
  minHeight?: number
  height?: number
  // 启用wrapper后 底部可以适当增加高度
  wrapperFooterOffset?: number
  draggable?: boolean
  scrollTop?: boolean

  // 是否可以进行全屏
  canFullscreen?: boolean
  defaultFullscreen?: boolean
  visible?: boolean
  // 温馨提醒信息
  helpMessage: string | string[]

  // 是否使用modalWrapper
  useWrapper: boolean

  loading: boolean
  loadingTip?: string

  wrapperProps: Omit<ModalWrapperProps, 'loading'>

  showOkBtn: boolean
  showCancelBtn: boolean
  closeFunc: () => Promise<any>

  /**
   * Specify a function that will be called when modal is closed completely.
   * @type Function
   */
  afterClose?: () => any

  /**
   * Body style for modal body element. Such as height, padding etc.
   * @default {}
   * @type object
   */
  bodyStyle?: CSSProperties
  style?: CSSProperties

  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText?: string

  /**
   * Centered Modal
   * @default false
   * @type boolean
   */
  centered?: boolean

  /**
   * Whether a close (x) button is visible on top right of the modal dialog or not
   * @default true
   * @type boolean
   */
  closable?: boolean
  /**
   * Whether a close (x) button is visible on top right of the modal dialog or not
   */
  closeIcon?: VNodeChild | JSX.Element

  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading?: boolean

  /**
   * Whether to unmount child components on onClose
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean

  /**
   * Footer content, set as :footer="null" when you don't need default buttons
   * @default OK and Cancel buttons
   * @type any (string | slot)
   */
  footer?: VNodeChild | JSX.Element

  /**
   * Return the mount node for Modal
   * @default () => document.body
   * @type Function
   */
  getContainer?: (instance: any) => HTMLElement

  /**
   * Whether show mask or not.
   * @default true
   * @type boolean
   */
  mask?: boolean

  /**
   * Whether to close the modal dialog when the mask (area outside the modal) is clicked
   * @default true
   * @type boolean
   */
  maskClosable?: boolean

  /**
   * Style for modal's mask element.
   * @default {}
   * @type object
   */
  maskStyle?: CSSProperties

  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText?: string

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType?: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default'

  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps?: ButtonProps

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps?: ButtonProps

  /**
   * The modal dialog's title
   * @type any (string | slot)
   */
  title?: VNodeChild | JSX.Element

  /**
   * Width of the modal dialog
   * @default 520
   * @type string | number
   */
  width?: string | number

  /**
   * The class name of the container of the modal dialog
   * @type string
   */
  wrapClassName?: string

  /**
   * The z-index of the Modal
   * @default 1000
   * @type number
   */
  zIndex?: number
}

export interface ModalWrapperProps {
  footerOffset?: number
  loading: boolean
  modalHeaderHeight: number
  modalFooterHeight: number
  minHeight: number
  height: number
  visible: boolean
  fullScreen: boolean
  useWrapper: boolean
}
export type Recordable<T = any> = Record<string, T>
export type Record<K extends keyof any, T> = {
  [P in K]: T;
}
export interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

export type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null
export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
export type Nullable<T> = T | null
export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
