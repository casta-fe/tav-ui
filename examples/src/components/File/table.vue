<script setup lang="ts">
import { ref } from 'vue'
import { TaFileTable } from '@tav-ui/components/file'

const fileTableRef = ref()
const fileTableProps = ref({
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
//   fileRef.value?.fileTableReload()
// }, 5000)

function handleFileTableActions(args: any) {
  console.log(args)
  return args
}
function handleFilterFormConfig(args: any) {
  console.log(args)
  return args
}
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileTable ref="fileTableRef" v-bind="fileTableProps" />
  </section>
</template>
