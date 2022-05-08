<script lang="ts">
import { defineComponent, reactive } from 'vue'
// import {TaTime} from '../../../../dist/index.esm'

export default defineComponent({
  name: 'TimeTest',
  components: {
    // TaTime
  },
  setup() {
    const state = reactive({
      value: new Date(),
    })
    return {
      state,
    }
  },
})
</script>

<template>
  <section class="test">
    <h2>Time组件测试 relative</h2>
    <TaTime :value="state.value" mode="relative" />
    <h2>Time组件测试 date</h2>
    <TaTime :value="state.value" mode="date" />
    <h2>Time组件测试 datetime</h2>
    <TaTime :value="state.value" mode="datetime" />
  </section>
</template>

