<template>
  <Input v-bind="$attrs" :class="prefixCls" :size="size" :value="state">
    <template #addonAfter>
      <CountButton :size="size" :count="count" :value="state" :before-start-func="sendCodeApi" />
    </template>
    <template v-for="item in Object.keys($slots).filter((k) => k !== 'addonAfter')" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
  </Input>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Input } from 'ant-design-vue'
import { useRuleFormItem } from '@tav-ui/hooks/component/useFormItem'
import CountButton from './count-down-button.vue'
import { countDownProps } from './types'

export default defineComponent({
  name: 'TaCountDown',
  components: { CountButton, Input },
  inheritAttrs: false,
  props: countDownProps,
  setup(props) {
    const prefixCls = 'ta-countdown'
    const [state] = useRuleFormItem(props)

    return { prefixCls, state }
  },
})
</script>
