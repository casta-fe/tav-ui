<template>
  <ScrollContainer ref="wrapperRef">
    <div ref="spinRef" v-loading="loading" :style="spinStyle" :loading-tip="loadingTip">
      <slot />
    </div>
  </ScrollContainer>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { useWindowSizeFn } from '@tav-ui/hooks/event/useWindowSizeFn'
import loadingDirective from '@tav-ui/directives/src/loading'
import ScrollContainer from '@tav-ui/components/container-scroll'
import { createModalContext } from '../hooks/useModalContext'
import type { ComponentRef, ElRef } from '../types'
import type { CSSProperties } from 'vue'
const props = {
  loading: { type: Boolean },
  useWrapper: { type: Boolean, default: true },
  modalHeaderHeight: { type: Number, default: 57 },
  modalFooterHeight: { type: Number, default: 74 },
  minHeight: { type: Number, default: 80 },
  height: { type: Number },
  footerOffset: { type: Number, default: 0 },
  visible: { type: Boolean },
  fullScreen: { type: Boolean },
  loadingTip: { type: String },
}

export default defineComponent({
  name: 'ModalWrapper',
  components: { ScrollContainer },
  directives: {
    loading: loadingDirective,
  },
  inheritAttrs: false,
  props,
  emits: ['height-change', 'ext-height'],
  setup(props, { emit }) {
    const wrapperRef = ref<ComponentRef>(null)
    const spinRef = ref<ElRef>(null)
    const realHeightRef = ref(0)
    const minRealHeightRef = ref(0)

    let realHeight = 0

    let stopElResizeFn

    useWindowSizeFn(setModalHeight.bind(null, false))

    useMutationObserver(
      spinRef,
      () => {
        setModalHeight()
      },
      {
        attributes: true,
        subtree: true,
      }
    )

    createModalContext({
      redoModalHeight: setModalHeight,
    })

    const spinStyle = computed((): CSSProperties => {
      return {
        minHeight: `${props.minHeight}px`,
        [props.fullScreen ? 'height' : 'maxHeight']: `${unref(realHeightRef)}px`,
      }
    })

    watchEffect(() => {
      props.useWrapper && setModalHeight()
    })

    watch(
      () => props.fullScreen,
      (v) => {
        setModalHeight()
        if (!v) {
          realHeightRef.value = minRealHeightRef.value
        } else {
          minRealHeightRef.value = realHeightRef.value
        }
      }
    )

    onMounted(() => {
      const { modalHeaderHeight, modalFooterHeight } = props
      emit('ext-height', modalHeaderHeight + modalFooterHeight)
    })

    onUnmounted(() => {
      stopElResizeFn && stopElResizeFn()
    })

    async function scrollTop() {
      nextTick(() => {
        const wrapperRefDom = unref(wrapperRef)
        if (!wrapperRefDom) return
        ;(wrapperRefDom as any)?.scrollTo?.(0)
      })
    }

    async function setModalHeight() {
      // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
      // 加上这个,就必须在使用的时候传递父级的visible
      if (!props.visible) return
      const wrapperRefDom = unref(wrapperRef)
      if (!wrapperRefDom) return

      const bodyDom = wrapperRefDom.$el.parentElement
      if (!bodyDom) return
      bodyDom.style.padding = '0'
      await nextTick()

      try {
        const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement
        if (!modalDom) return

        const modalRect = getComputedStyle(modalDom as Element).top
        const modalTop = Number.parseInt(modalRect)

        let maxHeight =
          window.innerHeight -
          // modalTop * 2 +
          40 * 2 +
          (props.footerOffset! || 0) -
          props.modalFooterHeight -
          props.modalHeaderHeight

        // 距离顶部过进会出现滚动条
        if (modalTop < 40) {
          maxHeight -= 26
        }

        await nextTick()
        const spinEl = unref(spinRef)

        if (!spinEl) return
        await nextTick()
        // if (!realHeight) {
        realHeight = spinEl.scrollHeight
        // }

        if (props.fullScreen) {
          realHeightRef.value =
            window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight - 32
        } else {
          realHeightRef.value = props.height
            ? props.height > maxHeight
              ? maxHeight // 设置的高度大于最大高度此时要用最大高度
              : props.height
            : realHeight > maxHeight
            ? maxHeight
            : realHeight

          // 真实高度大于viewport，修正top，不能top还是100，只去压底部距离viewport底部的距离
          if (realHeight > maxHeight || (props.height && props.height > maxHeight)) {
            modalDom.style.top = `40px` // 上下距离40px
          }
        }
        emit('height-change', unref(realHeightRef))
      } catch (error) {
        console.log(error)
      }
    }

    return { wrapperRef, spinRef, spinStyle, scrollTop, setModalHeight }
  },
})
</script>
