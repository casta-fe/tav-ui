<script setup lang="ts">
import { reactive, ref } from 'vue'
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

const singleTaFileTypeSelectData = reactive({
  api: taUploadProvideData.queryFileType,
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
// singleTaFileTypeSelect()

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

const unifiedTaFileData = reactive({
  apiReadFileType: taUploadProvideData.queryFileType,
  apiCreateFile: taUploadProvideData.uploadFile,
  apiParams: {
    moduleCodes: ['kf_pitch'],
    appId: 10002,
  },
})
</script>

<template>
  <section class="ta-file-test">
    <h2>TaFile 测试</h2>

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

    <h3>TaFile 集合测试</h3>
    <TaFile v-bind="unifiedTaFileData" />
  </section>
</template>
