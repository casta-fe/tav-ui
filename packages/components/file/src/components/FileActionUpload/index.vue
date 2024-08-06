<script setup lang="ts">
import {
  type UnwrapRef,
  getCurrentInstance,
  nextTick,
  ref,
  watch,
  useSlots /* useAttrs*/,
} from 'vue'
import { Upload as AUpload, type UploadProps as AUploadProps } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { TaIcon } from '@tav-ui/components/icon'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import {
  type ArgumentsOf,
  validateUploadFileEmptyName,
  validateUploadFileExt,
  validateUploadFileMaxCount,
  validateUploadFileName,
  validateUploadFileSize,
  validateUploadFileTypeCode,
} from '../../utils'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import {
  DEFAULT_APIPARAM_BUSINESSPARAMSJSON,
  DEFAULT_FILEACTIONUPLOAD_CLASSNAME,
  DEFAULT_FILEACTIONUPLOAD_ID,
  DEFAULT_UPLOAD_TIP,
} from '../../consts'
import { useFileList, useMode } from './hooks'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  type FileActionUploadProps,
  fileActionUploadEmits,
  fileActionUploadProps,
} from './types'

const { createMessage } = useMessage()

defineOptions({
  name: 'TaFileActionUpload',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileActionUploadInstance['elRef']>>()
const props = defineProps(fileActionUploadProps)
const emits = defineEmits(fileActionUploadEmits)
const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileActionUploadProps>(
  globalConfigProps,
  props,
  'TaFileActionUpload',
  {
    ...DEFAULT_APIPARAM_BUSINESSPARAMSJSON,
  }
)

const {
  apiActions: { uploadApiOptions, updateApiOptions },
  validateActions: { withValidateTypeCode },
} = useMode({ mergedProps })

const instance = getCurrentInstance()

// // Embedded in the form, just use the hook binding to perform form verification
// const [state] = useRuleFormItem(props, 'value', 'change', emitData)
// const fileList = ref<Exclude<FileActionUploadProps['fileList'], undefined>>(props.fileList || [])
const { fileList, setFileList } = useFileList()

/** 利用改变量控制 AUpload 行为，将多次上传合并 */
const canUploadUnifiedFileList = ref(false)
/**
 * 重置 filelist 相关数据
 */
function resetFileList() {
  setFileList([])
  canUploadUnifiedFileList.value = false
}

const { disable, setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: apiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
})

// upload fileList 变化后触发事件
watch(
  () => JSON.stringify(apiResult.value),
  (curapiResult, preapiResult) => {
    if (
      curapiResult &&
      curapiResult !== preapiResult
      // && !curapiResult.includes('__id') // manual fixed vxetable bug
    ) {
      emits('uploadedChange', JSON.parse(JSON.stringify(apiResult.value)))
    }
  }
)

function handleFileValidate(file: ArgumentsOf<AUploadProps['beforeUpload']>[0]) {
  const validateUploadFileEmptyNameResult = validateUploadFileEmptyName(file.name)
  if (!validateUploadFileEmptyNameResult) {
    createMessage.warn(`${file.name} ${tavI18n('Tav.file.upload.5')} \\s+`)
  }

  const validateUploadFileNameResult = validateUploadFileName(
    file.name,
    mergedProps.value.nameRegExp
  )
  if (!validateUploadFileNameResult) {
    createMessage.warn(
      `${file.name} ${tavI18n('Tav.file.upload.5')} ${mergedProps.value.nameRegExp.source}`
    )
  }

  const validateUploadFileExtResult = validateUploadFileExt(file.name, mergedProps.value.accept)
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
    (file) => !validateUploadFileSize(file, mergedProps.value.sizeRange)
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
    fileList.value.length + apiResult.value.length,
    mergedProps.value.maxCount
  )
  if (!validateUploadFileMaxCountResult) {
    createMessage.warn(`${tavI18n('Tav.file.message.4')} ${mergedProps.value.maxCount}`)

    resetFileList()
    return false
  }

  return true
}

/**
 * 发送请求前操作一：
 * 判断 typecodes，如果没传则不让打开文件选择窗口
 * @param e
 */
function beforeHandleApiAction1(e: Event) {
  if (withValidateTypeCode(instance)) {
    const validateUploadFileTypeCodeResult = validateUploadFileTypeCode(
      mergedProps.value.apiParams.typeCode
    )
    if (!validateUploadFileTypeCodeResult) {
      createMessage.warn(tavI18n('Tav.file.message.5'))
      resetFileList()
      e.stopPropagation()
    }
  }
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
  if (
    !(
      handleFilesValidate(fileList.value) &&
      fileList.value.length > 0 &&
      !canUploadUnifiedFileList.value
    )
  ) {
    resetFileList()
    emits('validateFailureChange', fileList.value)
    return
  }
  emits('validateSuccessChange', fileList.value)

  canUploadUnifiedFileList.value = true

  if (mergedProps.value.beforeUpload) {
    const beforeUploadResult = await mergedProps.value.beforeUpload(
      fileList.value,
      mergedProps.value.apiParams.typeCode
    )
    if (!beforeUploadResult) {
      resetFileList()
      return
    }
  }

  let options
  if (mergedProps.value.updateFile) {
    // 如果传入了 updatefile 则走更新逻辑
    options = updateApiOptions(
      mergedProps.value.apiParams,
      fileList.value,
      mergedProps.value.updateFile,
      resetFileList
    )
  } else {
    // 如果未传入 updatefile 则走上传逻辑
    options = uploadApiOptions(mergedProps.value.apiParams, fileList.value, resetFileList)
  }
  if (!options) {
    resetFileList()
    return
  }
  await handleApi(options)
}

function handleChange(...args: ArgumentsOf<FileActionUploadEmits['change']>) {
  // 尽管当前 file 没通过校验但是 change 事件会抛出当前没通过校验的 file & filelist
  emits('change', ...args)
}

async function openFilePicker() {
  await nextTick()
  const uploadInnerButtonEl = elRef.value?.querySelector('[type="button"]') as
    | HTMLButtonElement
    | undefined
  uploadInnerButtonEl?.click()
}

defineExpose({
  elRef,
  openFilePicker,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILEACTIONUPLOAD_ID"
      ref="elRef"
      :class="DEFAULT_FILEACTIONUPLOAD_CLASSNAME"
    >
      <!-- 因为用不上预览列表，所以这里传空数组。:fileList="[]" -->
      <AUpload
        ref="AUploadRef"
        :file-list="[]"
        :multiple="mergedProps.updateFile ? false : mergedProps.multiple"
        :max-count="mergedProps.maxCount"
        :show-upload-list="false"
        :name="mergedProps.name"
        :open-file-dialog-on-click="
          loading ? false : disable ? false : mergedProps.openFileDialogOnClick
        "
        :before-upload="beforeHandleApiAction2"
        :custom-request="beforeHandleApiAction3"
        @change="handleChange"
      >
        <template v-if="slots['FileActionUploadButton']">
          <slot
            name="FileActionUploadButton"
            v-bind="{ disabled: disable, loading, validate: beforeHandleApiAction1 }"
          />
        </template>
        <template v-else>
          <TaButton :disabled="disable" @click="beforeHandleApiAction1">
            <template v-if="loading">
              <span class="ant-btn-loading-icon" style="">
                <span role="img" aria-label="loading" class="anticon anticon-loading">
                  <svg
                    focusable="false"
                    class="anticon-spin"
                    data-icon="loading"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
                    />
                  </svg>
                </span>
              </span>
            </template>
            <template v-else>
              <TaIcon :icon="mergedProps.icon" />
            </template>
            {{ DEFAULT_UPLOAD_TIP(tavI18n) }}
          </TaButton>
        </template>
      </AUpload>
    </section>
  </template>
</template>
