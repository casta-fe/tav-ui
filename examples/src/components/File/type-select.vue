<script setup lang="ts">
import { ref } from 'vue'
import { TaFileTypeSelect } from '@tav-ui/components/file'

const fileTypeSelectRef = ref()
const fileTypeSelectProps = ref({
  mode: 'read',
  apiParams: {
    appId: '10002',
    moduleCode: 'kf_pitch',
  },
  value: undefined as any,
  // options: [
  //   {
  //     name: '其他资料',
  //     code: 'COMPANY_OTHER',
  //   },
  //   {
  //     name: '类型二',
  //     code: 'type2',
  //   },
  // ],
})

// setTimeout(() => {
//   unifiedTaFileData.read.apiParams['businessCheck'] = true as any
//   fileRef.value?.fileTypeSelectReload()
// }, 5000)
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileTypeSelect ref="fileTypeSelectRef" v-bind="fileTypeSelectProps" />
  </section>
</template>
