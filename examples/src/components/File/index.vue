<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  type FileActionUploadInstance,
  type FileTypeSelectEmits,
  type FileTypeSelectInstance,
  TaFile,
  TaFileActionUpload,
  TaFileTypeSelect,
} from '@tav-ui/components/file'
import { taUploadProvideData } from '../TaUpload/provideData'
import type { ArgumentsOf } from '@tav-ui/components/file/src/utils'

// const fileProps = {
//   // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
//   mode: 'updateInstantly',
//   apiParams: {
//     moduleCode: 'tg_company',
//     appId: 10001,
//     // HeaderAppId // 替换 header ai
//     businessKey: 'GSWU19972MMNPWLF7',
//     businessId: 'GSWU19972MMNPWLF7',
//     // type object
//     businessParamsJson: JSON.stringify({
//       investCompanyCode: 'test1',
//       investInvProjectNumber: 'test1',
//     }),
//   },
//   fileActualIds: [],
//   headerVisible: { type: Boolean, default: true },
//   title: { type: String, title: 'TaFile' },
//   titleVisible: { type: Boolean, default: false },
//   /** 顶部操作区显隐控制 */
//   headerActionsVisible: { type: Boolean, default: true },
//   /** fileactions */
//   fileActionsVisible: { type: Boolean, default: true },

//   fileTypeSelect: {
//     value: '',
//     options: [{}],
//     fieldNames: {},
//     placeholder: '',
//     visible: true,
//   },
//   fileActionUpload: {
//     name: '',
//     icon: '',
//     visible: true,
//     beforeApiUploadFile: () => {},
//     afterApiUploadFile: () => {},
//   },
//   fileTable: {
//     dataSource: [],
//     pagerConfig: {},
//     visible: true,
//     columns: () => {},
//     actions: () => {},
//     enabledRowEdit: true,
//     enabledVersion: true,
//     afterQueryFile: (dataSource) => {
//       return {}
//     },
//   },
// }
// const fileTableProps = {
//   // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
//   mode: 'updateInstantly',
//   apiParams: {
//     moduleCode: 'tg_company',
//     appId: 10001,
//     businessKey: 'GSWU19972MMNPWLF7',
//     businessId: 'GSWU19972MMNPWLF7',
//     businessParamsJson: JSON.stringify({
//       investCompanyCode: 'test1',
//       investInvProjectNumber: 'test1',
//     }),
//   },
//   fileActualIds: [],
//   enabledRowEdit: true,
//   columns: () => {},
//   actions: () => {},
//   // ...
// }

const singleTaFileTypeSelectData = reactive({
  apiQueryFileType: taUploadProvideData.queryFileType,
  apiParams: {
    moduleCodes: ['kf_pitch'],
    appId: 10002,
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
const singleTaFileTypeSelectRef = ref<FileTypeSelectInstance>()
function singleTaFileTypeSelect() {
  setTimeout(() => {
    singleTaFileTypeSelectData.apiParams.moduleCodes = [
      ...singleTaFileTypeSelectData.apiParams.moduleCodes,
      'tg_poe',
    ]
    singleTaFileTypeSelectData.value = 'COMPANY_OTHER'
    // console.log(singleTaFileTypeSelectRef.value?.elRef)
  }, 2000)
}
function singleTaFileTypeSelectHandleSelect(...args: ArgumentsOf<FileTypeSelectEmits['select']>) {
  const [typeCode, option, fieldNames] = args
  singleTaFileActionUploadData.apiParams.moduleCodes =
    singleTaFileTypeSelectData.apiParams.moduleCodes
  singleTaFileActionUploadData.apiParams.typeCodes = [typeCode as string]
  singleTaFileActionUploadData.apiParams.appId = singleTaFileTypeSelectData.apiParams.appId
}
singleTaFileTypeSelect()

const singleTaFileActionUploadData = reactive({
  api: taUploadProvideData.uploadFile,
  apiParams: {
    moduleCodes: [] as string[],
    typeCodes: [] as string[],
    appId: -1,
  },
})
const singleTaFileActionUploadRef = ref<FileActionUploadInstance>()
function fileListChange(...args: any[]) {
  console.log(args)
}

const fileRef = ref()
const unifiedTaFileData = reactive({
  read: {
    // 要么在这里统一分发，要么在各个组件中各传一个 apiparams 单独控制
    mode: 'read',
    apiParams: {
      moduleCode: 'tg_company',
      appId: 10001,
      businessKey: 'GSWU19972MMNPWLF7',
      businessId: 'GSWU19972MMNPWLF7',
    },
    fileActualIds: [],
    fileTable: {
      modeQueryApiType: 'pager',
      showOperations: true,
      filterFormConfig: {
        inputForm: {
          field: 'searchValue',
          componentProps: {
            'enter-button': true,
            placeholder: '请输入企业、院所、高校名称',
          },
        },
        pannelForm: [
          {
            field: 'filterSearchValue',
            label: '企业、院所、高校名称',
            labelWidth: 150,
            component: 'Input',
            // componentProps: {
            //   // "enter-button": true,
            //   placeholder: "请输入企业、院所、高校名称"
            // }
          },
        ],
      },
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
      // modeQueryApiType: 'pager',
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
    fileTypeSelect: {
      // apiParams: {
      //   moduleCode: 'kf_pitch',
      //   appId: 10002,
      //   permissionControl: true
      // },
    },
    fileTable: {
      enabledRowEdit: true,
      modeQueryApiType: 'pager',
      // modeQueryApiType: 'list',
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
})
setTimeout(() => {
  // unifiedTaFileData.update.apiParams['businessIds'] = ['GSWU19972MMNPWLF7'] as any
  // fileRef.value?.fileTableReload()
}, 3000)

watch(
  () => unifiedTaFileData.update.fileActualIds,
  (cur) => {
    console.log(cur)
  },
  {
    deep: true,
  }
)

function handlefilechange(...args: any) {
  console.log(args)
}
function handleFileTableActions(args: any) {
  console.log(args)
  return args
}
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->

    <!-- <h3>TaFile TaFileTypeSelect 测试</h3>
    <TaFileTypeSelect
      ref="singleTaFileTypeSelectRef"
      v-bind="singleTaFileTypeSelectData"
      @select="singleTaFileTypeSelectHandleSelect"
    />

    <h3>TaFile TaFileActionUpload 测试</h3>
    <TaFileActionUpload
      ref="singleTaFileActionUploadRef"
      v-bind="singleTaFileActionUploadData"
      @fileListChange="fileListChange"
    /> -->

    <!-- <h3>TaFile 集合测试</h3> -->
    <TaFile
      ref="fileRef"
      v-bind="unifiedTaFileData.update"
      v-model:fileActualIds="unifiedTaFileData.update.fileActualIds"
      @change="handlefilechange"
    />
  </section>
</template>
