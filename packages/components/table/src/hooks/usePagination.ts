import { computed, ref, unref, watch } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isBoolean } from '@tav-ui/utils/is'
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const'
import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps } from '../types/table'

interface ItemRender {
  page: number
  type: 'page' | 'prev' | 'next'
  originalElement: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function itemRender({ page, type, originalElement }: ItemRender) {
  if (type === 'prev') {
    return tavI18n('Tav.tablePro.page.1')
  } else if (type === 'next') {
    return tavI18n('Tav.tablePro.page.2')
  }
  return originalElement
}

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({})
  const show = ref(true)

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {}),
        }
      }
    }
  )

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps)

    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false
    }

    return {
      current: 1,
      pageSize: PAGE_SIZE,
      size: 'small',
      defaultPageSize: PAGE_SIZE,
      showTotal: (total) => '共 {total} 条数据'.replace('{total}', `${total}`),
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      itemRender,
      // showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    }
  }

  function getPagination() {
    return unref(getPaginationInfo)
  }

  function getShowPagination() {
    return unref(show)
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag
  }

  return { getPagination, getPaginationInfo, setShowPagination, getShowPagination, setPagination }
}
