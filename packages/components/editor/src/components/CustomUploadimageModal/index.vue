<script setup lang="ts">
import { onBeforeUnmount, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { TaButton, TaButtonGroup, TaModal } from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import {
  type FileUploadApiResponseRecord,
  TaFileUpload,
  transformUrlToFileUploadPreviewPropFile,
} from '@tav-ui/components/file'
import { refreshUploadVars, replaceFileUrlVarsToValue } from '../../utils'
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

// uploadvarsjson 5分钟更新一次然后实时更新，消耗性能暂时不用
// watch(
//   () => mergedProps.value.uploadVarsJson,
//   (curuploadVarsJson, preuploadVarsJson) => {
//     if (
//       modalVisible.value &&
//       curuploadVarsJson &&
//       preuploadVarsJson &&
//       preuploadVarsJson !== '{}' &&
//       curuploadVarsJson !== preuploadVarsJson
//     ) {
//       if (fileUploadModelValue.value.length > 0) {
//         fileUploadModelValue.value = fileUploadModelValue.value.map((v) => ({
//           ...v,
//           uploadVarsJson: curuploadVarsJson,
//           url: refreshUploadVars(
//             v.url,
//             JSON.parse(curuploadVarsJson),
//             JSON.parse(preuploadVarsJson)
//           ),
//         }))
//       }
//     }
//   }
// )

// 保存最新的 uploadvarsjson，只有在用到的地方（确定按钮向富文本传递数据）时更新
let curUploadVarsJson = mergedProps.value.uploadVarsJson!
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
      curUploadVarsJson = curuploadVarsJson
    }
  }
)

function refreshDataUploadVars(data: any) {
  // curUploadVarsJson '{}' 是初始化的值时也直接返回
  if (curUploadVarsJson === '{}') return data

  const preUploadVarsJson = data.uploadVarsJson
  // curUploadVarsJson 未更新时直接返回
  if (preUploadVarsJson === curUploadVarsJson) return data

  const url = refreshUploadVars(
    data.url,
    JSON.parse(curUploadVarsJson),
    JSON.parse(preUploadVarsJson)
  )
  return {
    ...data,
    uploadVarsJson: curUploadVarsJson,
    url,
  }
}

/**
 * 点击预览时使用最新的 uploadvarsjson 更新当前图片 url
 * @param row
 */
function handleBeforePreviewApiAction(row: FileUploadApiResponseRecord & Record<string, any>) {
  if (!row.url) return row
  return refreshDataUploadVars(row)
}

/**
 * 点击确定按钮时使用最新的 uploadvarsjson 更新所有图片 url
 */
function handleConfirmValue() {
  const value = JSON.parse(JSON.stringify(fileUploadModelValue.value))
  return value.map((row: any) => refreshDataUploadVars(row))
}

/**
 * 上传完毕后使用最新的 uploadvars 更新当前图片 url
 * @param apiData
 */
async function handleFileUploadAfterApi(apiData: any) {
  if (!(mergedProps.value.uploadVarsJson && mergedProps.value.uploadVarsJson !== '{}'))
    return Promise.reject('[tavui TaEditor] uploadVarsJson is empty')

  const uploadImageVars = JSON.parse(mergedProps.value.uploadVarsJson)
  if (uploadImageVars) {
    return apiData.map((uploadedFile: any) => {
      let handledUrlUploadedFile: Record<string, any> = {}
      for (const [k, v] of Object.entries(uploadedFile)) {
        if (v && typeof v === 'string') {
          handledUrlUploadedFile[k] = replaceFileUrlVarsToValue(v, uploadImageVars)
        } else {
          handledUrlUploadedFile[k] = v
        }
      }

      handledUrlUploadedFile = {
        ...handledUrlUploadedFile,
        ...transformUrlToFileUploadPreviewPropFile(
          decodeURIComponent(handledUrlUploadedFile['imageOriginUrl']),
          DEFAULT_FILE_IMAGE_TYPES
        ),
        uploadVarsJson: JSON.stringify(uploadImageVars),
      }

      return handledUrlUploadedFile
    })
  }
  return Promise.reject('[tavui TaEditor] handleFileUploadAfterApi has error')
}

const imageLinkRef = ref()

async function getUploadimageModalTabsValue() {
  const values: Record<string, any> = {}
  const componentsValue = {
    // uploadvarsjson 5分钟更新一次然后实时更新，消耗性能暂时不用
    // 0: () => JSON.parse(JSON.stringify(fileUploadModelValue.value)),
    0: () => handleConfirmValue(),
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
            :before-preview-api-action="handleBeforePreviewApiAction"
            :preview-api="mergedProps.apiPreviewFile"
            :api="mergedProps.apiUploadImage"
            :after-api="handleFileUploadAfterApi"
            keep-image-original-aspect-ratio
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
