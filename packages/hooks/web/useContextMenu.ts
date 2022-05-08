import { getCurrentInstance, onUnmounted } from 'vue'
import { createContextMenu, destroyContextMenu } from '@tav-ui/components/context-menu/src/context-menu-method'
interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
export interface ContextMenuItem {
  label: string
  icon?: string
  disabled?: boolean
  handler?: Fn
  divider?: boolean
  children?: ContextMenuItem[]
}
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}
