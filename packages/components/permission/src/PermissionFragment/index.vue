<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_PERMISSIONFRAGMENT_CLASSNAME, DEFAULT_PERMISSIONFRAGMENT_ID } from './constants'

defineOptions({
  name: 'TaPermissionFragment',
  // inheritAttrs: false,
})

const id = ref(DEFAULT_PERMISSIONFRAGMENT_ID())
const type = ref(DEFAULT_PERMISSIONFRAGMENT_CLASSNAME)

defineExpose({
  id,
  type,
})
</script>

<template>
  <slot />
</template>
