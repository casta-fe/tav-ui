<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, Teleport, watch /*useSlots, useAttrs*/ } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { TaForm, useForm } from '@tav-ui/components/form'
import { TaIcon } from '@tav-ui/components/icon'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import {
  DEFAULT_APIPARAM_BUSINESSPARAMSJSON,
  DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME,
  DEFAULT_FILEACTIONUPLOADLINK_ID,
  DEFAULT_FILE_CLASSNAME,
  DEFAULT_FILE_LINK_REGEXP_STRING,
  DEFAULT_UPLOADLINK_CLOSE_TIP,
  DEFAULT_UPLOADLINK_TIP,
} from '../../consts'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { validateUploadFileTypeCode } from '../../utils'
import { useMode } from './hooks'
import {
  type FileActionUploadLinkProps,
  fileActionUploadLinkEmits,
  fileActionUploadLinkProps,
} from './types'

defineOptions({
  name: 'TaFileActionUploadLink',
  inheritAttrs: false,
})

const elRef = ref<HTMLDivElement>()
const formRef = ref()
const props = defineProps(fileActionUploadLinkProps)
const emits = defineEmits(fileActionUploadLinkEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileActionUploadLink props 结合，同名 props 已 fileActionUploadLink props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileActionUploadLinkProps>(
  globalConfigProps,
  props,
  'TaFileActionUploadLink',
  {
    ...DEFAULT_APIPARAM_BUSINESSPARAMSJSON,
  }
)

const { createMessage } = useMessage()

const {
  apiActions: { uploadLinkApiOptions },
} = useMode({ mergedProps })

const [formRegister, { validate, getFieldsValue, resetFields }] = useForm({
  layout: 'vertical',
  showResetButton: false,
  showSubmitButton: false,
  showActionButtonGroup: false,
  rowProps: { gutter: 16 },
  schemas: [
    {
      field: 'name',
      label: tavI18n('Tav.file.columns.1'),
      required: true,
      component: 'Input',
      colProps: { span: 10 },
      componentProps: {
        maxLength: 100,
      },
    },
    {
      field: 'address',
      label: tavI18n('Tav.file.columns.9'),
      component: 'Input',
      colProps: { span: 10 },
      rules: [
        {
          required: true,
        },
        {
          pattern: DEFAULT_FILE_LINK_REGEXP_STRING,
          message: tavI18n('Tav.file.message.7'),
        },
      ],
      componentProps: {
        maxLength: 400,
      },
    },
    {
      field: 'btn',
      label: '　',
      component: 'Input',
      slot: 'submitBtn',
      colProps: { span: 4 },
    },
  ],
})

async function handleFormSubmitClick() {
  setDisable(true)
  setLoading(true)
  try {
    const formData = await validate()
    const { name, address } = JSON.parse(JSON.stringify(formData))
    emits('validateSuccessChange', { name, address })

    const options = uploadLinkApiOptions(mergedProps.value.apiParams, { name, address })
    if (!options) return
    await handleApi(options)
  } catch (e: any) {
    console.warn('[tavui TaFileActionUploadLink] form validate not passing', e)
    const formData = await getFieldsValue()
    const { name, address } = JSON.parse(JSON.stringify(formData))
    emits('validateFailureChange', { name, address })
  } finally {
    setDisable(false)
    setLoading(false)
  }
}

const { disable, setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: apiResult,
  error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
})
// upload fileList 变化后触发事件
watch(
  () => JSON.stringify(apiResult.value),
  async (curapiResult, preapiResult) => {
    if (curapiResult && curapiResult !== preapiResult) {
      emits('uploadedChange', JSON.parse(JSON.stringify(apiResult.value)))

      if (!apiError.value) {
        await resetFields()
        close()
      }
    }
  }
)

const formVisible = ref(mergedProps.value.formVisible)

watch(
  () => mergedProps.value.formVisible,
  (_formVisible) => {
    if (_formVisible) {
      if (!formVisible.value) open()
    } else {
      if (formVisible.value) close()
    }
  }
)

async function open() {
  if (mergedProps.value.validateTypeCode) {
    const validateFileTypeCodeResult = validateFileTypeCode()
    if (!validateFileTypeCodeResult) {
      close()
      return
    }
  }

  formVisible.value = true
  emits('formOpen')
  emits('update:formVisible', formVisible.value)
}

function close() {
  formVisible.value = false
  emits('formClose')
  emits('update:formVisible', formVisible.value)
}

function validateFileTypeCode() {
  const validateUploadFileTypeCodeResult = validateUploadFileTypeCode(
    mergedProps.value.apiParams.typeCode
  )
  if (!validateUploadFileTypeCodeResult) {
    createMessage.warn(tavI18n('Tav.file.message.5'))
    return false
  }
  return true
}

const formContainer = ref<HTMLElement>()
onMounted(() => {
  formContainer.value = mergedProps.value.getFormContainer?.()
})
onBeforeUnmount(() => {
  if (formContainer.value && formContainer.value.parentNode) {
    formContainer.value.parentNode.removeChild(formContainer.value)
  }
})

// 清空状态
async function cleanup() {
  formRef.value && (await resetFields())
  close()
}

watch(
  () => mergedProps.value.mode,
  async () => {
    await cleanup()
  }
)

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  cleanup,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILEACTIONUPLOADLINK_ID"
      ref="elRef"
      :class="DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME"
    >
      <TaButton
        :type="mergedProps.buttonType"
        :size="mergedProps.buttonSize"
        :disabled="disable"
        @click="() => (formVisible ? close() : open())"
      >
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
        {{ formVisible ? DEFAULT_UPLOADLINK_CLOSE_TIP(tavI18n) : DEFAULT_UPLOADLINK_TIP(tavI18n) }}
      </TaButton>

      <template v-if="formContainer && formVisible">
        <Teleport :to="formContainer">
          <section :class="`${DEFAULT_FILE_CLASSNAME}-header-actions-extra`">
            <TaForm
              ref="formRef"
              :class="`${DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME}-form`"
              @register="formRegister"
            >
              <template #submitBtn>
                <Tooltip placement="top">
                  <template #title>
                    <span>
                      <i
                        :class="`${DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME}-form-submit-btn-icon`"
                      />
                      {{ tavI18n('Tav.file.upload.3') }}
                    </span>
                  </template>
                  <TaButton
                    :class="`${DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME}-form-submit-btn`"
                    :loading="loading"
                    :disabled="disable"
                    style="display: flex; align-items: center; width: 100%; min-width: auto"
                    @click="handleFormSubmitClick"
                  >
                    <span
                      style="
                        width: 100%;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                    >
                      <i
                        :class="`${DEFAULT_FILEACTIONUPLOADLINK_CLASSNAME}-form-submit-btn-icon`"
                      />
                      {{ tavI18n('Tav.file.upload.3') }}
                    </span>
                  </TaButton>
                </Tooltip>
              </template>
            </TaForm>
          </section>
        </Teleport>
      </template>
    </section>
  </template>
</template>
