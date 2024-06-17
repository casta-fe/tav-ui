import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, ref, unref } from 'vue'
import { addResizeListener, removeResizeListener } from '@tav-ui/utils/event'
import type { TableProInstance, TableProProps } from '../types'
import type { ComputedRef, Ref } from 'vue'
import type { Emitter } from '@tav-ui/utils/mitt'

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
      // getBoundingClientRect 会被 transform scale 影响
      // const { height: wrapperHeight } = unref(wrapperRef)!.getBoundingClientRect()
      // const { height: operationHeight } = unref(operationRef)!.getBoundingClientRect()
      const wrapperHeight = unref(wrapperRef)!.offsetHeight
      const operationHeight = unref(operationRef)!.offsetHeight
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
  setHeight: () => void,
  tableEmitter: Emitter,
  tablePropsRef: ComputedRef<TableProProps>
) {
  const reCalculate = () => {
    setHeight()
    nextTick(() => {
      unref(tableRef)?.recalculate(true)
    })
  }

  if (unref(tablePropsRef).showOperations) {
    // onMounted 确保table rendered，但filter-form中的schema有可能异步渲染所以需要监听
    onMounted(() => {
      tableEmitter.on('table-pro:filter-form-rendered', () => {
        const parentEl = unref(wrapperRef)?.parentElement
        reCalculate() // 手动调用一次，因为异步传入schema后，监听的parentEl其实没有变化，并不会触发reCalculate
        addResizeListener(parentEl, reCalculate)
      })
    })

    onActivated(() => {
      // keepalive 中需要重新布局
      reCalculate()
    })

    onBeforeUnmount(() => {
      const parentEl = unref(wrapperRef)?.parentElement
      removeResizeListener(parentEl, reCalculate)
    })
  }
}
