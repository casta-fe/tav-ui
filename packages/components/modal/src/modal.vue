<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  provide,
  ref,
  toRef,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { omit } from 'lodash-es'
import { isFunction } from '@tav-ui/utils/is'
import { deepMerge } from '@tav-ui/utils/basic'
import { mitt } from '@tav-ui/utils/mitt'

import ModalContent from './components/ModalContent'
import ModalWrapper from './components/ModalWrapper.vue'
import ModalClose from './components/ModalClose.vue'
import ModalFooter from './components/ModalFooter.vue'
import ModalHeader from './components/ModalHeader.vue'
import { basicProps } from './types'
import { useFullScreen } from './hooks/useModalFullScreen'
import type { ModalMethods, ModalProps, Recordable } from './types'

export default defineComponent({
  name: 'TaModal',
  components: {
    ModalContent,
    ModalWrapper,
    ModalClose,
    ModalFooter,
    ModalHeader,
  },
  inheritAttrs: false,
  props: basicProps,
  emits: ['visible-change', 'height-change', 'cancel', 'ok', 'register', 'update:visible'],
  setup(props, { emit, attrs }) {
    const modalEmitter = mitt()
    provide('modalEmitter', modalEmitter)

    const visibleRef = ref(false)
    const propsRef = ref<Partial<ModalProps> | null>(null)
    const modalWrapperRef = ref<any>(null)
    const prefixCls = 'ta-basic-modal'

    // modal   Bottom and top height
    const extHeightRef = ref(0)
    const modalMethods: ModalMethods = {
      redoThumbHeight: () => modalEmitter.emit('redoThumbHeight'),
      setModalProps,
      emitVisible: undefined,
      redoModalHeight: () => {
        nextTick(() => {
          if (unref(modalWrapperRef)) (unref(modalWrapperRef) as any).setModalHeight()
        })
      },
    }

    const instance = getCurrentInstance()
    if (instance) emit('register', modalMethods, instance.uid)

    // Custom title component: get title
    const getMergeProps = computed((): Recordable => {
      return {
        ...props,
        ...(unref(propsRef) as any),
      }
    })

    const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
      modalWrapperRef,
      extHeightRef,
      // wrapClassName: toRef(getMergeProps.value, "wrapClassName")
      wrapClassName: toRef(props, 'wrapClassName'),
    })

    // modal component does not need title and origin buttons
    const getProps = computed((): Recordable => {
      const opt = {
        ...unref(getMergeProps),
        visible: unref(visibleRef),
        okButtonProps: undefined,
        cancelButtonProps: undefined,
        title: undefined,
      }
      return {
        ...opt,
        wrapClassName: unref(getWrapClassName),
      }
    })

    const getBindValue = computed((): Recordable => {
      const attr = {
        ...attrs,
        ...unref(getMergeProps),
        visible: unref(visibleRef),
        wrapClassName: `${unref(getWrapClassName)} ta-basic-modal`,
      }
      if (unref(fullScreenRef)) return omit(attr, ['height', 'title'])

      return omit(attr, 'title')
    })

    const getWrapperHeight = computed(() => {
      if (unref(fullScreenRef)) return undefined
      return unref(getProps).height
    })

    watchEffect(() => {
      visibleRef.value = !!props.visible
      fullScreenRef.value = !!props.defaultFullscreen
    })

    watch(
      () => unref(visibleRef),
      (v) => {
        emit('visible-change', v)
        emit('update:visible', v)
        instance && modalMethods.emitVisible?.(v, instance.uid)
        nextTick(() => {
          if (props.scrollTop && v && unref(modalWrapperRef))
            (unref(modalWrapperRef) as any).scrollTop()
        })
      },
      {
        immediate: false,
      }
    )

    // 取消事件
    async function handleCancel(e: Event) {
      e?.stopPropagation()
      // 过滤自定义关闭按钮的空白区域
      if ((e.target as HTMLElement)?.classList?.contains(`${prefixCls}-close--custom`)) return
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc()
        visibleRef.value = !isClose
        return
      }

      visibleRef.value = false
      emit('cancel', e)
    }

    /**
     * @description: 设置modal参数
     */
    function setModalProps(props: Partial<ModalProps>): void {
      // Keep the last setModalProps
      propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)
      if (Reflect.has(props, 'visible')) visibleRef.value = !!props.visible

      if (Reflect.has(props, 'defaultFullscreen')) fullScreenRef.value = !!props.defaultFullscreen
    }

    function handleOk(e: Event) {
      emit('ok', e)
    }

    function handleHeightChange(height: string) {
      emit('height-change', height)
    }

    function handleExtHeight(height: number) {
      extHeightRef.value = height
    }

    function handleTitleDbClick(e) {
      if (!props.canFullscreen) return
      e.stopPropagation()
      handleFullScreen(e)
    }

    return {
      handleCancel,
      getBindValue,
      getProps,
      handleFullScreen,
      fullScreenRef,
      getMergeProps,
      handleOk,
      visibleRef,
      omit,
      modalWrapperRef,
      handleExtHeight,
      handleHeightChange,
      handleTitleDbClick,
      getWrapperHeight,
    }
  },
})
</script>
<template>
  <ModalContent v-bind="getBindValue" @cancel="handleCancel">
    <template v-if="!$slots.closeIcon" #closeIcon>
      <ModalClose
        :can-fullscreen="getProps.canFullscreen"
        :full-screen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>

    <template v-if="!$slots.title" #title>
      <ModalHeader
        :help-message="getProps.helpMessage"
        :title="getMergeProps.title"
        @dblclick="handleTitleDbClick"
      />
    </template>

    <template v-if="!$slots.footer" #footer>
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
        <template v-for="item in Object.keys($slots)" #[item]="data">
          <slot :name="item" v-bind="data || {}" />
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      ref="modalWrapperRef"
      :use-wrapper="getProps.useWrapper"
      :footer-offset="wrapperFooterOffset"
      :full-screen="fullScreenRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :min-height="getProps.minHeight"
      :height="getWrapperHeight"
      :visible="visibleRef"
      :modal-footer-height="footer !== undefined && !footer ? 0 : undefined"
      v-bind="omit(getProps.wrapperProps, 'visible', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot />
    </ModalWrapper>

    <template v-for="item in Object.keys(omit($slots, 'default'))" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
  </ModalContent>
</template>
