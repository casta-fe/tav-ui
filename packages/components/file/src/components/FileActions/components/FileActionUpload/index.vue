<script setup lang="ts">
import { createId, createNS } from '../../../../utils'

const ns = createNS('file')
const cls = ns.b('action-upload')
const id = createId(cls)

defineOptions({
  name: 'TaFileActionUpload',
  inheritAttrs: false,
})

// const props = defineProps(buttonProps)
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <section :id="id" :class="cls">TaFileUploadAction</section>
</template>
