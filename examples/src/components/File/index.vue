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
      customActionConfig: true,
      pagerConfig: {
        enabled: true,
      },
      // dataSource: [
      //   {
      //     id: 73086,
      //     appId: 10001,
      //     actualId: '5d8e721a997348c19c46041178348834',
      //     moduleId: 9,
      //     businessKey: '91320583MA20NTY87Y-tg_invest-TG-20240607000003',
      //     businessId: 'TG-20240607000003-0',
      //     type: 9,
      //     deleted: 0,
      //     version: 1,
      //     name: '10',
      //     suffix: 'png',
      //     fullName: '10.png',
      //     size: 45113,
      //     address: '/20240607/17177485273641322.png',
      //     runtime: null,
      //     hyperlink: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 2,
      //     fileSize: '44KB',
      //     createBy: '1',
      //     createByName: '系统管理员',
      //     expand: null,
      //     dataType: null,
      //     toPdf: 0,
      //     errorMsg: null,
      //     moduleCode: 'tg_company',
      //     moduleName: '评估立项',
      //     typeCode: 'INVEST_FOUND_BFJY',
      //     typeName: '拜访纪要',
      //     createTime: '2024-06-07 16:22:07',
      //   },
      // ],
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
      // dataSource: [
      //   {
      //     id: 73086,
      //     appId: 10001,
      //     actualId: '5d8e721a997348c19c46041178348834',
      //     moduleId: 9,
      //     businessKey: '91320583MA20NTY87Y-tg_invest-TG-20240607000003',
      //     businessId: 'TG-20240607000003-0',
      //     type: 9,
      //     deleted: 0,
      //     version: 1,
      //     name: '10',
      //     suffix: 'png',
      //     fullName: '10.png',
      //     size: 45113,
      //     address: '/20240607/17177485273641322.png',
      //     runtime: null,
      //     hyperlink: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 2,
      //     fileSize: '44KB',
      //     createBy: '1',
      //     createByName: '系统管理员',
      //     expand: null,
      //     dataType: null,
      //     toPdf: 0,
      //     errorMsg: null,
      //     moduleCode: 'tg_company',
      //     moduleName: '评估立项',
      //     typeCode: 'INVEST_FOUND_BFJY',
      //     typeName: '拜访纪要',
      //     createTime: '2024-06-07 16:22:07',
      //   },
      // ],
      // pagerConfig: {
      //   enabled: true,
      // },
    },
  },
  update: {
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'update',
    apiParams: {
      moduleCode: 'tg_company',
      // appId: 10002,
      businessKey: 'GS7Q60156G8LC3X3D',
      businessIds: ['GS7Q60156G8LC3X3D'],
      businessId: 'GS7Q60156G8LC3X3D',
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
      businessCheck: true,
      businessKey: 'GSWU19972MMNPWLF7',
      businessId: 'GSWU19972MMNPWLF7',
      businessIds: ['GSWU19972MMNPWLF7'],
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
      // apiParams: {
      //   // moduleCode: 'tg_invest',
      //   // businessKey: 'GSWU19972MMNPWLF7',
      //   // businessIds: ['GSWU19972MMNPWLF7'],
      //   businessCheck: false,
      // },
      enabledRowEdit: true,
      modeQueryApiType: 'pager',
      // modeQueryApiType: 'list',
      showOperations: true,
      filterFormConfig: true,
      customActionConfig: true,
      // dataSource: [
      //   {
      //     id: 78144,
      //     appId: 10001,
      //     actualId: '922819270e4b4556a40c219be1e1d444',
      //     moduleId: 2,
      //     businessKey: 'GSWU19972MMNPWLF7',
      //     businessId: 'GSWU19972MMNPWLF7',
      //     type: 12,
      //     deleted: 0,
      //     version: 1,
      //     name: 'test',
      //     suffix: 'docx',
      //     fullName: 'test.docx',
      //     size: 13426,
      //     address: '/20240807/17230009624311784.docx',
      //     hyperlink: 0,
      //     auto: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 1,
      //     fileSize: '13KB',
      //     createBy: '1',
      //     owner: '1',
      //     createByName: '系统管理员',
      //     ownerName: '系统管理员',
      //     expand: null,
      //     workflowCopy: 0,
      //     toPdf: 0,
      //     errorMsg: null,
      //     createTime: '2024-08-07 11:22:42',
      //     updateTime: '2024-08-07 11:22:42',
      //     moduleCode: 'tg_invest',
      //     moduleFullName: '股权投资',
      //     typeCode: 'INVEST_FOUND_NDA',
      //     typeName: 'NDA',
      //     staging: 0,
      //     businessDisplayItemValue: null,
      //     businessDisplayItemText: null,
      //   },
      //   {
      //     id: 77898,
      //     appId: 10001,
      //     actualId: '00273843cd7b460099df34dc84b13926',
      //     moduleId: 2,
      //     businessKey: 'GSWU19972MMNPWLF7',
      //     businessId: 'GSWU19972MMNPWLF7',
      //     type: 12,
      //     deleted: 0,
      //     version: 1,
      //     name: 'test',
      //     suffix: 'pptx',
      //     fullName: 'test.pptx',
      //     size: 33856,
      //     address: '/20240805/17228501611116563.pptx',
      //     hyperlink: 0,
      //     auto: 0,
      //     sourceFileDownload: 1,
      //     watermarkFileDownload: 1,
      //     fileSize: '33KB',
      //     createBy: '1',
      //     owner: '1',
      //     createByName: '系统管理员',
      //     ownerName: '系统管理员',
      //     expand: null,
      //     workflowCopy: 0,
      //     toPdf: 0,
      //     errorMsg: null,
      //     createTime: '2024-08-05 17:29:21',
      //     updateTime: '2024-08-05 17:29:21',
      //     moduleCode: 'tg_invest',
      //     moduleFullName: '股权投资',
      //     typeCode: 'INVEST_FOUND_NDA',
      //     typeName: 'NDA',
      //     staging: 0,
      //     businessDisplayItemValue: null,
      //     businessDisplayItemText: null,
      //   },
      // ],
      // pagerConfig: {
      //   enabled: true,
      // },
    },
  },
})
setTimeout(() => {
  // unifiedTaFileData.updateInstantly.fileTypeSelect.value = 'INVEST_FOUND_BFJY'
  // unifiedTaFileData.updateInstantly.apiParams.moduleCode = 'tg_company'
  // unifiedTaFileData.updateInstantly.apiParams.typeCodes = ['INVEST_FOUND_BFJY']
  // setTimeout(() => {
  //   unifiedTaFileData.create.fileTable.dataSource = []
  // }, 5000)
  // unifiedTaFileData.create.mode = 'update'
  // unifiedTaFileData.create.fileTable.dataSource[0].fullName = 'xxxxx.qqq'
  // unifiedTaFileData.updateInstantly.fileTable.dataSource.push({
  //   id: 78147,
  //   appId: 10001,
  //   actualId: '433de6d5e44a4d2998726af6519b64b7',
  //   moduleId: 2,
  //   businessKey: 'GSWU19972MMNPWLF7',
  //   businessId: 'GSWU19972MMNPWLF7',
  //   type: 11,
  //   deleted: 0,
  //   version: 1,
  //   name: 'bbb',
  //   suffix: null,
  //   fullName: null,
  //   size: null,
  //   address: 'https://bbb.com',
  //   hyperlink: 1,
  //   auto: 0,
  //   sourceFileDownload: 1,
  //   watermarkFileDownload: 1,
  //   fileSize: null,
  //   createBy: '1',
  //   owner: '1',
  //   createByName: '系统管理员',
  //   ownerName: '系统管理员',
  //   expand: null,
  //   workflowCopy: 0,
  //   toPdf: 0,
  //   errorMsg: null,
  //   createTime: '2024-08-07 11:24:39',
  //   updateTime: '2024-08-07 11:24:39',
  //   moduleCode: 'tg_invest',
  //   moduleFullName: '股权投资',
  //   typeCode: 'INVEST_FOUND_TZJYS_',
  //   typeName: '投资建议书(脱敏)',
  //   staging: 0,
  //   businessDisplayItemValue: null,
  //   businessDisplayItemText: null,
  // })
  // console.log(
  //   fileRef.value?.fileTableUpdateRows({
  //     rows: [{ ...unifiedTaFileData.updateInstantly.fileTable.dataSource[0], fullName: 'i7eo' }],
  //     deleteRows: [{ ...unifiedTaFileData.updateInstantly.fileTable.dataSource[0] }],
  //   })
  // )
}, 5000)

watch(
  () => unifiedTaFileData.update.fileActualIds,
  (cur) => {
    console.log('fileActualIds: ', cur)
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
  <section class="ta-file-test" style="width: 800px; height: 500px; margin: 0 auto">
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
