import { type Ref, computed, ref, unref, watch } from 'vue'

export function useDisable(_disable?: Ref<boolean>) {
  const disableRef = ref<boolean>(false)

  _disable &&
    watch(
      () => unref(_disable),
      (disable, prevDisable) => {
        if (disable !== prevDisable) {
          disableRef.value = disable
        }
      }
    )

  const disable = computed(() => unref(disableRef))

  function setDisable(disable: boolean) {
    disableRef.value = disable
  }

  return { disable, setDisable }
}

export type UseDisableReturn = ReturnType<typeof useDisable>
