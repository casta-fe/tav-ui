<template>
  <div>
    <h2>modal test example</h2>
    <TaModal title="新增" width="864px" :destroy-on-close="true" @register="ModalRegister">
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
import { defineComponent, nextTick, reactive } from 'vue';
import { useForm, useModal } from '../../../../dist/index.esm.js';
import type { FormSchema } from '../../../../dist/types/components/form/src/types/form.js';
export default defineComponent({
  setup() {
    const state = reactive({
      loading: false,
    });
    const [ModalRegister, { openModal: OpenModal, closeModal: CloseModal }] = useModal();
    const schemas: FormSchema[] = [
      {
        field: 'fundManagerName',
        component: 'Input',
        label: '基金管理人名称',
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: '请输入名称',
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'companyType',
        component: 'Select',
        label: '企业类型',
        required: true,
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: '请选择企业类型',
          options: [
            {
              label: 'slslsl',
              value: 'slsl',
            },
          ],
        },
      },
      {
        field: 'registrationNumber',
        component: 'Input',
        label: '基金业协会登记编号',
        colProps: {
          span: 12,
        },
        componentProps: { placeholder: '请输入登记编号' },
        required: false,
      },
      {
        field: 'registrationTime',
        component: 'DatePicker',
        label: '基金业协会登记日期',
        colProps: {
          span: 12,
        },
        required: false,
        componentProps: {
          placeholder: '请选择日期',
          // showTime: true, HH:mm:ss
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      {
        field: 'institutionsIntroduce',
        component: 'InputTextArea',
        label: '机构简介',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入机构简介',
        },
      },
      {
        field: 'legalPerson',
        component: 'Input',
        label: '法定代表人',
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: '请输入法定代表人',
        },
      },
      {
        field: 'establishedDate',
        component: 'DatePicker',
        label: '成立日期',
        colProps: {
          span: 12,
        },
        componentProps: {
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          placeholder: '请选择成立日期',
        },
      },
      {
        field: 'registeredAddress',
        component: 'InputTextArea',
        label: '注册地址',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入注册地址',
        },
      },
      {
        field: 'businessAddress',
        component: 'InputTextArea',
        label: '办公地址',
        colProps: {
          span: 24,
        },
        componentProps: {
          placeholder: '请输入办公地址',
        },
      },
      {
        field: 'riskControlPrincipal',
        component: 'MemberSelect',
        label: '风控负责人',
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: '请选择风控负责人',
        },
      },
    ];
    const [registerForm, { validateFields, setFieldsValue }] = useForm({
      rowProps: { gutter: 16 },
      schemas,
      disabled: false,
      showActionButtonGroup: false,
    });
    const SubmitModal = () => {
      validateFields().then((res) => {
        console.log(res);
        state.loading = true;
        setTimeout(() => {
          state.loading = false;
        }, 3000);
      });
    };
    const showModal = () => {
      OpenModal();
      nextTick(() => {
        setFieldsValue({
          businessAddress: 'slslslslslls',
        });
      });
    };
    return {
      ModalRegister,

      CloseModal,
      registerForm,
      SubmitModal,
      state,
      showModal,
    };
  },
});
</script>
