<script setup lang="ts">
import { DEFAULT_FILEVIEW_CLASSNAME, DEFAULT_FILEVIEW_ID } from '../../consts'

defineOptions({
  name: 'TaFileView',
  inheritAttrs: false,
})

// const props = defineProps(buttonProps)
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <section :id="DEFAULT_FILEVIEW_ID" :class="DEFAULT_FILEVIEW_CLASSNAME">TaFileView</section>
</template>
