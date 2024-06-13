<template>
  <div>
    <h2>modal test example</h2>
    <TaModal
      :height="500"
      title="新增"
      :width="864"
      :destroy-on-close="true"
      @register="ModalRegister"
    >
      <TaForm @register="registerForm" />
      <template #footer>
        <TaButton :loading="state.loading" type="primary" @click="SubmitModal">确定</TaButton>
        <TaButton type="default" @click="CloseModal">取消</TaButton>
      </template>
    </TaModal>
    <TaButton type="default" @click="showModal">测试modalForm</TaButton>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive } from 'vue'
import { TaButton, TaForm, TaModal, useForm, useModal } from '@tav-ui/components'
import type { FormSchema } from '@tav-ui/components/form'
export default defineComponent({
  components: { TaModal, TaForm, TaButton },
  setup() {
    const state = reactive({
      loading: false,
    })
    const [ModalRegister, { openModal: OpenModal, closeModal: CloseModal }] = useModal()
    const schemas: FormSchema[] = [
      {
        field: 'name',
        component: 'Input',
        label: '名称',
        colProps: {
          span: 12,
        },
        rules: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'id',
        component: 'Input',
        label: 'ID',
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: '如需固定可以在这里输入，否则系统随机生成id',
        },
        rules: [
          {
            required: true,
          },
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: 'id只能由数字、字母、下划线组成',
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'type',
        component: 'Select',
        label: '类型',
        colProps: {
          span: 12,
        },
        valueType: 'number',
        componentProps: {
          options: [
            {
              label: '系统',
              value: 1,
            },
            {
              label: '业务',
              value: 2,
            },
            {
              label: '业务-审批',
              value: 3,
            },
          ],
        },
        rules: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'seq',
        component: 'InputNumber',
        label: '排序',
        colProps: {
          span: 12,
        },
        defaultValue: 0,
        componentProps: {
          min: 0,
          max: 999,
        },
        rules: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur',
          },
        ],
      },

      {
        field: 'remark',
        defaultValue: null,
        component: 'InputTextArea',
        label: '备注',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入备注信息',
          maxLength: 1000,
        },
      },
    ]
    const [registerForm, { validateFields, setFieldsValue }] = useForm({
      rowProps: { gutter: 16 },
      schemas,
      disabled: false,
      showActionButtonGroup: false,
    })
    const SubmitModal = () => {
      validateFields().then((res) => {
        console.log(res)
        state.loading = true
        setTimeout(() => {
          state.loading = false
        }, 3000)
      })
    }
    const showModal = () => {
      OpenModal()
      nextTick(() => {
        setFieldsValue({
          seq: 1,
        })
      })
    }
    return {
      ModalRegister,

      CloseModal,
      registerForm,
      SubmitModal,
      state,
      showModal,
    }
  },
})
</script>
