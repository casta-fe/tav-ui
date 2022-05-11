import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'

export function useMasking(props: ComputedRef<BasicTableProps>) {
  const maskingRef = ref(unref(props).masking)

  watch(
    () => unref(props).masking,
    (masking) => {
      maskingRef.value = masking
    }
  )

  const getMasking = computed(() => unref(maskingRef))

  function setMasking(masking: boolean) {
    maskingRef.value = masking
  }

  return { getMasking, setMasking }
}
