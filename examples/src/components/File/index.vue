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
      businessId: 'GSWU19972MMNPWLF7',
    },
    fileActualIds: [],
    fileActionUploadLink: {
      visible: true,
    },
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
      moduleCode: 'tg_invest',
      appId: 10001,
      businessKey: 'GSWU19972MMNPWLF7',
      businessId: 'GSWU19972MMNPWLF7',
      businessParamsJson: JSON.stringify({
        investCompanyCode: 'test1',
        investInvProjectNumber: 'test1',
      }),
    },
    fileActualIds: [],
    fileTypeSelect: {
      value: undefined,
      // options: [
      //   {
      //     id: 9,
      //     appId: 10001,
      //     code: 'INVEST_FOUND_BFJY',
      //     name: '拜访纪要',
      //     seq: 8.0,
      //     remark: '立项',
      //     moduleId: 9,
      //     moduleCode: 'tg_invest_evaluation',
      //     moduleParentId: 2,
      //     sid: '9-9',
      //   },
      // ],
      // apiParams: {
      //   moduleCode: 'kf_pitch',
      //   appId: 10002,
      //   permissionControl: true
      // },
    },
    fileActionUpload: {
      beforeUpload(...args: any[]) {
        console.log(args)
        return true
      },
    },
    fileActionUploadLink: {
      visible: true,
    },
    fileTable: {
      apiParams: {
        moduleCode: 'tg_invest',
      },
      enabledRowEdit: true,
      modeQueryApiType: 'pager',
      // modeQueryApiType: 'list',
      // dataSource: [
      //   {
      //     id: 78211,
      //     appId: 10001,
      //     actualId: 'd546eff9ced84a88adc1a3d50e7423f5',
      //     moduleId: 13,
      //     businessKey: 'GS9L29723MD7UCPCB-tg_invest-TG-20240731000001',
      //     businessId: 'TG-20240731000001-4',
      //     type: 466,
      //     deleted: 0,
      //     version: 1,
      //     name: '再融资立项表模版',
      //     suffix: 'xlsx',
      //     fullName: '再融资立项表模版.xlsx',
      //     size: 15584,
      //     address: '/20240801/17225143685779413.xlsx',
      //     runtime: null,
      //     hyperlink: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 2,
      //     fileSize: '15KB',
      //     createBy: '1',
      //     createByName: '系统管理员',
      //     expand: null,
      //     dataType: null,
      //     toPdf: 0,
      //     errorMsg: null,
      //     moduleCode: 'tg_invest_agreement',
      //     moduleName: '协议签署',
      //     typeCode: 'INVEST_XYQS_QZBTZXY',
      //     typeName: '签章版投资协议',
      //     createTime: '2024-08-01 20:12:49',
      //   },
      //   {
      //     id: 78210,
      //     appId: 10001,
      //     actualId: '0d6fe0b6bea64c24bfe94c299af1c9e3',
      //     moduleId: 13,
      //     businessKey: 'GS9L29723MD7UCPCB-tg_invest-TG-20240731000001',
      //     businessId: 'TG-20240731000001-4',
      //     type: 466,
      //     deleted: 0,
      //     version: 1,
      //     name: 'output (1)',
      //     suffix: 'png',
      //     fullName: 'output (1).png',
      //     size: 395998,
      //     address: '/20240801/17225143647377890.png',
      //     runtime: null,
      //     hyperlink: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 2,
      //     fileSize: '386KB',
      //     createBy: '1',
      //     createByName: '系统管理员',
      //     expand: null,
      //     dataType: null,
      //     toPdf: 0,
      //     errorMsg: null,
      //     moduleCode: 'tg_invest_agreement',
      //     moduleName: '协议签署',
      //     typeCode: 'INVEST_XYQS_QZBTZXY',
      //     typeName: '签章版投资协议',
      //     createTime: '2024-08-01 20:12:45',
      //   },
      // ],
      showOperations: true,
      filterFormConfig: true,
      // pagerConfig: {
      //   enabled: true,
      // },
    },
  },
})
// setTimeout(() => {
//   // unifiedTaFileData.updateInstantly.fileTypeSelect.value = 'INVEST_FOUND_BFJY'
//   unifiedTaFileData.updateInstantly.apiParams.moduleCode = 'tg_company'
// }, 10000)

watch(
  () => unifiedTaFileData.update.fileActualIds,
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
      v-bind="unifiedTaFileData.update"
      v-model:fileActualIds="unifiedTaFileData.update.fileActualIds"
    >
      <!-- <template #FileActionUploadButton="{ disabled, loading, validate }">
        <button :disabled="disabled" :loading="loading" @click="(e) => validate(e)">upload</button>
      </template> -->
    </TaFile>
  </section>
</template>
