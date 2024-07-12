<script setup lang="ts">
import { DEFAULT_FILEVERSION_CLASSNAME, DEFAULT_FILEVERSION_ID } from '../../consts'

defineOptions({
  name: 'TaFileVersion',
  inheritAttrs: false,
})

// const props = defineProps(buttonProps)
// const emit = defineEmits(buttonEmits)
</script>

<template>
  <section :id="DEFAULT_FILEVERSION_ID" :class="DEFAULT_FILEVERSION_CLASSNAME">
    TaFileVersion
  </section>
</template>
