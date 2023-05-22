import { computed, ref, unref, watch } from 'vue'
import type { Ref } from 'vue'
import type { IUseLoadingReturn } from '../types'

export function useLoading(_loading?: Ref<boolean>): IUseLoadingReturn {
  const loadingRef = ref<boolean>(false)

  _loading &&
    watch(
      () => unref(_loading),
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
