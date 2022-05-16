<template>
  <Drawer :class="prefixCls" v-bind="getBindValues" @close="onClose">
    <template v-if="!$slots.title" #title>
      <DrawerHeader
        :title="getMergeProps.title"
        :is-detail="isDetail"
        :show-detail-back="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar" />
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title" />
    </template>

    <ScrollContainer
      v-loading="getLoading"
      :style="getScrollContentStyle"
      :loading-tip="loadingText || '加载中...'"
    >
      <slot />
    </ScrollContainer>
    <DrawerFooter v-bind="getProps" :height="getFooterHeight" @close="onClose" @ok="handleOk">
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </DrawerFooter>
  </Drawer>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  ref,
  toRaw,
  unref,
  watch,
} from 'vue'
import { Drawer } from 'ant-design-vue'
import ScrollContainer from '@tav-ui/components/container-scroll'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { deepMerge } from '@tav-ui/utils/basic'
import { isFunction, isNumber } from '@tav-ui/utils/is'
import DrawerFooter from './components/DrawerFooter.vue'
import DrawerHeader from './components/DrawerHeader.vue'
import { drawerProps } from './types'
import type { CSSProperties } from 'vue'
import type { DrawerInstance, DrawerProps } from './typing'

type Nullable<T> = T | null
type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'TaDrawer',
  components: { Drawer, ScrollContainer, DrawerFooter, DrawerHeader },
  inheritAttrs: false,
  props: drawerProps,
  emits: ['visible-change', 'ok', 'close', 'register'],
  setup(props, { emit }) {
    const visibleRef = ref(false)
    const attrs = useAttrs()
    const propsRef = ref<Partial<Nullable<DrawerProps>>>(null)
    const prefixCls = 'ta-basic-drawer'

    const drawerInstance: DrawerInstance = {
      setDrawerProps,
      emitVisible: undefined,
    }

    const instance = getCurrentInstance()

    instance && emit('register', drawerInstance, instance.uid)

    const getMergeProps = computed((): DrawerProps => {
      return deepMerge(toRaw(props), unref(propsRef))
    })

    const getProps = computed((): DrawerProps => {
      const opt = {
        placement: 'right',
        ...unref(attrs),
        ...unref(getMergeProps),
        visible: unref(visibleRef),
      }
      opt.title = undefined
      const { isDetail, width, wrapClassName, getContainer } = opt
      if (isDetail) {
        if (!width) {
          opt.width = '100%'
        }
        const detailCls = `${prefixCls}__detail`
        opt.wrapClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls

        if (!getContainer) {
          // TODO type error?
          opt.getContainer = '.ta-layout-content' as any
        }
      }
      return opt as DrawerProps
    })

    const getBindValues = computed((): DrawerProps => {
      return {
        ...attrs,
        ...unref(getProps),
      }
    })

    // Custom implementation of the bottom button,
    const getFooterHeight = computed(() => {
      const { footerHeight, showFooter } = unref(getProps)
      if (showFooter && footerHeight) {
        return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`
      }
      return `0px`
    })

    const getScrollContentStyle = computed((): CSSProperties => {
      const footerHeight = unref(getFooterHeight)
      return {
        position: 'relative',
        height: `calc(100% - ${footerHeight})`,
      }
    })

    const getLoading = computed(() => {
      return !!unref(getProps)?.loading
    })

    watch(
      () => props.visible,
      (newVal, oldVal) => {
        if (newVal !== oldVal) visibleRef.value = newVal
      },
      { deep: true }
    )

    watch(
      () => visibleRef.value,
      (visible) => {
        nextTick(() => {
          emit('visible-change', visible)
          instance && drawerInstance.emitVisible?.(visible, instance.uid)
        })
      }
    )

    // Cancel event
    async function onClose(e: Recordable) {
      const { closeFunc } = unref(getProps)
      emit('close', e)
      if (closeFunc && isFunction(closeFunc)) {
        const res = await closeFunc()
        visibleRef.value = !res
        return
      }
      visibleRef.value = false
    }

    function setDrawerProps(props: Partial<DrawerProps>): void {
      // Keep the last setDrawerProps
      propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)

      if (Reflect.has(props, 'visible')) {
        visibleRef.value = !!props.visible
      }
    }

    function handleOk() {
      emit('ok')
    }

    return {
      onClose,
      prefixCls,
      getMergeProps: getMergeProps as any,
      getScrollContentStyle,
      getProps: getProps as any,
      getLoading,
      getBindValues,
      getFooterHeight,
      handleOk,
    }
  },
})
</script>
