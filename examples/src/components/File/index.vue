<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { TaFile } from '@tav-ui/components/file'

const fileRef = ref()
const unifiedTaFileData = reactive({
  read: {
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'read',
    apiParams: {
      moduleCode: 'tg_company',
      appId: 10001,
      businessKey: 'GSWU19972MMNPWLF7',
      businessIds: ['GSWU19972MMNPWLF7'],
    },
    fileActualIds: [],
    fileTable: {
      modeQueryApiType: 'list',
      showOperations: true,
      filterFormConfig: true,
      pagerConfig: {
        enabled: true,
      },
    },
  },
  create: {
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'create',
    apiParams: {
      // moduleCode: 'kf_pitch',
      // appId: 10002,
      moduleCode: 'tg_company',
      appId: 10001,
      businessKey: 'GSWU19972MMNPWLF7',
      businessId: 'GSWU19972MMNPWLF7',
    },
    fileActualIds: [],
    // fileActionUpload: {
    //   beforeUpload: (...args) => {
    //     console.log(args)
    //     return true
    //   }
    // },
    fileTable: {
      modeQueryApiType: 'pager',
      // showOperations: true,
      // filterFormConfig: {
      //   inputForm: {
      //     field: 'searchValue',
      //     componentProps: {
      //       'enter-button': true,
      //       placeholder: '请输入企业、院所、高校名称',
      //     },
      //   },
      //   pannelForm: [
      //     {
      //       field: 'filterSearchValue',
      //       label: '企业、院所、高校名称',
      //       labelWidth: 150,
      //       component: 'Input',
      //       // componentProps: {
      //       //   // "enter-button": true,
      //       //   placeholder: "请输入企业、院所、高校名称"
      //       // }
      //     },
      //   ],
      // },
      pagerConfig: {
        enabled: true,
      },
    },
  },
  update: {
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'update',
    apiParams: {
      moduleCode: 'tg_company',
      // appId: 10002,
      businessKey: 'GSWU19972MMNPWLF7',
      businessIds: ['GSWU19972MMNPWLF7'],
    },
    fileActualIds: [],
    fileTable: {
      // apiParams: {
      //   appId: 10003,
      // },
      enabledRowEdit: true,
      modeQueryApiType: 'pager',
      // filterFormConfig: handleFilterFormConfig,
      // showOperations: true,
      pagerConfig: {
        enabled: false,
      },
      actions: handleFileTableActions,
    },
  },
  updateInstantly: {
    title: '立即更新测试',
    titleVisible: true,
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'updateInstantly',
    apiParams: {
      moduleCode: 'tg_company',
      appId: 10001,
      businessKey: 'GSWU19972MMNPWLF7',
      businessId: 'GSWU19972MMNPWLF7',
      businessParamsJson: JSON.stringify({
        investCompanyCode: 'test1',
        investInvProjectNumber: 'test1',
      }),
    },
    fileActualIds: [],
    // fileTypeSelect: {
    //   apiParams: {
    //     moduleCode: 'kf_pitch',
    //     appId: 10002,
    //     permissionControl: true
    //   },
    // },
    fileActionUpload: {
      beforeUpload(...args: any[]) {
        console.log(args)
        return false
      },
    },
    fileTable: {
      apiParams: {
        moduleCode: 'default',
      },
      enabledRowEdit: true,
      modeQueryApiType: 'pager',
      // modeQueryApiType: 'list',
      dataSource: [
        {
          id: 73086,
          appId: 10001,
          actualId: '5d8e721a997348c19c46041178348834',
          moduleId: 9,
          businessKey: '91320583MA20NTY87Y-tg_invest-TG-20240607000003',
          businessId: 'TG-20240607000003-0',
          type: 9,
          deleted: 0,
          version: 1,
          name: '10',
          suffix: 'png',
          fullName: '10.png',
          size: 45113,
          address: '/20240607/17177485273641322.png',
          runtime: null,
          hyperlink: 0,
          sourceFileDownload: 1,
          watermarkFileDownload: 2,
          fileSize: '44KB',
          createBy: '1',
          createByName: '系统管理员',
          expand: null,
          dataType: null,
          toPdf: 0,
          errorMsg: null,
          moduleCode: 'tg_company',
          moduleName: '评估立项',
          typeCode: 'INVEST_FOUND_BFJY',
          typeName: '拜访纪要',
          createTime: '2024-06-07 16:22:07',
        },
      ],
      // showOperations: true,
      // filterFormConfig: true,
      // pagerConfig: {
      //   enabled: true,
      // },
    },
  },
})
// setTimeout(() => {
//   unifiedTaFileData.read.apiParams['businessCheck'] = true as any
//   fileRef.value?.fileTableReload()
// }, 5000)

watch(
  () => unifiedTaFileData.updateInstantly.fileActualIds,
  (cur) => {
    console.log(cur)
  },
  {
    deep: true,
  }
)

function handleFileTableActions(args: any) {
  // console.log(args)
  return args
}
function handleFilterFormConfig(args: any) {
  // console.log(args)
  return args
}
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h3>TaFile 集合测试</h3> -->
    <TaFile
      ref="fileRef"
      v-bind="unifiedTaFileData.updateInstantly"
      v-model:fileActualIds="unifiedTaFileData.updateInstantly.fileActualIds"
    />
  </section>
</template>
