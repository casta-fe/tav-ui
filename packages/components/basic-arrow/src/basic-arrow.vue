<script lang="ts">
import { computed, defineComponent } from 'vue'
import Icon from '@tav-ui/components/icon'
import { basicArrowProps } from './types'

export default defineComponent({
  name: 'TaBasicArrow',
  components: { Icon },
  props: basicArrowProps,
  setup(props) {
    const prefixCls = 'ta-basic-arrow'
    // get component class
    const getClass = computed(() => {
      const { expand, up, down, inset } = props
      return [
        prefixCls,
        {
          [`${prefixCls}--active`]: expand,
          up,
          inset,
          down,
        },
      ]
    })
    return {
      prefixCls,
      getClass,
    }
  },
})
</script>

<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle" />
  </span>
</template>
