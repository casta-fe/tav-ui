<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch /*useSlots, useAttrs*/ } from 'vue'
import {
  type FormActionType,
  type FormSchema,
  TaButton,
  TaForm,
  TaModal,
  useForm,
} from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import {
  DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME,
  DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_ID,
  DEFAULT_FILE_LINK_REGEXP_STRING,
} from '../../consts'
import { editorCustomUploadlinkModalEmits, editorCustomUploadlinkModalProps } from './types'

defineOptions({
  name: 'TaEditorCustomUploadlinkModal',
  inheritAttrs: false,
})

const props = defineProps(editorCustomUploadlinkModalProps)
const emits = defineEmits(editorCustomUploadlinkModalEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const uploadedLink = shallowRef<{
  url: string
  alt?: string
}>()
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
            uploadedLink.value = {
              ...uploadedLink.value,
              url,
            }

            // formActionType.setFieldsValue(
            //   {
            //     originalWidth: uploadedFile.value.originalWidth,
            //     originalHeight: uploadedFile.value.originalHeight,
            //   },
            //   false
            // )
          } catch (error) {
            uploadedLink.value = undefined
            await formActionType.scrollToField('url')
          }
        },
      }
    },
  },
  {
    field: 'urlLocation',
    label: '打开方式',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
      },
    ],
    componentProps: {
      options: [
        {
          label: '新窗口',
          value: '0',
        },
        {
          label: '当前窗口',
          value: '1',
        },
      ],
    },
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24,
    },
    componentProps: {
      maxLength: 150,
    },
  },
]

const [formRegister, formActions] = useForm({
  rowProps: { gutter: 16 },
  schemas: formSchemas,
  disabled: props.disabled,
})

async function getUploadlinkModalValue() {
  let value = {}
  try {
    const result = await formActions.validate()
    uploadedLink.value = {
      ...uploadedLink.value,
      ...result,
    }
    value = { ...uploadedLink.value }
  } catch (error: any) {
    uploadedLink.value = undefined
    const firstErrorFieldName = error?.errorFields?.[0]?.name?.[0]
    firstErrorFieldName && formActions.scrollToField(firstErrorFieldName)
  }

  return value
}

async function confirm() {
  const value = await getUploadlinkModalValue()
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
  getUploadlinkModalValue,
  cleanup,
})
</script>

<template>
  <section
    :id="DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_ID"
    :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME}-wrapper`"
  >
    <TaModal
      :visible="modalVisible"
      title="TaEditorCustomUploadlinkModal"
      :width="props.width"
      :min-height="400"
      :wrap-class-name="`${DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME} ${
        props.wrapClassName ?? ''
      }`"
      :destroy-on-close="props.destroyOnClose"
      :mask-closable="props.maskClosable"
      :get-popup-container="props.getPopupContainer"
      @cancel="close"
    >
      <template #title>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME}-title`">插入链接</div>
      </template>
      <template #default>
        <div :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME}-body`">
          <TaForm
            ref="formRef"
            :class="`${DEFAULT_EDITOR_CUSTOM_UPLOADLINK_MODAL_CLASSNAME}-form`"
            @register="formRegister"
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
