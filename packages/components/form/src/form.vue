<script lang="ts">
import { defineComponent } from 'vue'
import { formProps } from './props'
export default defineComponent({
  name: 'TaForm',
  props: formProps,
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="ta-form">
    开始编写你的 ta-form 组件吧
  </div>
</template>
