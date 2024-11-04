<script setup lang="ts">
import { onBeforeUnmount, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { TaButton, TaModal } from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import { TaFileUpload, transformUrlToFileUploadPreviewPropFile } from '@tav-ui/components/file'
import { refreshUploadVars, replaceFileUrlVarsToValue } from '../../utils'
import {
  DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME,
  DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_ID,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import { useGlobalConfigProps, useMergedProps } from '../../hooks'
import {
  type EditorCustomUploadfileModalProps,
  editorCustomUploadfileModalEmits,
  editorCustomUploadfileModalProps,
} from './types'
// import File from './components/File/index.vue'

defineOptions({
  name: 'TaEditorCustomUploadfileModal',
  inheritAttrs: false,
})

const props = defineProps(editorCustomUploadfileModalProps)
const emits = defineEmits(editorCustomUploadfileModalEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<EditorCustomUploadfileModalProps>(globalConfigProps, props)

const tabsActive = ref('0')

const fileUploadModelValue = ref<any[]>([])
watch(
  () => mergedProps.value.uploadVarsJson,
  (curuploadVarsJson, preuploadVarsJson) => {
    if (
      modalVisible.value &&
      curuploadVarsJson &&
      preuploadVarsJson &&
      preuploadVarsJson !== '{}' &&
      curuploadVarsJson !== preuploadVarsJson
    ) {
      if (fileUploadModelValue.value.length > 0) {
        fileUploadModelValue.value = fileUploadModelValue.value.map((v) => ({
          ...v,
          uploadVarsJson: curuploadVarsJson,
          url: refreshUploadVars(
            v.url,
            JSON.parse(curuploadVarsJson),
            JSON.parse(preuploadVarsJson)
          ),
        }))
      }
    }
  }
)
async function handleFileUploadAfterApi(apiData: any) {
  if (!(mergedProps.value.uploadVarsJson && mergedProps.value.uploadVarsJson !== '{}'))
    return Promise.reject('[tavui TaEditor] uploadVarsJson is empty')

  const uploadImageVars = JSON.parse(mergedProps.value.uploadVarsJson)
  if (uploadImageVars) {
    return apiData.map((uploadedFile: string) => {
      let handledUrlUploadedFile: Record<string, any> = {
        url: replaceFileUrlVarsToValue(uploadedFile, uploadImageVars),
      }

      handledUrlUploadedFile = {
        ...handledUrlUploadedFile,
        ...transformUrlToFileUploadPreviewPropFile(
          decodeURIComponent(handledUrlUploadedFile['url']),
          DEFAULT_FILE_OFFICE_TYPES
        ),
        uploadVarsJson: JSON.stringify(uploadImageVars),
      }

      return handledUrlUploadedFile
    })
  }
  return Promise.reject('[tavui TaEditor] handleFileUploadAfterApi has error')
}

async function getUploadfileModalValue() {
  const values: Record<string, any> = {}
  const componentsValue = {
    0: JSON.parse(JSON.stringify(fileUploadModelValue.value)),
  }
  for (const [k, v] of Object.entries(componentsValue)) {
    if (!values[k]) {
      values[k] = v
    }
  }
  fileUploadModelValue.value = []
  return values
}

async function confirm() {
  const value = await getUploadfileModalValue()
  close(value)
}

const modalVisible = ref(props.visible)

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (!modalVisible.value) open()
    } else {
      if (modalVisible.value) close()
    }
  }
)

async function open() {
  modalVisible.value = true
  emits('open')
  emits('update:visible', modalVisible.value)
}

function close(value = {}) {
  modalVisible.value = false
  emits('close', value)
  emits('update:visible', modalVisible.value)
}

function cleanup() {
  close()
}

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  open,
  close,
  getUploadfileModalValue,
  cleanup,
})
</script>

<template>
  <section
    :id="DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_ID"
    :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME}-wrapper`"
  >
    <TaModal
      :visible="modalVisible"
      title="TaEditorCustomUploadfileModal"
      :width="props.width"
      :min-height="400"
      :wrap-class-name="`${DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME} ${
        props.wrapClassName ?? ''
      }`"
      :destroy-on-close="props.destroyOnClose"
      :mask-closable="props.maskClosable"
      :get-popup-container="props.getPopupContainer"
      @cancel="close"
    >
      <template #title>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME}-title`">插入附件</div>
      </template>
      <template #default>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADFILE_MODAL_CLASSNAME}-body`">
          <TaFileUpload
            v-if="tabsActive === '0'"
            v-model:value="fileUploadModelValue"
            file-type="office"
            :multiple="true"
            :max-count="DEFAULT_FILE_MAX_COUNT"
            :keep-upload-visible="true"
            :preview-api="mergedProps.apiPreviewFile"
            :api="mergedProps.apiUploadFile"
            :after-api="handleFileUploadAfterApi"
          />
        </div>
      </template>
      <template #footer>
        <TaButton @click="close">{{ tavI18n('Tav.common.cancelText') }}</TaButton>
        <TaButton type="primary" @click="confirm">{{ tavI18n('Tav.common.okText') }}</TaButton>
      </template>
    </TaModal>
  </section>
</template>
