import { onMounted, unref } from 'vue'
import { isBoolean, isFunction } from '@tav-ui/utils/is'
import { PAGE_SIZE } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { TableProInstance, TableProProps } from '../types'
import type { TableProApiParams } from '../typings'

export function useDataSource(
  tablePropsRef: ComputedRef<TableProProps>,
  tableRef: Ref<TableProInstance | null>
) {
  const { api, immediate, pagerConfig } = unref(tablePropsRef)
  const hasApi = api && isFunction(api)
  if (!hasApi) return

  const params: TableProApiParams = {
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
      setTimeout(() => {
        unref(tableRef.value)?.commitProxy('query', { ...params })
      }, 16)
  })
}
