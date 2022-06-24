import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref } from 'vue'
import { addResizeListener, removeResizeListener } from '@tav-ui/utils/event'
import type { TableProInstance } from '../types'
import type { ComputedRef, Ref } from 'vue'

/**
 * 手动计算表格内容区域高度
 * 表格高度，height设置百分比会跳动，设置auto后需要手动把剩余空间的高度计算后赋值
 * @returns
 */
export function useHeight(): {
  wrapperRef: any
  operationRef: any
  getHeight: ComputedRef<string>
  setHeight: () => void
} {
  const wrapperRef = ref<HTMLElement | null>(null)
  const operationRef = ref<HTMLElement | null>(null)
  const height = ref('100%')

  const getHeight = computed(() => unref(height))

  const setHeight = () => {
    if (unref(wrapperRef) && unref(operationRef)) {
      const { height: wrapperHeight } = unref(wrapperRef)!.getBoundingClientRect()
      const { height: operationHeight } = unref(operationRef)!.getBoundingClientRect()
      height.value = `${wrapperHeight - operationHeight}px`
    }
  }

  return {
    wrapperRef,
    operationRef,
    getHeight,
    setHeight,
  }
}

export function useFixHeight(
  tableRef: Ref<TableProInstance | null>,
  wrapperRef: Ref<HTMLElement | null>,
  setHeight: () => void
) {
  const reCalculate = () => {
    setHeight()
    nextTick(() => {
      unref(tableRef)?.recalculate(true)
    })
  }

  onMounted(() => {
    const parentEl = unref(wrapperRef)?.parentElement
    addResizeListener(parentEl, reCalculate)
  })

  onBeforeUnmount(() => {
    const parentEl = unref(wrapperRef)?.parentElement
    removeResizeListener(parentEl, reCalculate)
  })
}
