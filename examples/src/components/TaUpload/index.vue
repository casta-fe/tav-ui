<template>
  <ta-upload :params="params" />
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
// import { TaUpload } from '@tav-ui/components'
import TaUpload from '../../../../dist/tav-ui/es/components/upload/src/Upload'

export default defineComponent({
  components: {
    TaUpload,
  },
  setup() {
    return {
      params: {
        moduleCode: 'tg_invest',
        businessId: 'id0',
      },
    }
  },
})
</script>
