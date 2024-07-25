<script setup lang="ts">
import { type UnwrapRef, reactive, ref /*useSlots, useAttrs*/ } from 'vue'
// import { useGlobalConfigProps, useMergedProps } from '../../../../hooks'
// import { type GlobalConfigFileProps } from '../../../../typings'
import { Input as VxeInput } from 'vxe-table'
import { TaForm, useForm } from '@tav-ui/components/form'
import { tavI18n } from '@tav-ui/locales'
import {
  DEFAULT_FILE_LINK_REGEXP_STRING,
  DEFAULT_ROWEDITOR_CLASSNAME,
  DEFAULT_ROWEDITOR_ID,
} from '../../../../consts'
import { type FileActionUploadApiResponseRecord } from '../../../../typings'
import {
  type FileTableRowEditorInstance,
  // fileTableRowEditorEmits,
  fileTableRowEditorProps,
  // type FileTableRowEditorProps,
} from './types'

defineOptions({
  name: 'TaFileTableRowEditor',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileTableRowEditorInstance['elRef']>>()
const props = defineProps(fileTableRowEditorProps)
// const emits = defineEmits(fileTableRowEditorEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// // 将 globalconfig 与 ROWEDITOR props 结合，同名 props 已 ROWEDITOR props 为主
// const globalConfigProps = useGlobalConfigProps()
// const mergedProps = useMergedProps<GlobalConfigFileProps, FileTableRowEditorProps>(
//   globalConfigProps,
//   props,
//   ['fileTableRowEditor']
// )

const state = reactive({
  name: props.row?.name,
  address: props.row?.address,
})

const [formRegister] = useForm({
  layout: 'vertical',
  // labelWidth: 80,
  showResetButton: false,
  showSubmitButton: false,
  // showAdvancedButton: false,
  showActionButtonGroup: false,
  rowProps: { gutter: 16 },
  schemas: [
    {
      field: 'name',
      label: '',
      required: true,
      component: 'Input',
      defaultValue: state.name,
      colProps: { span: 12 },
      componentProps: {
        maxLength: 100,
        onPressEnter: ({ code }: any) => {
          'Enter' === code && props.onEnter?.()
        },
        onBlur: handleEditResult,
        onChange(e: { target: { value: string } }) {
          state.name = e.target.value
        },
      },
    },
    {
      field: 'address',
      label: '',
      component: 'Input',
      defaultValue: state.address,
      colProps: { span: 12 },
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
        onPressEnter: ({ code }: any) => {
          'Enter' === code && props.onEnter?.()
        },
        onBlur: handleEditResult,
        onChange(e: { target: { value: string } }) {
          const value = e.target.value
          DEFAULT_FILE_LINK_REGEXP_STRING.test(value) && (state.address = value)
        },
      },
    },
  ],
})

function handleEditResult() {
  const payload = {
    id: props.row?.id,
    name: state.name,
  } as Partial<FileActionUploadApiResponseRecord>

  props.row?.hyperlink && (payload.address = state.address)

  return props.onChange?.(payload)
}

defineExpose({
  elRef,
})
</script>

<template>
  <section :id="DEFAULT_ROWEDITOR_ID" ref="elRef" :class="DEFAULT_ROWEDITOR_CLASSNAME">
    <template v-if="props.row?.hyperlink !== 1">
      <VxeInput
        :model-value="state.name"
        :style="{
          display: 'inline-block',
          width: 'calc(100% - 22px)',
        }"
        @change="
          ({ value }) => {
            state.name = value
          }
        "
        @keydown="
          ({ $event: { code } }) => {
            'Enter' === code && props.onEnter?.()
          }
        "
        @blur="handleEditResult"
      />
    </template>
    <template v-else>
      <TaForm class="upload-inline-form" @register="formRegister" />
    </template>
  </section>
</template>
