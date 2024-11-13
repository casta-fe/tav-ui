<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  /*useSlots, useAttrs*/
  shallowRef,
} from 'vue'
import {
  Tooltip as ATooltip,
  Upload as AUpload,
  type UploadProps as AUploadProps,
} from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useDisable, useLoading, useRequest } from '@tav-ui/components/file/src/hooks'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import {
  type ArgumentsOf,
  validateUploadFileEmptyName,
  validateUploadFileExt,
  validateUploadFileMaxCount,
  validateUploadFileName,
  validateUploadFileSize,
} from '@tav-ui/components/file/src/utils'
import TaFileUploadPreview from '../FileUploadPreview'
import {
  DEFAULT_FILEUPLOAD_CLASSNAME,
  DEFAULT_FILEUPLOAD_ID,
  DEFAULT_FILE_ACCEPT_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import {
  type FileUploadApiResponseRecord,
  type FileUploadEmits,
  fileUploadEmits,
  fileUploadProps,
} from './types'
import { useApi } from './use-api'

defineOptions({
  name: 'TaFileUpload',
  inheritAttrs: false,
})

const { createMessage } = useMessage()

const elRef = ref<HTMLDivElement>()
const props = defineProps(fileUploadProps)
const emits = defineEmits(fileUploadEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const computedProps = computed(() => {
  const _props = { ...props }

  if (_props.fileType === 'image') {
    _props.accept = DEFAULT_FILE_IMAGE_TYPES.map((t) => `.${t}`).join(',')
  } else {
    _props.accept = DEFAULT_FILE_OFFICE_TYPES.map((t) => `.${t}`).join(',')
  }

  return _props
})

const modelValue = computed<FileUploadApiResponseRecord[]>({
  get() {
    return computedProps.value.value
  },
  set(value) {
    emits('update:value', value)
    emits('change', value)
  },
})

// 统一内部 loading 状态
const _loading = ref(false)
const loading = computed({
  get() {
    return _loading
  },
  set(newLoading: any) {
    _loading.value = newLoading.value
  },
})

const { disable, setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: apiResult,
  error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
  loading,
})

const {
  apiActions: { uploadFileApiOptions, previewFileApiOptions },
} = useApi({ computedProps })

const fileList = shallowRef<any[]>([])
function setFileList(_fileList: any[]) {
  if (_fileList.length === 0) {
    // 清空
    fileList.value = []
  } else {
    // 合并
    fileList.value = [...fileList.value, ..._fileList]
  }
}
/** 利用改变量控制 AUpload 行为，将多次上传合并 */
const canUploadUnifiedFileList = ref(false)
/**
 * 重置 filelist 相关数据
 */
function resetFileList() {
  setFileList([])
  canUploadUnifiedFileList.value = false
}

function handleFileValidate(file: ArgumentsOf<AUploadProps['beforeUpload']>[0]) {
  const validateUploadFileEmptyNameResult = validateUploadFileEmptyName(file.name)
  if (!validateUploadFileEmptyNameResult) {
    createMessage.warn(`${file.name} ${tavI18n('Tav.file.upload.5')} \\s+`)
  }

  const validateUploadFileNameResult = validateUploadFileName(
    file.name,
    computedProps.value.nameRegExp
  )
  if (!validateUploadFileNameResult) {
    createMessage.warn(
      `${file.name} ${tavI18n('Tav.file.upload.5')} ${computedProps.value.nameRegExp.source}`
    )
  }

  const validateUploadFileExtResult = validateUploadFileExt(file.name, computedProps.value.accept)
  if (!validateUploadFileExtResult) {
    createMessage.warn(`${file.name} ${tavI18n('Tav.file.upload.6')}`)
  }

  if (
    validateUploadFileEmptyNameResult &&
    validateUploadFileNameResult &&
    validateUploadFileExtResult
  ) {
    return true
  }

  return false
}

function handleFilesValidate(files: Record<string, any>[]) {
  const validateFailureUploadFileSizeFiles = files.filter(
    (file) => !validateUploadFileSize(file, computedProps.value.sizeRange)
  )
  if (validateFailureUploadFileSizeFiles.length > 0) {
    createMessage.warn(
      `${tavI18n('Tav.file.upload.4')} ${validateFailureUploadFileSizeFiles
        .map((file) => `${file.name}:${Math.floor(file.size / 1024 / 1024)}MB`)
        .join()}${tavI18n('Tav.common.greater')}1GB`
    )

    resetFileList()
    return false
  }

  const validateUploadFileMaxCountResult = validateUploadFileMaxCount(
    fileList.value.length,
    computedProps.value.maxCount
  )
  if (!validateUploadFileMaxCountResult) {
    createMessage.warn(`${tavI18n('Tav.file.message.4')}: ${computedProps.value.maxCount}`)

    resetFileList()
    return false
  }

  return true
}

/**
 * 发送请求前操作二：
 * 对文件进行各种校验，维护 fileList（上传列表）数据方便调用接口时使用
 * @param args
 */
function beforeHandleApiAction2(...args: ArgumentsOf<AUploadProps['beforeUpload']>) {
  const [file, _] = args

  if (handleFileValidate(file)) {
    // 通过校验则加入 fileList（上传列表）数据
    setFileList([file])
  } else {
    // 阻止默认上传请求的发送
    return false
  }
}

/**
 * 发送请求前操作三：
 * 通过校验、判断维护的 fileList（上传列表）数据以及整合文件数据统一请求，调用接口
 * @param _
 */
async function beforeHandleApiAction3() {
  // 未选中文件或有正在上传文件则返回
  if (fileList.value.length === 0 || canUploadUnifiedFileList.value) {
    return
  }

  if (!handleFilesValidate(fileList.value)) {
    resetFileList()
    emits('validateFailureChange', fileList.value)
    return
  }

  emits('validateSuccessChange', fileList.value)
  canUploadUnifiedFileList.value = true

  if (computedProps.value.beforeUpload) {
    const beforeUploadResult = await computedProps.value.beforeUpload(fileList.value)
    if (!beforeUploadResult) {
      resetFileList()
      emits('validateFailureChange', fileList.value)
      return
    }
  }

  const options = uploadFileApiOptions(computedProps.value.apiParams, fileList.value, resetFileList)
  if (!options) {
    resetFileList()
    return
  }

  await handleApi(options)
  if (!apiError.value) {
    modelValue.value = [...modelValue.value, ...apiResult.value]
  } else {
    modelValue.value = []
  }
  resetFileList()
}

function handleChange(...args: ArgumentsOf<FileUploadEmits['AUploadChange']>) {
  // 尽管当前 file 没通过校验但是 change 事件会抛出当前没通过校验的 file & filelist
  emits('AUploadChange', ...args)
}

async function openFilePicker() {
  await nextTick()
  const uploadInnerButtonEl = elRef.value?.querySelector('[type="button"]') as
    | HTMLButtonElement
    | undefined
  uploadInnerButtonEl?.click()
}

const fileType = computed(() => (suffix: string) => {
  if (DEFAULT_FILE_ACCEPT_TYPES.includes(suffix)) {
    if (DEFAULT_FILE_OFFICE_TYPES.includes(suffix)) {
      if (
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[0]) ||
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[1])
      ) {
        return 'doc'
      } else if (
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[2]) ||
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[3])
      ) {
        return 'xls'
      } else if (
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[4]) ||
        suffix.includes(DEFAULT_FILE_OFFICE_TYPES[5])
      ) {
        return 'ppt'
      } else {
        return 'pdf'
      }
    } else if (DEFAULT_FILE_IMAGE_TYPES.includes(suffix)) {
      return 'image'
    } else {
      return 'unknown'
    }
  } else {
    return 'unknown'
  }
})

// 预览处理
const previewVisible = ref(false)
const previewFile = ref<FileUploadApiResponseRecord>({ url: '', name: '', suffix: '' })
async function handleViewBtnClick(row: FileUploadApiResponseRecord) {
  const { url, name, suffix } = row
  if (row.url) {
    previewVisible.value = !previewVisible.value

    if (computedProps.value.previewApi) {
      loading.value.value = true
      const options = previewFileApiOptions(row)
      if (!options) {
        loading.value.value = false
        return
      }

      await handleApi(options)
      if (!apiError.value) {
        previewFile.value = { ...previewFile.value, url, name, suffix }

        const supportWPS = !!apiResult.value.wps
        previewFile.value.previewSupportWPS = supportWPS
        if (supportWPS) {
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
          } = apiResult.value

          const options = {
            officeType,
            fileId,
            appId: wpsAppId,
            token,
            suffix,
            fileName,
            ...(fileSize ? { fileSize } : {}),
            ...(createByName ? { userName: createByName } : {}),
            ...(createTime ? { time: `${new Date(createTime).getTime()}` } : {}),
            watermarker: watermark,
            /** 前端自定义参数 from: 'desktop'|'mobile'，用来区分 pc/小程序 */
            from: 'desktop',
          }

          const params = [] as string[]
          for (const [k, v] of Object.entries(options)) {
            params.push(`${k}=${v}`)
          }

          previewFile.value.previewUrl = `${pageUrl}/wps-file-view/?${encodeURIComponent(
            params.join('&').replace(' ', '%20').replace('+', '%2B')
          )}`
        } else {
          previewFile.value.previewUrl = apiResult.value.onlineUrl
        }
      } else {
        return
      }
      loading.value.value = false
    } else {
      previewFile.value = { ...previewFile.value, url, name, suffix }
      return row
    }
  }
}

// 删除处理
function handleDeleteBtnClick(row: FileUploadApiResponseRecord) {
  modelValue.value = modelValue.value.filter((uploadedFile) => uploadedFile.url !== row.url)
}

// 清空状态
function cleanup() {
  resetFileList()
}

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  openFilePicker,
  cleanup,
})
</script>

<template>
  <section :id="DEFAULT_FILEUPLOAD_ID" ref="elRef" :class="DEFAULT_FILEUPLOAD_CLASSNAME">
    <div
      :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-content ${
        !computedProps.keepUploadVisible && modelValue.length > 0 ? 'has-files' : ''
      }`"
    >
      <AUpload
        list-type="picture-card"
        :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-upload`"
        :file-list="[]"
        :accept="computedProps.accept"
        :multiple="computedProps.multiple"
        :max-count="computedProps.maxCount"
        :show-upload-list="false"
        :name="computedProps.name"
        :open-file-dialog-on-click="
          loading.value ? false : disable ? false : computedProps.openFileDialogOnClick
        "
        :before-upload="beforeHandleApiAction2"
        :custom-request="beforeHandleApiAction3"
        @change="handleChange"
      >
        <div>
          <loading-outlined v-if="loading.value" />
          <plus-outlined v-else />
          <div :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-upload-text`">
            {{ tavI18n('Tav.file.upload.1') }}
          </div>
        </div>
      </AUpload>
      <div v-if="modelValue.length > 0" :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-files`">
        <div
          v-for="uploadedFile in modelValue"
          :key="uploadedFile.url"
          :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file`"
          :style="{
            ...(props.imageAspectRatio && props.imageWidth
              ? {
                  width: 'auto',
                  height: 'auto',
                }
              : {}),
          }"
        >
          <div :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-info`">
            <div
              :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-thumbnail`"
              :style="
                fileType(uploadedFile.suffix) !== 'image'
                  ? {
                      display: 'flex',
                      'flex-direction': 'column',
                      gap: '2px',
                    }
                  : {}
              "
            >
              <i
                v-if="fileType(uploadedFile.suffix) !== 'image'"
                :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-icon icon--${fileType(
                  uploadedFile.suffix
                )}`"
              />
              <template v-else>
                <div
                  v-if="props.imageAspectRatio && props.imageWidth"
                  class="aspect-ratio-wrapper"
                  :style="{
                    ...(props.imageWidth ? { width: `${props.imageWidth}px !important` } : {}),
                  }"
                >
                  <div :class="`aspect-ratio aspect-ratio--${props.imageAspectRatio}`">
                    <img
                      :src="uploadedFile.url"
                      width="240"
                      height="240"
                      :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-icon ${
                        props.imageAspectRatio ? 'aspect-ratio-image' : ''
                      }`"
                      :style="{
                        'object-fit': `${
                          props.keepImageOriginalAspectRatio ? 'contain' : 'cover'
                        } !important`,
                      }"
                    />
                  </div>
                </div>
                <img
                  v-else
                  :src="uploadedFile.url"
                  width="240"
                  height="240"
                  :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-icon`"
                  :style="{
                    'object-fit': `${
                      props.keepImageOriginalAspectRatio ? 'contain' : 'cover'
                    } !important`,
                  }"
                />
              </template>
            </div>
          </div>
          <ATooltip placement="bottom">
            <template #title>
              <span>{{ uploadedFile.name }}</span>
            </template>
            <div :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-title`">
              {{ uploadedFile.name }}
            </div>
          </ATooltip>
          <div :class="`${DEFAULT_FILEUPLOAD_CLASSNAME}-file-actions`">
            <button
              class="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only"
              :title="tavI18n('Tav.file.upload.7')"
              type="button"
              :loading="loading.value"
              @click="() => handleViewBtnClick(uploadedFile)"
            >
              <span role="img" aria-label="eye" class="anticon anticon-eye">
                <svg
                  focusable="false"
                  class=""
                  data-icon="eye"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  viewBox="64 64 896 896"
                >
                  <path
                    d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
                  />
                </svg>
              </span>
            </button>
            <button
              class="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only"
              :title="tavI18n('Tav.file.upload.8')"
              type="button"
              @click="() => handleDeleteBtnClick(uploadedFile)"
            >
              <span role="img" aria-label="delete" class="anticon anticon-delete">
                <svg
                  focusable="false"
                  class=""
                  data-icon="delete"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  viewBox="64 64 896 896"
                >
                  <path
                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <TaFileUploadPreview
      v-model:visible="previewVisible"
      :file="previewFile"
      :image-aspect-ratio="props.previewImageAspectRatio"
    />
  </section>
</template>
