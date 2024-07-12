import { type ComponentInternalInstance } from 'vue'
import { FileContextKey } from './use-context'

/**
 * 根据 contextkey 判断是否为子组件
 * @param instance
 * @param key
 * @returns
 */
export function isChildComponent(
  instance: ComponentInternalInstance | null,
  key: symbol = FileContextKey
) {
  let provided = false
  let parent = instance?.parent
  while (parent) {
    if ((parent as any).provides && (parent as any).provides[key]) {
      provided = true
      break
    }
    parent = parent.parent
  }
  return provided
}
