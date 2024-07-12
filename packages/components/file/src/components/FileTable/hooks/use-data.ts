import { type ComputedRef, computed, toRaw } from 'vue'
import { type FileTableProps } from '../types'

export function useData(_options: {
  props: ComputedRef<FileTableProps>
  apiResult: ComputedRef<Exclude<FileTableProps['dataSource'], undefined>>
}) {
  const { props, apiResult } = _options

  return computed(() => {
    let result: Record<string, any>[] = []

    // 已传入的 dataSource 为准
    if (props.value.dataSource && props.value.dataSource.length > 0) {
      result = [...toRaw(props.value.dataSource)]
    } else {
      result = [...apiResult.value]
    }

    return result
  })
}
