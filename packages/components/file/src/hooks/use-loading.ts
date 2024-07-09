import { computed, ref, unref, watch } from 'vue'
import type { Ref } from 'vue'

export function useLoading(_loading?: Ref<boolean>) {
  const loadingRef = ref<boolean>(false)

  _loading &&
    watch(
      () => unref(_loading),
      (loading, pervLoading) => {
        if (loading !== pervLoading) {
          loadingRef.value = loading
        }
      }
    )

  const loading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  return { loading, setLoading }
}

export type UseLoadingReturn = ReturnType<typeof useLoading>
