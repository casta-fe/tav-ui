<script setup lang="ts">
import { Image as AImage } from 'ant-design-vue'

defineOptions({
  name: 'TaFilePreviewImage',
  inheritAttrs: false,
})

const props = defineProps({
  src: {
    type: String,
  },
  preview: {
    type: Object,
  },
})
</script>

<template>
  <AImage :style="{ display: 'none' }" :src="props.src" :preview="props.src" />
</template>
