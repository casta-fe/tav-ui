<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { InputNumberRangeProps } from '../../../../dist/types/components/input-number-range/src/types'
export default defineComponent({
  name: 'InputNumberRangeTest',
  components: {},
  setup() {
    const inputNumberRangeState = reactive<InputNumberRangeProps>({
      value: [],
    })
    const changeInputNumber = (data) => {
      console.log(data, 'dkdk')
      inputNumberRangeState.value = data
    }
    return {
      inputNumberRangeState,
      changeInputNumber,
    }
  },
})
</script>

<template>
  <section class="test">
    <h2>InputNumberRange使用</h2>
    <div class="components">
      <TaInputNumberRange :value="inputNumberRangeState.value" @change="changeInputNumber" />
    </div>
  </section>
</template>
