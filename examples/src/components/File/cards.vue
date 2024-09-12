<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { type FileCardInstance, TaFileCards } from '@tav-ui/components/file'

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
    // waterfallConfig: {
    //   enabled: true,
    // },
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

setTimeout(async () => {
  const fileCardRefMap = fileCardsRef.value.getFileCardRefMap() as {
    [key: string]: FileCardInstance
  }
  console.log('🚀 ~ fileCardRefMap ~ fileCardRefMap:', fileCardRefMap)

  for (const [fileCardValue, fileCardInstance] of Object.entries(fileCardRefMap)) {
    const dataSource = await fileCardInstance.readRows()
    console.log('🚀 ~ setTimeout ~ dataSource:', dataSource)

    if (fileCardValue === 'INVEST_YSH_YSHGZDG') {
      const targetRow = dataSource[0]
      await fileCardInstance.updateRows({
        rows: [{ ...targetRow, fullName: `test${targetRow.fullName}` }],
        deleteRows: [targetRow],
      })
      console.log('🚀 ~ setTimeout ~ updateRows:', await fileCardInstance.readRows())
    }
  }
}, 3000)

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
    style="width: 100%; height: 100%; margin: 0 auto; background-color: #fff"
  >
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileCards
      ref="fileCardsRef"
      v-bind="fileCardsProps.updateInstantly"
      v-model:fileActualIds="fileCardsProps.updateInstantly.fileActualIds"
    />
  </section>
</template>
