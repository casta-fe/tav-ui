<script setup lang="ts">
import { createId, createNS } from '../../utils'

export interface FileTableProps {
  visible: boolean
}

const ns = createNS('file')
const cls = ns.b('table')
const id = createId(cls)

defineOptions({
  name: 'TaFileTable',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileTableProps>(), {
  visible: true,
})
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <template v-if="props.visible">
    <section :id="id" :class="cls">TaFileTable</section>
  </template>
</template>
