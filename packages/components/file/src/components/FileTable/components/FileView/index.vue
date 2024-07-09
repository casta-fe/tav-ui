<script setup lang="ts">
import { createId, createNS } from '../../../../utils'

const ns = createNS('file')
const cls = ns.b('view')
const id = createId(cls)

defineOptions({
  name: 'TaFileView',
  inheritAttrs: false,
})

// const props = defineProps(buttonProps)
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <section :id="id" :class="cls">TaFileView</section>
</template>
