<script lang="ts">
import { defineComponent } from 'vue'
import { Input } from 'ant-design-vue'
import { inputNumberProps } from './types'
export default defineComponent({
  name: 'TaInputNumber',
  components: { Input },
  props: inputNumberProps,
  setup(_, { slots }) {
    const prefixCls = 'ta-inputnumber'
    return {
      prefixCls,
      slots,
    }
  },
})
</script>
<template>
  <Input class="ta-inputnumber" v-bind="{ ...$props, ...$attrs }">
    <template v-for="item in Object.keys($slots)" #[item]>
      <slot :name="item" />
    </template>
  </Input>
</template>
