<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-26 16:51:10
-->
<template>
  <div class="ta-form-title">
    {{ title }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {}
  },
})
</script>
