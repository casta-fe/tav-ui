<script setup lang="ts">
import { onBeforeUnmount, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { TaButton, TaButtonGroup, TaModal } from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import { TaFileUpload, transformUrlToFileUploadPreviewPropFile } from '@tav-ui/components/file'
import { replaceEditorUrlVarsToValue } from '../../utils'
import {
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME,
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_ID,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_MAX_COUNT,
} from '../../consts'
import { useGlobalConfigProps, useMergedProps } from '../../hooks'
import {
  type EditorCustomUploadimageModalProps,
  editorCustomUploadimageModalEmits,
  editorCustomUploadimageModalProps,
} from './types'
import ImageLink from './components/ImageLink/index.vue'

defineOptions({
  name: 'TaEditorCustomUploadimageModal',
  inheritAttrs: false,
})

const props = defineProps(editorCustomUploadimageModalProps)
const emits = defineEmits(editorCustomUploadimageModalEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<EditorCustomUploadimageModalProps>(globalConfigProps, props)

const tabsActive = ref('0')
const tabsOptions = ref<
  {
    label: string
    value: string
  }[]
>([
  {
    label: '上传本地图片',
    value: '0',
  },
  {
    label: '上传图片链接',
    value: '1',
  },
])

const fileUploadModelValue = ref<any[]>([])
async function handleFileUploadAfterApi(apiData: any) {
  if (!mergedProps.value.apiUploadVars)
    return Promise.reject('[tavui TaEditor] apiUploadVars is undefined')

  const { data: uploadImageVars, success } = await mergedProps.value.apiUploadVars()
  if (uploadImageVars && success) {
    return apiData.map((uploadedFile: any) => {
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
  return Promise.reject('[tavui TaEditor] apiUploadVars has error')
}

const imageLinkRef = ref()

async function getUploadimageModalTabsValue() {
  const values: Record<string, any> = {}
  const componentsValue = {
    0: () => JSON.parse(JSON.stringify(fileUploadModelValue.value)),
    // eslint-disable-next-line no-return-await
    1: async () => await imageLinkRef.value?.getValues?.(),
  }
  for (const [k, v] of Object.entries(componentsValue)) {
    if (!values[k]) {
      values[k] = await v()
    }
  }

  fileUploadModelValue.value = []
  return values
}

async function confirm() {
  const values = await getUploadimageModalTabsValue()
  close(values)
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

function close(values = {}) {
  modalVisible.value = false
  tabsActive.value = '0'
  emits('close', values)
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
  getUploadimageModalTabsValue,
  cleanup,
})
</script>

<template>
  <section
    :id="DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_ID"
    :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME}-wrapper`"
  >
    <TaModal
      :visible="modalVisible"
      title="TaEditorCustomUploadimageModal"
      :width="props.width"
      :min-height="400"
      :wrap-class-name="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME} ${
        props.wrapClassName ?? ''
      }`"
      :destroy-on-close="props.destroyOnClose"
      :mask-closable="props.maskClosable"
      :get-popup-container="props.getPopupContainer"
      @cancel="close"
    >
      <template #title>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME}-title`">插入图片</div>
      </template>
      <template #default>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_CLASSNAME}-body`">
          <TaButtonGroup v-model:active="tabsActive" :buttons="tabsOptions" />
          <TaFileUpload
            v-if="tabsActive === '0'"
            v-model:value="fileUploadModelValue"
            :multiple="true"
            :max-count="DEFAULT_FILE_MAX_COUNT"
            :keep-upload-visible="true"
            :api-params="{
              isCompress: 1,
              isScale: 1,
              scaleWidth: 240,
              scaleHeight: 240,
            }"
            :preview-api="mergedProps.apiPreviewFile"
            :api="mergedProps.apiUploadImage"
            :after-api="handleFileUploadAfterApi"
          />
          <ImageLink v-if="tabsActive === '1'" ref="imageLinkRef" />
        </div>
      </template>
      <template #footer>
        <TaButton @click="close">{{ tavI18n('Tav.common.cancelText') }}</TaButton>
        <TaButton type="primary" @click="confirm">{{ tavI18n('Tav.common.okText') }}</TaButton>
      </template>
    </TaModal>
  </section>
</template>
