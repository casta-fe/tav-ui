import { nextTick, onDeactivated, onUnmounted } from 'vue'

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export function onMountedOrOnDeactivated(hook: Fn) {
  let mounted: boolean

  onUnmounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onDeactivated(() => {
    if (mounted) {
      hook()
    }
  })
}
