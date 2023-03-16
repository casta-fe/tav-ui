<template>
  <div class="wrapper">
    <TaUpload
      v-bind="{ ...state.upload, params: state.upload.params }"
      v-model:fileActualIds="state.upload.fileActualIds"
    />
    <TaButton :loading="true" @click="handleExport">button</TaButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { TaButton, TaUpload } from '@tav-ui/components'

export default defineComponent({
  name: 'Test',
  components: { TaUpload, TaButton },
  setup() {
    const state = reactive<Record<string, any>>({
      upload: {
        fileActualIds: [],
        customOptions: [
          {
            label: 'QR',
            value: 'POE_TH_PITCH_QR',
          },
          {
            label: 'Pitchbook',
            value: 'POE_TH_PITCH_BOOK',
          },
        ],
        params: {
          moduleCode: 'kf_org_file',
          businessKey: `_CUSTOMER_ORG_FILE`,
        },
        showTableAction: { preview: false, downloadWatermark: false },
      },
    })

    const handleExport = () => {
      console.log(1)
    }
    return { state, handleExport }
  },
})
</script>

<style lang="less" scoprd>
.wrapper {
  width: 100%;
  height: 800px;
  padding: 16px;
  background-color: #ccc;
}
</style>
