<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  /*useSlots, useAttrs*/
} from 'vue'
import { Button as AButton, Image as AImage, Spin as ASpin } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { TaModal } from '@tav-ui/components/modal'
import { tavI18n } from '@tav-ui/locales'
import { useLoading } from '@tav-ui/components/file/src/hooks'
import {
  DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME,
  DEFAULT_FILEUPLOAD_PREVIEW_ID,
  DEFAULT_FILE_IGNORE_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import { fileUploadPreviewEmits, fileUploadPreviewProps } from './types'

defineOptions({
  name: 'TaFileUploadPreview',
  inheritAttrs: false,
})

const props = defineProps(fileUploadPreviewProps)
const emits = defineEmits(fileUploadPreviewEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const computedProps = computed(() => {
  return { ...props }
})

const { createMessage } = useMessage()
const supportWPS = computed(() => computedProps.value.file?.previewSupportWPS ?? false)
const currentFilePath = computed(() => computedProps.value.file?.previewUrl ?? '')
const filePreviewModalBodyContent = ref<HTMLElement>()

const { loading, setLoading } = useLoading()

const currentFile = computed(() => computedProps.value.file!)
const currentFileType = computed(() => {
  if (DEFAULT_FILE_OFFICE_TYPES.find((t) => currentFile.value.suffix === t)) {
    return 'office'
  }
  if (DEFAULT_FILE_IMAGE_TYPES.find((t) => currentFile.value.suffix === t)) {
    return 'image'
  }
  return ''
})

const modalVisible = ref(computedProps.value.visible)

watch(
  () => computedProps.value.visible,
  (visible) => {
    if (visible) {
      if (!modalVisible.value) open()
    } else {
      if (modalVisible.value) close()
    }
  }
)

async function open() {
  const validateFileTypeResult = validateFileType()
  if (!validateFileTypeResult) {
    close()
    return
  }

  modalVisible.value = true
  emits('open')
  emits('update:visible', modalVisible.value)

  setLoading(true)
  setTimeout(() => {
    setLoading(false)
  }, 350)
}

function close() {
  modalVisible.value = false
  emits('close')
  emits('update:visible', modalVisible.value)
  props.close?.()
}

function handleOnVisibleChange(isOpen: boolean) {
  if (!isOpen) {
    close()
  }
}

function validateFileType() {
  if (DEFAULT_FILE_IGNORE_TYPES.includes(currentFile.value.suffix)) {
    createMessage.warning(tavI18n('Tav.file.message.1'))
    return false
  }
  return true
}

// 清空状态
function cleanup() {
  close()
}

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  open,
  close,
  cleanup,
})
</script>

<template>
  <section :id="DEFAULT_FILEUPLOAD_PREVIEW_ID" :class="DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME">
    <TaModal
      :visible="modalVisible"
      title="TaFilePreview"
      :width="computedProps.width"
      :wrap-class-name="`${DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME}-modal ${
        supportWPS ? 'hide-modal-header' : ''
      } ${computedProps.wrapClassName ?? ''}`"
      :destroy-on-close="computedProps.destroyOnClose"
      :mask-closable="computedProps.maskClosable"
      :get-popup-container="computedProps.getPopupContainer"
      :footer="null"
      @visible-change="handleOnVisibleChange"
    >
      <template #title>
        <AButton
          type="text"
          class="file-view-close-btn"
          @click="() => (modalVisible = !modalVisible)"
        >
          <template #icon><CloseOutlined /></template>
          {{ tavI18n('Tav.common.closeText') }}
        </AButton>
        <div class="line line--vertical" />
        <div class="file-view-title">
          <template v-if="currentFileType === 'image'">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
                fill="#FFC60A"
              />
              <path
                opacity="0.8"
                d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
                fill="#D99904"
              />
              <path
                d="M8.372 10a1 1 0 0 0-1 1v.182a1 1 0 0 0 1 1h.181a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-.181Zm8.323 2.76a.6.6 0 0 1 1.04.408V18.5a.5.5 0 0 1-.5.5H7.401a.4.4 0 0 1-.307-.657l2.926-3.49a1 1 0 0 1 1.532 0l1.523 1.816 3.62-3.91Z"
                fill="#fff"
              />
            </svg>
          </template>
          <div class="file-view-title-content">
            <div class="ant-row">
              <span class="file-name main">{{ currentFile?.name }}</span>
            </div>
            <div class="ant-row">
              <span class="file-size other">{{ currentFile?.fileSize }}</span>
              <span class="user-name other">{{ currentFile?.createByName }}</span>
              <span class="time other">{{ currentFile?.createTime }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div
          ref="filePreviewModalBodyContent"
          :class="`${DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME}-modal-body`"
        >
          <ASpin
            v-show="loading"
            :spinning="loading"
            size="default"
            :tip="tavI18n('Tav.common.loadingText')"
          />
          <div v-show="!loading" class="file-view-content">
            <template v-if="supportWPS">
              <iframe id="wps-file-view" :src="currentFilePath" frameborder="0" />
            </template>
            <template v-else>
              <template v-if="currentFileType === 'image'">
                <AImage
                  :src="currentFilePath"
                  :style="{ display: 'none' }"
                  :preview="{ visible: true, getContainer: () => filePreviewModalBodyContent }"
                />
              </template>
              <template v-if="currentFileType === ''">
                <div class="empty">{{ tavI18n('Tav.file.message.1') }} {{ currentFileType }}</div>
              </template>
            </template>
          </div>
        </div>
      </template>
    </TaModal>
  </section>
</template>
