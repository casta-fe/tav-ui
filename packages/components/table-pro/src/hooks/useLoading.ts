import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { TableProProps } from '../types'

export function useLoading(tablePropsRef: ComputedRef<TableProProps>) {
  const loadingRef = ref(unref(tablePropsRef).loading)

  watch(
    () => unref(tablePropsRef).loading,
    (loading) => {
      loadingRef.value = loading
    }
  )

  const loading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  return { loading, setLoading }
}
