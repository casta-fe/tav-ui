<script setup lang="ts">
import { ref } from 'vue'
import { TaFileTable } from '@tav-ui/components/file'

const fileTableRef = ref()
const fileTableProps = ref({
  mode: 'updateInstantly',
  apiParams: {
    moduleCode: 'tg_fund_major_events_root',
    appId: 10001,
    businessCheck: false,
    businessKey: '8ee151a72b8c4fcc8b59f3c9d3951acc',
  },
  enabledRowEdit: true,
  modeQueryApiType: 'pager',
  showOperations: true,
  filterFormConfig: true,
  customActionConfig: (defaultConfig: any) => ({ ...defaultConfig, checkboxCache: true }),
  checkboxConfig: {
    enabled: true,
    highlight: true,
    cache: true,
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

setTimeout(async () => {
  console.log('🚀 ~ setTimeout ~ getSelectRows:', await fileTableRef.value?.getSelectRows())
}, 10000)
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileTable ref="fileTableRef" v-bind="fileTableProps" />
  </section>
</template>
