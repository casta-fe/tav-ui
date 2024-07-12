import { type ComputedRef, computed, toRaw } from 'vue'
import { type FileTypeSelectProps } from '../types'

export function useOptions(_options: {
  props: ComputedRef<FileTypeSelectProps>
  apiResult: ComputedRef<Record<string, any>[]>
}) {
  const { props, apiResult } = _options

  return computed(() => {
    let result: Record<string, any>[] = []
    // if (apiResult.value && apiResult.value.length > 0) {
    //   result = [...result, ...apiResult.value]
    // }
    // if (options && options.length > 0) {
    //   result = [...result, ...options]
    // }

    // 已传入的 options 为准
    if (props.value.options && props.value.options.length > 0) {
      result = [...toRaw(props.value.options)]
    } else {
      result = [...apiResult.value]
    }

    return result
  })
}
