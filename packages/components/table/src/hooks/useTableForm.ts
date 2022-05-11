import { computed, unref } from 'vue'
import { isFunction } from '@tav-ui/utils/is'
import type { FormProps } from '@tav-ui/components/form/src/types/form'
import type { ComputedRef, Slots } from 'vue'
import type { BasicTableProps, FetchParams } from '../types/table'

type Recordable<T = any> = Record<string, T>

export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams | undefined) => Promise<Recordable<any>[] | undefined>,
  getLoading: ComputedRef<boolean | undefined>
) {
  const getFormProps = computed((): Partial<FormProps> => {
    const { formConfig } = unref(propsRef)
    const { submitButtonOptions } = formConfig || {}
    return {
      showAdvancedButton: true,
      ...formConfig,
      submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
      compact: true,
    }
  })

  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots)
    return keys
      .map((item) => (item.startsWith('form-') ? item : null))
      .filter((item) => !!item) as string[]
  })

  function replaceFormSlotKey(key: string) {
    if (!key) return ''
    // eslint-disable-next-line no-useless-escape
    return key?.replace?.(/form\-/, '') ?? ''
  }

  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef)
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      info = handleSearchInfoFn(info) || info
    }
    fetch({ searchInfo: info, page: 1 })
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
    handleSearchInfoChange,
  }
}
