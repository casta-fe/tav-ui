import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue'
import type { Ref, ShallowRef } from 'vue'

interface Params {
  excludeListeners?: boolean
  excludeKeys?: string[]
  excludeDefaultKeys?: boolean
}

declare type Recordable<T = any> = Record<string, T>

const DEFAULT_EXCLUDE_KEYS = ['class', 'style']
const LISTENER_PREFIX = /^on[A-Z]/

export function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]])
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useAttrs(params: Params = {}): Ref<Recordable> | {} {
  const instance = getCurrentInstance()
  if (!instance) return {}

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = params
  const attrs = shallowRef({})
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : [])

  // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
  instance.attrs = reactive(instance.attrs)

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key)))
        acm[key] = val

      return acm
    }, {} as Recordable)

    attrs.value = res
  })

  return attrs
}
