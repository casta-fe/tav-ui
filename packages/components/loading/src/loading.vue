<script lang="ts">
import { defineComponent } from 'vue'
import { Spin } from 'ant-design-vue'
import { loadingProps } from './types'

export default defineComponent({
  name: 'TaLoading',
  components: { Spin },
  props: loadingProps,
})
</script>
<template>
  <section
    v-show="loading"
    class="full-loading"
    :class="{ absolute, [theme as any]: !!theme }"
    :style="[background ? `background-color: ${background}` : '']"
  >
    <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>
