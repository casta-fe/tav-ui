import { type Slots, computed } from 'vue'

export function useSlotKeys(slots: Slots, prefix: string) {
  const getSlotKeys = computed(() => {
    const keys = Object.keys(slots)
    return keys
      .map((item) => (item.startsWith(prefix) ? item : null))
      .filter((item) => !!item) as string[]
  })

  function replaceSlotKey(key: string) {
    if (!key) return ''
    // eslint-disable-next-line no-useless-escape
    return key?.replace?.(new RegExp(prefix), '') ?? ''
  }

  return {
    getSlotKeys,
    replaceSlotKey,
  }
}
