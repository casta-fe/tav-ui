import { computed, ref, toRaw, unref, watch } from 'vue'
import { ROW_KEY } from '../const'
import type { TableProInstance, TableProProps } from '../types'
import type { ComputedRef, Ref } from 'vue'

export function useCheckboxCache(
  tableRef: Ref<TableProInstance | null>,
  tablePropsRef: ComputedRef<TableProProps>,
  currentPage: Ref<number>
) {
  const {
    rowConfig: { keyField = ROW_KEY },
  } = unref(tablePropsRef)

  /** key：页码，value：rows */
  const checkboxCaches = ref<Record<string, Record<string, any>[]>>({})
  const isCheckboxCacheEnabled = computed(
    () =>
      tablePropsRef.value.checkboxConfig &&
      tablePropsRef.value.checkboxConfig.enabled &&
      tablePropsRef.value.checkboxConfig.cache
  )
  const checkboxCacheList = computed(() => {
    if (!isCheckboxCacheEnabled.value) return []

    let caches: Record<string, any>[] = []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, k] of Object.entries(unref(checkboxCaches))) {
      caches = [...caches, ...k]
    }
    return caches
  })

  /** 页码变化 */
  watch(
    () => currentPage.value,
    async () => {
      await applyCheckboxCacheByCurrentPage()
    }
  )

  /**
   * checkbox 点击时调用，将行数据维护在 checkboxCaches 中
   * 当前交互发生在固定的页码下
   * @param row
   * @returns
   */
  async function createCheckboxCache(row: Record<string, any>) {
    if (!isCheckboxCacheEnabled.value) return
    const cache = !!checkboxCacheList.value.find(
      (cache) => `${cache[keyField]}` === `${row[keyField]}`
    )
    if (!cache) {
      unref(checkboxCaches)[currentPage.value] = [
        ...(unref(checkboxCaches)[currentPage.value] ?? []),
        { ...toRaw(row), __page: currentPage.value }, // __page 方便后续弹窗内点击删除按钮迅速获取当前页码
      ]

      await unref(tableRef)?.toggleCheckboxRow(row) // 只切换当前页的选中
    }
  }

  /**
   * checkboxall 点击时调用，将行数据维护在 checkboxCaches 中
   * 当前交互发生在固定的页码下
   * @param rows
   * @returns
   */
  async function createAllCheckboxCache(rows: Record<string, any>[]) {
    if (!isCheckboxCacheEnabled.value) return

    unref(checkboxCaches)[currentPage.value] = [
      ...toRaw(rows).map((row) => {
        return { ...toRaw(row), __page: currentPage.value }
      }), // __page 方便后续弹窗内点击删除按钮迅速获取当前页码
    ]

    await unref(tableRef)?.toggleAllCheckboxRow() // 只切换当前页的选中
  }

  /**
   * checkbox 反选点击时或弹窗指定行删除按钮点击时调用
   * @param row
   * @returns
   */
  async function deleteCheckboxCache(row: Record<string, any>) {
    if (!isCheckboxCacheEnabled.value) return

    const page = row.__page ?? currentPage.value
    const cache = !!checkboxCacheList.value.find(
      (cache) => `${cache[keyField]}` === `${row[keyField]}`
    )
    if (cache) {
      unref(checkboxCaches)[page] = unref(checkboxCaches)[page].filter(
        (cache) => `${cache[keyField]}` !== `${row[keyField]}`
      )

      await unref(tableRef)?.toggleCheckboxRow(row) // 只切换当前页的选中
    }
  }

  /**
   * checkboxall 反选点击时或弹窗清除按钮点击时调用
   * @returns
   */
  async function deleteAllCheckboxCache(options: { deleteByPage: boolean }) {
    if (!isCheckboxCacheEnabled.value) return

    const { deleteByPage } = options

    if (deleteByPage) {
      checkboxCaches.value[currentPage.value] = []
    } else {
      checkboxCaches.value = {}
    }

    await unref(tableRef)?.clearCheckboxRow() // 只清除当前页的选中
  }

  /**
   * 页码变化代表翻页完成，手动将翻页后选中数据状态回复
   * @returns
   */
  async function applyCheckboxCacheByCurrentPage() {
    if (!isCheckboxCacheEnabled.value) return

    if (unref(checkboxCaches)[currentPage.value]) {
      await unref(tableRef)?.clearCheckboxRow()
      const promises = unref(checkboxCaches)[currentPage.value].map(
        // eslint-disable-next-line no-return-await
        async (row) => await unref(tableRef)?.setCheckboxRow(row, true)
      )
      await Promise.all(promises)
    }
  }

  return {
    checkboxCaches,
    isCheckboxCacheEnabled,
    checkboxCacheList,
    createCheckboxCache,
    createAllCheckboxCache,
    deleteCheckboxCache,
    deleteAllCheckboxCache,
    applyCheckboxCacheByCurrentPage,
  }
}

export type UseCheckboxCacheReturn = ReturnType<typeof useCheckboxCache>
