<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BasicModalWrapper',
  setup() {
    return {

    }
  },
})
</script>
<template>
  <div ref="wrapperRef">
    <div ref="spinRef">
      <slot />
    </div>
  </div>
</template>
