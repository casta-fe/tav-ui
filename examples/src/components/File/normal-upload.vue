<script setup lang="ts">
import { ref } from 'vue'
import {
  DEFAULT_FILE_IMAGE_TYPES,
  TaFileUpload,
  transformUrlToFileUploadPreviewPropFile,
} from '@tav-ui/components/file'
import { replaceEditorUrlVarsToValue } from '@tav-ui/components/editor'
import { taUploadProvideData } from '../TaUpload'
import { previewEditorWPSFile } from '../TaUpload/provideData'

const fileUploadRef = ref()
const fileUploadVModelValue = ref([])
const fileUploadProps = ref({
  apiParams: {
    isCompress: 1,
    isScale: 1,
    scaleWidth: 240,
    scaleHeight: 240,
  },
  previewApi: previewEditorWPSFile,
  // fileType: 'office'
})

async function handleUploadAfterApi(apiData: any) {
  // console.log('🚀 ~ handleUploadAfterApi ~ apiData:', apiData)
  const { data: uploadImageVars, success } = await taUploadProvideData.uploadEditorImageVars()
  if (uploadImageVars && success) {
    return apiData.map((uploadedFile, idx) => {
      let handledUrlUploadedFile: Record<string, any> = {}
      for (const [k, v] of Object.entries(uploadedFile)) {
        if (v && typeof v === 'string') {
          handledUrlUploadedFile[k] = replaceEditorUrlVarsToValue(v, uploadImageVars)
        } else {
          handledUrlUploadedFile[k] = v
        }
      }

      handledUrlUploadedFile = {
        ...handledUrlUploadedFile,
        ...transformUrlToFileUploadPreviewPropFile(
          handledUrlUploadedFile['imageOriginUrl'],
          DEFAULT_FILE_IMAGE_TYPES
        ),
      }

      return handledUrlUploadedFile
    })
  }
  return Promise.reject()
}

setInterval(() => {
  console.log('🚀 ~ setInterval ~ fileUploadVModelValue:', fileUploadVModelValue.value)
}, 5000)
</script>

<template>
  <section class="ta-file-test" style="width: 800px; height: 60%; margin: 0 auto">
    <!-- <h2>TaFile 测试</h2> -->
    <TaFileUpload
      ref="fileUploadRef"
      v-model:value="fileUploadVModelValue"
      v-bind="fileUploadProps"
      :api="taUploadProvideData.uploadEditorImage"
      :after-api="handleUploadAfterApi"
    />
  </section>
</template>
