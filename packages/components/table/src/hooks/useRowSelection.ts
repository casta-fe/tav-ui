import { computed, nextTick, ref, toRaw, unref, watch } from 'vue'
import { omit } from 'lodash-es'
import { isFunction } from '@tav-ui/utils/is'
import { findNodeAll } from '@tav-ui/utils/helper/treeHelper'
import { ROW_KEY } from '../const'
import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, EmitType, TableRowSelection } from '../types/table'

type Recordable<T = any> = Record<string, T>

export function useRowSelection(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType
) {
  const selectedRowKeysRef = ref<string[]>([])
  const selectedRowRef = ref<Recordable[]>([])
  const changing = ref(false)
  const tempSelectedRowKeysRef = ref<string[]>([])

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const { rowSelection } = unref(propsRef)
    if (!rowSelection) {
      return null
    }
    return {
      ...(changing.value ? { selectedRowKeys: unref(tempSelectedRowKeysRef) } : {}),
      // selectedRowKeys: unref(selectedRowKeysRef),
      hideDefaultSelections: false,
      onChange: (selectedRowKeys: string[]) => {
        setSelectedRowKeys(selectedRowKeys, false)
        // selectedRowKeysRef.value = selectedRowKeys;
        // selectedRowRef.value = selectedRows;
      },
      ...omit([rowSelection, 'onChange']),
    }
  })

  watch(
    () => unref(propsRef).rowSelection?.selectedRowKeys,
    (v: any) => {
      v && setSelectedRowKeys(v)
    }
  )

  watch(
    () => unref(selectedRowKeysRef),
    () => {
      nextTick(() => {
        const { rowSelection } = unref(propsRef)
        if (rowSelection) {
          const { onChange } = rowSelection
          if (onChange && isFunction(onChange)) onChange(getSelectRowKeys(), getSelectRows())
        }
        emit('selection-change', {
          keys: getSelectRowKeys(),
          rows: getSelectRows(),
        })
      })
    },
    { deep: true }
  )

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  /**
   * 设置dom
   * @param keys 选择项的key
   */
  function setTempSelectedRowKeysRef(keys: string[]) {
    tempSelectedRowKeysRef.value = keys
    changing.value = true
    nextTick(() => {
      changing.value = false
    })
  }

  function setSelectedRowKeys(_rowKeys: string[] | number[], syncDom = true) {
    const rowKeys = _rowKeys.map((rk: string | number) => `${rk}`)
    selectedRowKeysRef.value = rowKeys
    const allSelectedRows = findNodeAll(
      toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef))),
      (item) => rowKeys.includes(item[unref(getRowKey) as string]),
      {
        children: propsRef.value.childrenColumnName ?? 'children',
      }
    )
    const trueSelectedRows: any[] = []
    rowKeys.forEach((key: string) => {
      const found = allSelectedRows.find((item) => item[unref(getRowKey) as string] === key)
      found && trueSelectedRows.push(found)
    })
    selectedRowRef.value = trueSelectedRows
    syncDom && setTempSelectedRowKeysRef(rowKeys)
  }

  function setSelectedRows(rows: Recordable[]) {
    selectedRowRef.value = rows
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = []
    selectedRowKeysRef.value = []
    setTempSelectedRowKeysRef([])
  }

  function deleteSelectRowByKey(key: string) {
    const selectedRowKeys = unref(selectedRowKeysRef)
    const index = selectedRowKeys.findIndex((item) => item === key)
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1)
    }
  }

  function getSelectRowKeys() {
    return unref(selectedRowKeysRef)
  }

  function getSelectRows<T = Recordable>() {
    // const ret = toRaw(unref(selectedRowRef)).map((item) => toRaw(item));
    return unref(selectedRowRef) as T[]
  }

  function getRowSelection() {
    return unref(getRowSelectionRef)!
  }

  return {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
    setSelectedRows,
  }
}
