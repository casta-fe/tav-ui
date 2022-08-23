import { withInstall } from '@tav-ui/utils/with-install'
import Modal from './src/modal.vue'
const TaModal = withInstall(Modal)
export { useModal, useModalInner } from './src/hooks/useModal'
export { useModalContext } from './src/hooks/useModalContext'
export type {
  ModalMethods,
  ModalProps,
  ModalWrapperProps,
  ReturnInnerMethods,
  UseModalInnerReturnType,
  UseModalReturnType,
  ModalReturnMethods,
} from './src/types'
export { TaModal }
export default TaModal
