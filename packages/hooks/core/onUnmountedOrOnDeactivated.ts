import { onDeactivated, onUnmounted } from 'vue'

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export function onUnmountedOrOnDeactivated(hook: Fn) {
  onDeactivated(() => {
    hook()
  })

  onUnmounted(() => {
    hook()
  })
}
