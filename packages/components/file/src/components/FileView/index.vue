<script setup lang="ts">
import { computed, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { Button as AButton, Image as AImage } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { TaModal } from '@tav-ui/components/modal'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import {
  DEFAULT_FILEVIEW_CLASSNAME,
  DEFAULT_FILEVIEW_ID,
  DEFAULT_FILE_IGNORE_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type GlobalConfigFileProps } from '../../typings'
import { useMode } from './hooks'
import { type FileViewInstance, type FileViewProps, fileViewEmits, fileViewProps } from './types'

defineOptions({
  name: 'TaFileView',
  inheritAttrs: false,
})

const elRef = ref<FileViewInstance['elRef']>()
const props = defineProps(fileViewProps)
const emits = defineEmits(fileViewEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileView props 结合，同名 props 已 fileView props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<GlobalConfigFileProps, FileViewProps>(globalConfigProps, props, [
  'fileView',
])

const { createMessage } = useMessage()
const supportWPS = ref(false)
const currentFilePath = ref('')
const fileViewModalBodyContent = ref<HTMLElement>()

const { setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: ApiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
  responseDataType: 'object',
})
watch(
  () => ApiResult.value,
  (curview) => {
    if (curview) {
      supportWPS.value = !!curview.wps
      if (supportWPS.value) {
        const {
          createByName,
          createTime,
          fileId,
          fileName,
          fileSize,
          officeType,
          pageUrl,
          suffix,
          token,
          watermark,
          wpsAppId,
        } = curview

        const options = {
          officeType,
          fileId,
          appId: wpsAppId,
          token,
          suffix,
          fileName,
          fileSize,
          userName: createByName,
          time: `${new Date(createTime).getTime()}`,
          watermarker: watermark,
          from: 'desktop',
        }

        currentFilePath.value = `${pageUrl}/wps-file-view/?${encodeURIComponent(
          new URLSearchParams({ ...options }) as unknown as string
        )}`
      } else {
        currentFilePath.value = curview.onlineUrl
      }
    }
  }
)

const {
  apiActions: { viewApiOptions },
} = useMode({ mergedProps })

const currentFile = computed(() => mergedProps.value.file!)
const currentFileType = computed(() => {
  if (DEFAULT_FILE_OFFICE_TYPES.find((t) => currentFile.value.suffix === t)) {
    return 'office'
  }
  if (DEFAULT_FILE_IMAGE_TYPES.find((t) => currentFile.value.suffix === t)) {
    return 'image'
  }
  return ''
})

const modalVisible = ref(mergedProps.value.visible)

watch(
  () => mergedProps.value.visible,
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

  const options = viewApiOptions(mergedProps.value.apiParams, currentFile.value)
  if (!options) return
  await handleApi(options)
}

function close() {
  modalVisible.value = false
  emits('close')
  emits('update:visible', modalVisible.value)
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

defineExpose({
  elRef,
})
</script>

<template>
  <section :id="DEFAULT_FILEVIEW_ID" ref="elRef" :class="DEFAULT_FILEVIEW_CLASSNAME">
    <TaModal
      :visible="modalVisible"
      title="TaFileView"
      :width="mergedProps.width"
      :wrap-class-name="`${DEFAULT_FILEVIEW_CLASSNAME}-modal ${
        supportWPS ? 'hide-modal-header' : ''
      } ${mergedProps.wrapClassName ?? ''}`"
      :destroy-on-close="mergedProps.destroyOnClose"
      :mask-closable="mergedProps.maskClosable"
      :get-popup-container="mergedProps.getPopupContainer"
      :footer="null"
      :loading="loading"
      :loading-tip="tavI18n('Tav.common.loadingText')"
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
              <span class="file-name main">{{
                currentFile?.name + '.' + currentFile?.suffix
              }}</span>
            </div>
            <div class="ant-row">
              <span class="file-size other">{{ currentFile?.fileSize }}</span>
              <span class="user-name other">{{ currentFile?.createByName }}</span>
              <span class="time other">{{ currentFile?.createTime }}</span>
            </div>
          </div>
        </div>
      </template>
      <div ref="fileViewModalBodyContent" class="file-view-content">
        <template v-if="supportWPS">
          <iframe id="wps-file-view" :src="currentFilePath" frameborder="0" />
        </template>
        <template v-else>
          <template v-if="currentFileType === 'image'">
            <AImage
              :style="{ display: 'none' }"
              :src="currentFilePath"
              :preview="{ visible: true, getContainer: fileViewModalBodyContent }"
            />
          </template>
          <template v-if="currentFileType === ''">
            <div class="empty">{{ tavI18n('Tav.file.message.1') }} {{ currentFileType }}</div>
          </template>
        </template>
      </div>
    </TaModal>
  </section>
</template>
