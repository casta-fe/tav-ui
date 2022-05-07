<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import TaBasicTitle from '@tav-ui/components/basic-title'

export default defineComponent({
  name: 'BasicModalHeader',
  components: { TaBasicTitle },
  props: {
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
    title: { type: String },
  },
  emits: ['dblclick'],
})
</script>
<template>
  <TaBasicTitle :help-message="helpMessage">
    {{ title }}
  </TaBasicTitle>
</template>
