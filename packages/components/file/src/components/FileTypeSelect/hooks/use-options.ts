import { type ComputedRef, computed } from 'vue'
import { type FileTypeSelectProps } from '../types'

export function useOptions(_options: {
  apiResult: ComputedRef<Record<string, any>[]>
  options: ComputedRef<FileTypeSelectProps['options']>
}) {
  const { apiResult, options } = _options

  return computed(() => {
    let result: Record<string, any>[] = []

    if (apiResult.value && apiResult.value.length > 0) {
      result = [...result, ...apiResult.value]
    }

    if (options.value && options.value.length > 0) {
      result = [...result, ...options.value]
    }

    return result
  })
}
