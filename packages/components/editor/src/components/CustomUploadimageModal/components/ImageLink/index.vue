<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef /*useSlots, useAttrs*/ } from 'vue'
import { Image as AImage } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { type FormActionType, type FormSchema, TaForm, useForm } from '@tav-ui/components'
import {
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME,
  DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_ID,
  DEFAULT_FILE_LINK_REGEXP_STRING,
} from '../../../../consts'
import { type FileUploadImageResponseRecord } from '../../../../typings'
import { editorUploadimageLinkProps } from './types'

defineOptions({
  name: 'TaEditorCustomUploadImageModalTabImageLink',
  inheritAttrs: false,
})

const props = defineProps(editorUploadimageLinkProps)
// const emits = defineEmits(fileLogEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const uploadedFile = shallowRef<FileUploadImageResponseRecord>()
const formRef = ref<FormActionType>()
const formSchemas: FormSchema[] = [
  {
    field: 'url',
    label: '链接',
    component: 'Input',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
      },
      {
        pattern: DEFAULT_FILE_LINK_REGEXP_STRING,
        message: tavI18n('Tav.file.message.7'),
      },
    ],
    componentProps({ formActionType }) {
      return {
        maxLength: 400,
        async onBlur() {
          try {
            const { url } = await formActionType.validateFields(['url'])
            uploadedFile.value = {
              ...uploadedFile.value,
              imageOriginUrl: url,
              imageCompressUrl: url,
              imageScaleUrl: url,
            }
            const imgEl = new Image()
            imgEl.src = url
            imgEl.onload = function () {
              uploadedFile.value = {
                ...uploadedFile.value,
                originalWidth: imgEl.naturalWidth,
                originalHeight: imgEl.naturalHeight,
              }

              formActionType.setFieldsValue(
                {
                  originalWidth: uploadedFile.value.originalWidth,
                  originalHeight: uploadedFile.value.originalHeight,
                },
                false
              )
            }
          } catch (error) {
            uploadedFile.value = undefined
            await formActionType.scrollToField('url')
          }
        },
      }
    },
  },
  {
    field: 'alt',
    label: '描述',
    component: 'Input',
    colProps: {
      span: 24,
    },
    componentProps: {
      maxLength: 150,
    },
  },
  {
    field: 'originalWidth',
    label: '宽度',
    component: 'InputNumber',
    colProps: {
      span: 12,
    },
    componentProps: {
      min: 1,
      addonAfter: 'px',
    },
  },
  {
    field: 'originalHeight',
    label: '高度',
    component: 'InputNumber',
    colProps: {
      span: 12,
    },
    componentProps: {
      min: 1,
      addonAfter: 'px',
    },
  },
]

const [formRegister, formActions] = useForm({
  rowProps: { gutter: 16 },
  schemas: formSchemas,
  disabled: props.disabled,
})

// 预览处理
const previewVisible = ref(false)
function setPreviewVisible(value: boolean) {
  previewVisible.value = value
}
const activeImageUrlPath = ref('')
function handleViewBtnClick() {
  if (uploadedFile.value?.imageOriginUrl) {
    activeImageUrlPath.value = uploadedFile.value.imageOriginUrl
    setPreviewVisible(true)
  }
}

async function handleDeleteBtnClick() {
  uploadedFile.value = undefined
  await formActions.resetFields()
}

// 清空状态
async function cleanup() {
  await formActions.resetFields()
}

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  getValues: async () => {
    let values = [] as any[]
    try {
      const result = await formActions.validate()
      uploadedFile.value = {
        ...uploadedFile.value,
        ...result,
      }
      values = [uploadedFile.value]
    } catch (error: any) {
      uploadedFile.value = undefined
      const firstErrorFieldName = error?.errorFields?.[0]?.name?.[0]
      firstErrorFieldName && formActions.scrollToField(firstErrorFieldName)
    }

    return values
  },
  cleanup,
})
</script>

<template>
  <section
    :id="DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_ID"
    :class="DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME"
  >
    <div
      v-if="uploadedFile"
      :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME}-file`"
    >
      <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME}-file-info`">
        <img
          :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME}-file-thumbnail`"
          :src="uploadedFile.imageScaleUrl"
        />
      </div>
      <div
        :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME}-file-actions`"
      >
        <button
          class="ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only"
          title="预览文件"
          type="button"
          @click="handleViewBtnClick"
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
          title="删除文件"
          type="button"
          @click="handleDeleteBtnClick"
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
    <TaForm
      ref="formRef"
      :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADIMAGE_MODAL_TAB_IMAGE_LINK_CLASSNAME}-form`"
      @register="formRegister"
    />
    <AImage
      :src="activeImageUrlPath"
      :preview="{ visible: previewVisible, onVisibleChange: setPreviewVisible }"
      :style="{ display: 'none' }"
    />
  </section>
</template>
