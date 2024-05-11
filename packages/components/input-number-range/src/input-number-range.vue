<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { FormItem, Input, InputNumber } from 'ant-design-vue'
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
    const minCompProps = computed(() => ({
      ...props.minProps,
      min: props.min ? props.min : props.minProps.min || 0,
      max: props.max ? props.max : props.minProps.max || Infinity,
      placeholder: props.minPlaceHolder ? props.minPlaceHolder : props.minProps.placeholder,
    }))
    const maxCompProps = computed(() => ({
      ...props.maxProps,
      min: props.min ? props.min : props.maxProps.min || 0,
      max: props.max ? props.max : props.maxProps.max || Infinity,
      placeholder: props.maxPlaceHolder ? props.maxPlaceHolder : props.maxProps.placeholder,
    }))
    const blurValueMin = (e) => {
      const value = e.target.value
      if (value && state.max && Number(value) > Number(state.max)) {
        createMessage.warning(tavI18n('Tav.form.inputRange.1'))
        emit('change', [null, state.max])
      } else {
        emit('change', [state.min, state.max])
      }
    }

    const blurValueMax = (e) => {
      const value = e.target.value
      if (state.min && value && Number(state.min) > Number(value)) {
        createMessage.warning(tavI18n('Tav.form.inputRange.2'))
        emit('change', [state.min, null])
      } else {
        emit('change', [state.min, state.max])
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
      minCompProps,
      maxCompProps,
      blurValueMax,
      blurValueMin,
      ...toRefs(state),
    }
  },
})
</script>

<template>
  <div class="ta-input-number-range">
    <FormItem>
      <InputNumber
        v-bind="{ ...minCompProps }"
        v-model:value="min"
        :size="size"
        :precision="precision"
        @blur="blurValueMin"
      />
    </FormItem>
    <Input
      style="width: 30px; border: none; pointer-events: none; background-color: #fff"
      :placeholder="prefixCenter"
      disabled
      size="small"
    />
    <FormItem>
      <InputNumber
        v-bind="{ ...maxCompProps }"
        v-model:value="max"
        :size="size"
        :precision="precision"
        @blur="blurValueMax"
      />
    </FormItem>
  </div>
</template>
