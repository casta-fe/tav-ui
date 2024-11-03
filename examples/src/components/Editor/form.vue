<script setup lang="ts">
import { ref } from 'vue'
import { type FormActionType, type FormSchema, TaForm, useForm } from '@tav-ui/components/form'
import { replaceFileUrlVarsToValue } from '@tav-ui/components/editor'
import {
  DEFAULT_FILE_IMAGE_TYPES,
  transformUrlToFileUploadPreviewPropFile,
} from '@tav-ui/components/file'
import { previewEditorWPSFile, taUploadProvideData } from '../TaUpload/provideData'

const props = defineProps({
  uploadImageVars: Object,
})

const formRef = ref<FormActionType>()
const formSchemas: FormSchema[] = [
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
    // rules: [
    //   {
    //     required: true,
    //   },
    // ],
    componentProps: {
      maxLength: 150,
    },
  },
  {
    field: 'imageUrl',
    label: '封面图片',
    component: 'FileUpload',
    colProps: {
      span: 24,
    },
    required: true,
    // helpMessage: '请上传 4:3图片',
    subLabel: '请上传 4:3图片',
    componentProps: {
      apiParams: {
        isCompress: 1,
        isScale: 1,
        scaleWidth: 240,
        scaleHeight: 240,
      },
      previewApi: previewEditorWPSFile,
      api: taUploadProvideData.uploadEditorImage,
      afterApi: async (apiData: any) => {
        const { data: uploadImageVars, success } = await taUploadProvideData.uploadEditorImageVars()
        if (uploadImageVars && success) {
          return apiData.map((uploadedFile, idx) => {
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
                handledUrlUploadedFile['imageOriginUrl'],
                DEFAULT_FILE_IMAGE_TYPES
              ),
            }

            return handledUrlUploadedFile
          })
        }
        return Promise.reject()
      },
    },
  },
  {
    field: 'richtext',
    label: '富文本',
    component: 'Editor',
    defaultValue: '123',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
      },
    ],
    componentProps: {
      placeholder: '请输入...',
      height: 500,
      // onBlur(...args: any[]) {
      //   console.log('🚀 ~ onBlur ~ args:', args, args[0].target.value)
      // },
      // onChange(...args: any[]) {
      //   console.log('🚀 ~ onChange ~ args:', args, args[0].target.value)
      // },
    },
  },
]

const [formRegister, formActions] = useForm({
  rowProps: { gutter: 16 },
  schemas: formSchemas,
})

async function handleClick() {
  try {
    const result = await formActions.validate()
    console.log('🚀 ~ handleClick ~ result:', {
      ...result,
      richtext: replaceFileUrlVarsToValue(result.richtext, props.uploadImageVars),
    })
  } catch (error: any) {
    console.warn(JSON.stringify(error))
  }
}
</script>

<template>
  <section class="ta-editor-form-test" style="width: 80%; height: 60%; margin: 20px auto">
    <TaForm ref="formRef" @register="formRegister" />
    <button @click="handleClick">get value</button>
  </section>
</template>
