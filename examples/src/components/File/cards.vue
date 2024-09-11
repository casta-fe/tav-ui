<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { TaFileCards } from '@tav-ui/components/file'

const fileCardsRef = ref()
const fileCardsProps = reactive({
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
    fileActualIds: [],
    fileActionUploadLink: {
      visible: true,
    },
    fileCard: [
      {
        value: 'INVEST_YSH_YSHSHPPT',
      },
    ],
  },
  create: {
    mode: 'create',
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
    fileActualIds: [],
    fileActionUploadLink: {
      visible: true,
    },
    autoValidate: false,
  },
  update: {
    mode: 'update',
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
    fileActualIds: [],
    fileActionUploadLink: {
      visible: true,
    },
    fileCard: {
      items: (rows) => rows.filter((row) => row.field !== 'action'),
    },
  },
  updateInstantly: {
    mode: 'updateInstantly',
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
      businessId: 'TG-20240806000001',
      businessKey: 'GSUX15638CGK5X22D-TG-20240806000001',
      businessParamsJson: JSON.stringify({
        investCompanyCode: 'test1',
        investInvProjectNumber: 'test1',
      }),
    },
    fileActualIds: [],
    fileActionUploadLink: {
      visible: true,
    },
    fileCard: [
      {
        value: 'INVEST_YSH_YSHSHPPT',
        rules: (rules: any[]) => {
          return rules.map((rule) =>
            rule.key === 'required' ? { ...rule, required: false } : rule
          )
        },
      },
    ],
  },
})

// setTimeout(() => {
//   unifiedTaFileData.read.apiParams['businessCheck'] = true as any
//   fileRef.value?.fileTypeSelectReload()
// }, 5000)

watch(
  () => fileCardsProps.updateInstantly.fileActualIds,
  async (cur) => {
    console.log('fileActualIds: ', cur)
    // console.log('🚀 ~ fileCardsRef:', fileCardsRef.value.getDataSource())
    // console.log('🚀 ~ fileCardsRef:', fileCardsRef.value.getDataSource('INVEST_YSH_YSHSHPPT'))
    // setTimeout(async () => {
    //   await fileCardsRef.value.validate()
    // }, 20000)
  },
  {
    deep: true,
  }
)
</script>

<template>
  <section
    class="ta-file-test"
    style="width: 450px; height: 100%; margin: 0 auto; background-color: #fff; padding: 20px 0"
  >
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileCards
      ref="fileCardsRef"
      v-bind="fileCardsProps.updateInstantly"
      v-model:fileActualIds="fileCardsProps.updateInstantly.fileActualIds"
    />
  </section>
</template>
