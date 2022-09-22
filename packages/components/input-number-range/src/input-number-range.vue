<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { Input, InputNumber } from 'ant-design-vue'
// import { cloneDeep } from "lodash-es";
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { inputNumberRangeEmits, inputNumberRangeProps } from './types'
const { createMessage } = useMessage()
export interface InputNumberRangeState {
  min: number | string
  max: number | string
}
export default defineComponent({
  name: 'TaInputNumberRange',
  components: {
    Input,
    InputNumber,
  },
  props: inputNumberRangeProps,
  emits: inputNumberRangeEmits,
  setup(props, { emit }) {
    const initPropsValue = props.value ? props.value.slice(0) : []

    const state = reactive<InputNumberRangeState>({
      min: initPropsValue[0],
      max: initPropsValue[1],
    })

    const blurValueMin = (e) => {
      const value = e.target.value
      if (value && state.max && Number(value) > Number(state.max)) {
        createMessage.warning('最小范围不得大于最大范围')
        emit('change', [null, state.max])
      } else {
        emit('change', [value, state.max])
      }
    }

    const blurValueMax = (e) => {
      const value = e.target.value
      if (state.min && value && Number(state.min) > Number(value)) {
        createMessage.warning('最大范围不得小于最小范围')
        emit('change', [state.min, null])
      } else {
        emit('change', [state.min, value])
      }
    }
    watch(
      () => props.value,
      (newValue) => {
        const nextValue = newValue ? newValue.slice(0) : []
        state.min = nextValue[0]
        state.max = nextValue[1]
      },
      {
        deep: true,
      }
    )

    return {
      blurValueMax,
      blurValueMin,
      ...toRefs(state),
    }
  },
})
</script>

<template>
  <div class="ta-input-number-range">
    <InputNumber
      :placeholder="minPlaceHolder"
      :value="min"
      :min="0"
      :size="size"
      :precision="precision"
      @blur="blurValueMin"
    />
    <Input
      style="width: 30px; border: none; pointer-events: none; background-color: #fff"
      :placeholder="prefixCenter"
      disabled
      size="small"
    />
    <InputNumber
      :min="0"
      :placeholder="maxPlaceHolder"
      :value="max"
      :size="size"
      :precision="precision"
      @blur="blurValueMax"
    />
  </div>
</template>
