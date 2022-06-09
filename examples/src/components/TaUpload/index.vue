<template>
  <div style="margin: 16px; padding: 16px; border-radius: 8px; border: 1px solid #ccc">
    <ta-upload :params="params" :show-table-action="{ downloadWatermark: false }" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import { TaUpload } from '@tav-ui/components'

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
