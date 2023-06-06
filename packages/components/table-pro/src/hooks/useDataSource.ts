import { onMounted, unref } from 'vue'
import { isBoolean, isFunction } from '@tav-ui/utils/is'
import { useTimeoutFn } from '@tav-ui/hooks/core/useTimeout'
import { PAGE_SIZE } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProInstance, TableProProps } from '../types'

export function useDataSource(
  // tablePropsRef: ComputedRef<TableProProps>,
  api: TableProProps['api'],
  immediate: TableProProps['immediate'],
  pagerConfig: TableProProps['pagerConfig'],
  tableRef: Ref<TableProInstance | null>
) {
  // const { api, immediate, pagerConfig } = unref(tablePropsRef)
  const hasApi = api && isFunction(api)
  if (!hasApi) return

  const params = {
    filter: {},
    model: {},
  }

  if (isBoolean(pagerConfig.enabled) && !pagerConfig.enabled) {
    Reflect.deleteProperty(params.model, 'page')
    Reflect.deleteProperty(params.model, 'limit')
  } else {
    params.model['page'] = 1
    params.model['limit'] = PAGE_SIZE
  }

  onMounted(() => {
    immediate &&
      useTimeoutFn(() => {
        unref(tableRef.value)?.commitProxy('query', { ...params })
      }, 16)
  })
}
