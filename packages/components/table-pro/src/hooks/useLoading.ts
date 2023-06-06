import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { TableProProps } from '../types'

export function useLoading(
  // tablePropsRef: ComputedRef<TableProProps>
  loading: TableProProps['loading']
) {
  // const loadingRef = ref(unref(tablePropsRef).loading)
  const loadingRef = ref(loading)

  watch(
    // () => unref(tablePropsRef).loading,
    () => loading,
    (_loading) => {
      loadingRef.value = _loading
    }
  )

  const _loading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  return { loading: _loading, setLoading }
}
