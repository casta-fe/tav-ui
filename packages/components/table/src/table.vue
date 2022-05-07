<script lang="ts">
import { defineComponent } from 'vue'
import { tableProps } from './props'
export default defineComponent({
  name: 'TaTable',
  props: tableProps,
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="ta-table">
    开始编写你的 ta-table 组件吧
  </div>
</template>
