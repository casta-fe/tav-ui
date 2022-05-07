<script lang="ts">
import { computed, defineComponent } from 'vue'
import BasicHelp from '../../basic-help'
import Icon from '../../icon'
import { basicTitleProps } from './types'
export default defineComponent({
  name: 'TaBasicTitle',
  components: { Icon, BasicHelp },
  props: basicTitleProps,
  setup(props, { slots }) {
    const prefixCls = 'ta-basic-title'
    const getClass = computed(() => [
      prefixCls,
      { [`${prefixCls}-show-span`]: props.span && slots.default },
      { [`${prefixCls}-normal`]: props.normal },
    ])
    return {
      prefixCls,
      getClass,
    }
  },
})
</script>
<template>
  <span :class="getClass">
    <Icon v-if="$props.icon" :icon="$props.icon" :color="$props.iconColor" />
    <slot />
    <BasicHelp v-if="helpMessage" :class="`${prefixCls}-help`" :text="helpMessage" />
  </span>
</template>
