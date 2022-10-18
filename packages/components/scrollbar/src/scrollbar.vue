<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  unref,
} from 'vue'
import { addResizeListener, removeResizeListener } from '@tav-ui/utils/event/index'
import Button from '@tav-ui/components/button'
import Bar from './bar'
import { scrollbarProps } from './types'
import { toObject } from './util'
import type { Emitter } from '@tav-ui/utils'

export default defineComponent({
  name: 'TaScrollbar',
  components: { Bar, Button },
  inheritAttrs: false,
  props: scrollbarProps,
  setup(props) {
    const sizeWidth = ref('0')
    const sizeHeight = ref('0')
    const moveX = ref(0)
    const moveY = ref(0)
    const wrap = ref<any>({})
    const resize = ref()
    const isBackTopShow = ref<boolean>(false)

    provide('scroll-bar-wrap', wrap)

    const style = computed(() => {
      if (Array.isArray(props.wrapStyle)) return toObject(props.wrapStyle)

      return props.wrapStyle
    })

    const handleScroll = () => {
      if (!props.native) {
        moveY.value = (unref(wrap).scrollTop * 100) / unref(wrap).clientHeight
        moveX.value = (unref(wrap).scrollLeft * 100) / unref(wrap).clientWidth

        if (props.backTopVisibilityHeight && moveY.value > props.backTopVisibilityHeight) {
          isBackTopShow.value = true
        } else {
          isBackTopShow.value = false
        }
      }
    }

    const update = () => {
      if (!unref(wrap)) return
      const heightPercentage = (unref(wrap).clientHeight * 100) / unref(wrap).scrollHeight
      const widthPercentage = (unref(wrap).clientWidth * 100) / unref(wrap).scrollWidth

      sizeHeight.value = heightPercentage < 100 ? `${heightPercentage}%` : ''
      sizeWidth.value = widthPercentage < 100 ? `${widthPercentage}%` : ''
    }

    const handleBackTopClick = () => {
      unref(wrap).scrollTop = 0
    }

    onMounted(() => {
      if (props.native) return
      nextTick(update)
      inject<Emitter>('modalEmitter')?.on('redoThumbHeight', () => {
        nextTick(update)
      })

      if (!props.noresize) {
        addResizeListener(unref(resize), update)
        addResizeListener(unref(wrap), update)
        addEventListener('resize', update)
      }
    })

    onBeforeUnmount(() => {
      if (props.native) return
      if (!props.noresize) {
        removeResizeListener(unref(resize), update)
        removeResizeListener(unref(wrap), update)
        removeEventListener('resize', update)
      }
    })

    return {
      moveX,
      moveY,
      sizeWidth,
      sizeHeight,
      style,
      wrap,
      resize,
      update,
      handleScroll,
      isBackTopShow,
      handleBackTopClick,
    }
  },
})
</script>
<template>
  <div :class="['scrollbar', containerClass]">
    <div
      ref="wrap"
      :class="[wrapClass, 'scrollbar__wrap', native ? '' : 'scrollbar__wrap--hidden-default']"
      :style="style"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="resize" :class="['scrollbar__view', viewClass]" :style="viewStyle">
        <slot />
        <Button
          v-if="isBackTopShow"
          type="text"
          pre-icon="ant-design:vertical-align-top-outlined"
          :icon-size="18"
          style="
            min-width: auto;
            position: absolute;
            right: 15px;
            bottom: 7px;
            width: 30px;
            height: 30px !important;
            overflow: hidden;
            color: #fff;
            background-color: #00000073;
            border-radius: 50%;
            transition: all 0.3s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          @click="handleBackTopClick"
        />
      </component>
    </div>
    <template v-if="!native">
      <bar :move="moveX" :size="sizeWidth" />
      <bar vertical :move="moveY" :size="sizeHeight" />
    </template>
  </div>
</template>
