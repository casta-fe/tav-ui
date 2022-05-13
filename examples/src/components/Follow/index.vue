<template>
  <div>
    <h2>Follow Test</h2>
    <div>
      <TaFollow :id="1" :type="1" :init-status-api="initFn" :update-status-api="updateFn" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { TaFollow } from '@tav-ui/components/follow/index'
export default defineComponent({
  components: {
    TaFollow,
  },
  setup() {
    const initFn = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            data: {},
          })
        }, 300)
      })
    const updateFn = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            data: {},
          })
        }, 300)
      })
    return {
      initFn,
      updateFn,
    }
  },
})
</script>
