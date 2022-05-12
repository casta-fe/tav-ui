import { computed, ref, toRaw, unref } from 'vue'
import { ROW_KEY } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, TableEmitType } from '../types/table'

type Recordable<T = any> = Record<string, T>

export function useTableExpand(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: TableEmitType
) {
  const expandedRowKeys = ref<string[]>([])

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  const getExpandOption = computed(() => {
    const { isTreeTable } = unref(propsRef)
    if (!isTreeTable) return {}

    return {
      expandedRowKeys: unref(expandedRowKeys),
      onExpandedRowsChange: (keys: string[]) => {
        expandedRowKeys.value = keys
        emit('expanded-rows-change', keys)
      },
    }
  })

  function expandAll() {
    const keys = getAllKeys()
    expandedRowKeys.value = keys
  }

  function expandRows(keys: string[], cover = false) {
    const { isTreeTable } = unref(propsRef)
    if (!isTreeTable) return
    if (cover) {
      expandedRowKeys.value = keys
    } else {
      expandedRowKeys.value = [...expandedRowKeys.value, ...keys]
    }
  }

  function getAllKeys(data?: Recordable[]) {
    const keys: string[] = []
    const { childrenColumnName } = unref(propsRef)
    toRaw(data || unref(tableData)).forEach((item) => {
      keys.push(item[unref(getRowKey) as string])
      const children = item[childrenColumnName || 'children']
      if (children?.length) {
        keys.push(...getAllKeys(children))
      }
    })
    return keys
  }

  function collapseAll() {
    expandedRowKeys.value = []
  }

  return { getExpandOption, expandAll, expandRows, collapseAll }
}
