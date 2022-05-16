<template>
  <div v-if="showFooter || $slots.footer" :class="prefixCls" :style="getStyle">
    <template v-if="!$slots.footer">
      <slot name="insertFooter" />
      <a-button v-if="showCancelBtn" v-bind="cancelButtonProps" class="mr-2" @click="handleClose">
        {{ cancelText }}
      </a-button>
      <slot name="centerFooter" />
      <a-button
        v-if="showOkBtn"
        :type="okType"
        v-bind="okButtonProps"
        class="mr-2"
        :loading="confirmLoading"
        @click="handleOk"
      >
        {{ okText }}
      </a-button>
      <slot name="appendFooter" />
    </template>

    <template v-else>
      <slot name="footer" />
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { footerProps } from '../types'
import type { CSSProperties } from 'vue'

export default defineComponent({
  name: 'BasicDrawerFooter',
  props: {
    ...footerProps,
    height: {
      type: String,
      default: '60px',
    },
  },
  emits: ['ok', 'close'],
  setup(props, { emit }) {
    const prefixCls = 'ta-basic-drawer-footer'

    const getStyle = computed((): CSSProperties => {
      const heightStr = `${props.height}`
      return {
        height: heightStr,
        lineHeight: heightStr,
      }
    })

    function handleOk() {
      emit('ok')
    }

    function handleClose() {
      emit('close')
    }
    return { handleOk, prefixCls, handleClose, getStyle }
  },
})
</script>
