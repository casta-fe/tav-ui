<script lang="ts">
import type { CSSProperties } from 'vue'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const prefixCls = 'ta-icon-svg'
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)

    const getStyle = computed((): CSSProperties => {
      const { size } = props
      let s = `${size}`
      s = `${s.replace('px', '')}px`
      return {
        width: s,
        height: s,
      }
    })
    return { symbolId, prefixCls, getStyle }
  },
})
</script>
<template>
  <svg
    :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
