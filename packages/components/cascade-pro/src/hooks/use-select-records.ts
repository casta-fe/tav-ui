import { computed, ref, unref } from 'vue'
import type { CascadeProOption, IUseSelectRecordsReturn } from '../types'

/**
 * 设置当前选中的所有数据
 *
 * @returns
 */
export function useSelectRecords(): IUseSelectRecordsReturn {
  const selectRecordsRef = ref<CascadeProOption[]>([])

  const selectRecords = computed(() => unref(selectRecordsRef))

  function setSelectRecords(selectRecords: CascadeProOption[], type: 'normal' | 'recover') {
    if (type === 'normal') {
      const prevSelectRecords = unref(selectRecordsRef)
      const currentSelectRecords = selectRecords.reduce((result, cur) => {
        const isHaveSameOption = result.find((option) => option.idPath === cur.idPath)
        !isHaveSameOption && result.push(cur)
        return result
      }, prevSelectRecords)
      selectRecordsRef.value = currentSelectRecords
    }

    if (type === 'recover') {
      selectRecordsRef.value = selectRecords
    }
  }

  return { selectRecords, setSelectRecords }
}
