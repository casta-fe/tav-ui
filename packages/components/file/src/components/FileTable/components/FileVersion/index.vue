<script setup lang="ts">
import { createId, createNS } from '../../../../utils'

const ns = createNS('file')
const cls = ns.b('version')
const id = createId(cls)

defineOptions({
  name: 'TaFileVersion',
  inheritAttrs: false,
})

// const props = defineProps(buttonProps)
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <section :id="id" :class="cls">TaFileVersion</section>
</template>
