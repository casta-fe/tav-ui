<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { FormItem, InputNumber } from 'ant-design-vue'
// import { cloneDeep } from "lodash-es";
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import { inputNumberRangeEmits, inputNumberRangeProps } from './types'
const { createMessage } = useMessage()
export interface InputNumberRangeState {
  min: number | string
  max: number | string
}
export default defineComponent({
  name: 'TaInputNumberRange',
  components: {
    FormItem,
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
    const minCompProps = computed(() => ({
      ...props.minProps,
      min: props.min ? props.min : props.minProps.min,
      max: props.max ? props.max : props.minProps.max || Infinity,
      placeholder: props.minPlaceHolder ? props.minPlaceHolder : props.minProps.placeholder,
    }))
    const maxCompProps = computed(() => ({
      ...props.maxProps,
      min: props.min ? props.min : props.maxProps.min,
      max: props.max ? props.max : props.maxProps.max || Infinity,
      placeholder: props.maxPlaceHolder ? props.maxPlaceHolder : props.maxProps.placeholder,
    }))
    const changeHandle = (value) => {
      emit('change', [state.min, state.max])
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
      minCompProps,
      maxCompProps,
      changeHandle,
      ...toRefs(state),
    }
  },
})
</script>

<template>
  <div class="ta-input-number-range" :class="{ disabled }">
    <FormItem>
      <InputNumber
        v-bind="{ ...minCompProps }"
        v-model:value="min"
        :size="size"
        :disabled="disabled"
        :precision="precision"
        @change="changeHandle"
      />
    </FormItem>
    <span class="ta-input-number-range-prefix">{{ prefixCenter }}</span>
    <FormItem>
      <InputNumber
        v-bind="{ ...maxCompProps }"
        v-model:value="max"
        :size="size"
        :disabled="disabled"
        :precision="precision"
        @change="changeHandle"
      />
    </FormItem>
  </div>
</template>
