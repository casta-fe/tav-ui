import { h } from 'vue'
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import { message as Message, Modal, notification } from 'ant-design-vue'
import { isString } from '@tav-ui/utils/is'
import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal'
import type { ConfigProps, NotificationArgsProps } from 'ant-design-vue/lib/notification'

export interface NotifyApi {
  info(config: NotificationArgsProps): void
  success(config: NotificationArgsProps): void
  error(config: NotificationArgsProps): void
  warn(config: NotificationArgsProps): void
  warning(config: NotificationArgsProps): void
  open(args: NotificationArgsProps): void
  close(key: string): void
  config(options: ConfigProps): void
  destroy(): void
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
export declare type IconType = 'success' | 'info' | 'error' | 'warning'
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType?: 'warning' | 'success' | 'error' | 'info'
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>

interface ConfirmOptions {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warn: ModalFunc
  warning: ModalFunc
}

function getIcon(iconType: string) {
  if (iconType === 'warning') return h(InfoCircleFilled, { class: ['modal-icon-warning'] })
  else if (iconType === 'success') return h(CheckCircleFilled, { class: ['modal-icon-success'] })
  else if (iconType === 'info') return h(InfoCircleFilled, { class: ['modal-icon-info'] })
  else return h(CloseCircleFilled, { class: ['modal-icon-error'] })
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>): any {
  if (isString(content)) return h('div', {}, `${content as string}`)
  else return content
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning'
  Reflect.deleteProperty(options, 'iconType')
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  }
  return Modal.confirm(opt) as unknown as ConfirmOptions
}

const getBaseOptions = () => {
  return {
    okText: '确定',
    centered: true,
  }
}

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  }
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'))
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'))
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'))
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'))
}

notification.config({
  placement: 'topRight',
  duration: 3,
})

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: Message,
    notification: notification as NotifyApi,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  }
}
