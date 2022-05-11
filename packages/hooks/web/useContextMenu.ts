import { getCurrentInstance, onUnmounted } from 'vue'
import {
  createContextMenu,
  destroyContextMenu,
} from '@tav-ui/components/context-menu/src/context-menu-method'

export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}
