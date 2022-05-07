<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import Icon from '../../icon'
import BasicHelp from '../../basic-help'
import { basicTitleProps } from './types'

const props = defineProps(basicTitleProps)

const prefixCls = 'ta-basic-title'
const slots = useSlots()
const getClass = computed(() => [
  prefixCls,
  { [`${prefixCls}-show-span`]: props.span && slots.default },
  { [`${prefixCls}-normal`]: props.normal },
])
</script>
<script lang="ts">
export default {
  name: 'TaBasicTitle',
}
</script>
<template>
  <span :class="getClass">
    <Icon v-if="props.icon" :icon="props.icon" :color="props.iconColor" />
    <slot />
    <BasicHelp v-if="helpMessage" :class="`${prefixCls}-help`" :text="helpMessage" />
  </span>
</template>
