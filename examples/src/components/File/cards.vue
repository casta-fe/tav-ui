<script setup lang="ts">
import { ref } from 'vue'
import { TaFileCards } from '@tav-ui/components/file'

const fileCardsRef = ref()
const fileCardsProps = ref({
  read: {
    mode: 'read',
    apiParams: {
      appId: '10001',
      moduleCode: 'tg_invest_prequalification',
      // moduleCode: 'tg_invest',
      typeCodes: [
        'INVEST_YSH_YSHSHPPT',
        'INVEST_YSH_YSHGZDG',
        'INVEST_YSH_YSHHYJY',
        'INVEST_YSH_XMFXBG',
        'INVEST_YSH_YSHQTWJ',
      ],
      businessIds: ['TG-20240806000001'],
      businessKey: 'GSUX15638CGK5X22D-TG-20240806000001',
    },
    fileCard: [
      {
        value: 'INVEST_YSH_YSHSHPPT',
      },
    ],
  },
})

// setTimeout(() => {
//   unifiedTaFileData.read.apiParams['businessCheck'] = true as any
//   fileRef.value?.fileTypeSelectReload()
// }, 5000)
</script>

<template>
  <section
    class="ta-file-test"
    style="width: 800px; height: 60%; margin: 0 auto; background-color: #ccc; padding: 0 20px"
  >
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileCards ref="fileCardsRef" v-bind="fileCardsProps.read" />
  </section>
</template>
