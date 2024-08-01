<script setup lang="ts">
import { ref } from 'vue'
import { TaFileActionUpload } from '@tav-ui/components/file'

const fileActionUploadRef = ref()
const fileActionUploadProps = ref({
  mode: 'read',
  apiParams: {
    moduleCode: 'tg_company',
    businessKey: 'GSWU19972MMNPWLF7',
    businessIds: ['GSWU19972MMNPWLF7'],
  },
  showOperations: true,
  filterFormConfig: true,
  pagerConfig: {
    enabled: false,
  },
})

// setTimeout(() => {
//   unifiedTaFileData.read.apiParams['businessCheck'] = true as any
//   fileRef.value?.fileActionUploadReload()
// }, 5000)
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileActionUpload ref="fileActionUploadRef" v-bind="fileActionUploadProps" />
  </section>
</template>
