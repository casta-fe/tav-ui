<template>
  <a-input v-bind="$attrs" :class="prefixCls" :size="size" :value="state">
    <template #addonAfter>
      <TaCountButton :size="size" :count="count" :value="state" :before-start-func="sendCodeApi" />
    </template>
    <template v-for="item in Object.keys($slots).filter((k) => k !== 'addonAfter')" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
  </a-input>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRuleFormItem } from '@tav-ui/hooks/component/useFormItem'
import TaCountButton from '@tav-ui/components/count-button/src/count-button.vue'
import { countDownInputProps } from './types'

export default defineComponent({
  name: 'TaCountDownInput',
  components: { TaCountButton },
  inheritAttrs: false,
  props: countDownInputProps,
  setup(props) {
    const prefixCls = 'ta-countdown-input'
    const [state] = useRuleFormItem(props)

    return { prefixCls, state }
  },
})
</script>
