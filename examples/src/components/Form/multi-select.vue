<template>
  <h2>Perf Multi Select</h2>
  <div class="mb-4">
    <BasicForm ref="basicformRef" @register="registerForm" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { upperFirst } from 'lodash-es'
import { TaForm as BasicForm, type FormSchema, useForm } from '@tav-ui/components'
import { __post } from '@tav-ui/components/table-pro/src/data'

export default defineComponent({
  name: 'PerfMultiSelect',
  components: { BasicForm },
  setup() {
    const state = reactive({
      orgOptions: [],
    })

    const initOrgOptions = () => {
      try {
        const { data = [], success } = {
          success: true,
          code: '0000',
          data: [
            {
              id: 46,
              orgName: '00000',
              createBy: 1,
              createDate: '2024-05-06 17:14:40',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 45,
              orgName: '88888888888888888888888888888',
              createBy: 1,
              createDate: '2024-05-06 15:49:25',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 44,
              orgName: '77',
              createBy: 1,
              createDate: '2024-05-06 15:49:15',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 43,
              orgName: 'test1234445',
              createBy: 1,
              createDate: '2024-05-06 15:47:37',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 42,
              orgName: 'testbbb',
              createBy: 1,
              createDate: '2024-05-06 15:44:24',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 41,
              orgName: 'testa',
              createBy: 1,
              createDate: '2024-05-06 15:43:51',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 40,
              orgName: '浙江大学1',
              createBy: 407,
              createDate: '2023-12-13 02:07:16',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 39,
              orgName: '浙江大学',
              createBy: 407,
              createDate: '2023-12-12 18:10:37',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 38,
              orgName: '研究所1',
              createBy: 407,
              createDate: '2023-12-11 23:43:38',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 37,
              orgName: '研究所',
              createBy: 407,
              createDate: '2023-12-11 23:39:49',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 29,
              orgName: '西科控股2',
              createBy: 1,
              createDate: '2023-12-08 22:06:50',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 28,
              orgName: '西科控股',
              createBy: 1,
              createDate: '2023-12-08 21:56:30',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 27,
              orgName: '武汉大学',
              createBy: 407,
              createDate: '2023-12-08 17:28:01',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 26,
              orgName: '北京大学',
              createBy: 407,
              createDate: '2023-12-08 02:51:08',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 25,
              orgName: '首都医科大学肿瘤医院',
              createBy: 1,
              createDate: '2023-12-07 17:50:01',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 24,
              orgName: '清华大学科学部',
              createBy: 619,
              createDate: '2023-12-06 23:28:51',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 23,
              orgName: '清华大学',
              createBy: 619,
              createDate: '2023-12-06 23:23:52',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 22,
              orgName: 'CAS深圳先进院',
              createBy: 407,
              createDate: '2023-12-05 02:13:54',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 21,
              orgName: 'University of texas Healthy',
              createBy: 407,
              createDate: '2023-12-05 02:13:16',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 20,
              orgName: '北医三院',
              createBy: 407,
              createDate: '2023-12-05 02:09:27',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 19,
              orgName: 'qinghua university',
              createBy: 407,
              createDate: '2023-12-05 01:51:59',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 18,
              orgName: 'Institute of Hematology, Peking University',
              createBy: 407,
              createDate: '2023-12-04 22:26:11',
              updateBy: null,
              updateDate: null,
            },
            {
              id: 17,
              orgName: '测试1204',
              createBy: 1,
              createDate: '2023-12-04 18:59:10',
              updateBy: null,
              updateDate: null,
            },
          ],
          msg: null,
        }
        if (data.length > 0 && success) {
          state.orgOptions = data
          // state.orgOptions = data.map((record) => ({
          //   ...record,
          //   label: record.orgName,
          //   value: record.orgName,
          // }))
          return state.orgOptions
        }
      } catch (error) {
        state.orgOptions = []
      }
    }

    function getBasiceFormSchema(basicformRef): FormSchema[] {
      initOrgOptions()
      const setValueUpper = (key) => {
        const formData = basicformRef.value.getFieldsValue()
        if (formData[key]) {
          formData[key] = upperFirst(formData[key])
          basicformRef.value.setFieldsValue(formData)
        }

        console.log(formData)
      }
      return [
        {
          field: 'id',
          component: 'Input',
          label: '',
          show: false,
        },

        // {
        //   field: "orgId",
        //   component: "Input",
        //   label: t("author.author.list.form.orgName"),
        //   show: false,
        //   colProps: {
        //     span: 0
        //   }
        // },
        // {
        //   field: 'orgName',
        //   component: 'Select',
        //   label: '组织名称',
        //   colProps: {
        //     span: 24,
        //   },
        //   // slot: "orgName",
        //   required: true,
        //   componentProps: ({ formActionType, formModel }) => ({
        //     placeholder: '请选择',
        //     options: state.orgOptions,
        //     mode: 'tags',
        //     allowClear: true,
        //     fieldNames: {
        //       label: 'orgName',
        //       value: 'id',
        //     },
        //     // onSearch: (value) => {
        //     //   console.log('onSearch: ', value)
        //     //   if (value) {
        //     //     const f = state.orgOptions.some((x) => x.label === value)
        //     //     if (!f) {
        //     //       state.orgOptions.push({ label: value, value })
        //     //     }
        //     //   }
        //     // },
        //     // onChange: (value) => {
        //     //   console.log('onChange: ', value)
        //     // }
        //   }),
        // },
        {
          field: 'orgNametest1',
          component: 'SelectPro',
          label: '组织名称-单选无 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: 44,
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
          }),
        },
        {
          field: 'orgNametest2',
          component: 'SelectPro',
          label: '组织名称-单选有 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
            enabledAdd: true,
          }),
        },
        {
          field: 'orgNametest3',
          component: 'SelectPro',
          label: '组织名称: mode multiple 无 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'multiple',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
          }),
        },
        {
          field: 'orgNametest4',
          component: 'SelectPro',
          label: '组织名称: mode multiple 有 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'multiple',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
            enabledAdd: true,
          }),
        },
        {
          field: 'orgNametest5',
          component: 'SelectPro',
          label: '组织名称: mode combobox 无 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: 44,
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'combobox',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
          }),
        },
        {
          field: 'orgNametest6',
          component: 'SelectPro',
          label: '组织名称: mode combobox 有 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'combobox',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
            enabledAdd: true,
          }),
        },
        {
          field: 'orgNametest7',
          component: 'SelectPro',
          label: '组织名称: mode tags 无 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'tags',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
          }),
        },
        {
          field: 'orgNametest8',
          component: 'SelectPro',
          label: '组织名称: mode tags 有 enabledAdd',
          colProps: {
            span: 18,
          },
          // slot: "orgName",
          required: true,
          defaultValue: [{ value: 44 }],
          componentProps: ({ formActionType, formModel }) => ({
            placeholder: '请选择',
            options: state.orgOptions,
            mode: 'tags',
            fieldNames: {
              label: 'orgName',
              value: 'id',
            },
            enabledAdd: true,
          }),
        },
        {
          field: 'firstName',
          component: 'Input',
          label: '名字',
          colProps: {
            span: 12,
          },
          rules: [
            {
              required: true,
            },
            {
              pattern: /^[^\u4e00-\u9fff]+$/,
              message: '不支持中文',
            },
          ],
          componentProps: {
            placeholder: '请输入名字（英文）',
            onBlur: setValueUpper.bind(null, 'firstName'),
          },
        },
      ]
    }

    const basicformRef = ref(null)
    const schemas = getBasiceFormSchema(basicformRef)
    const [registerForm, { validateFields, setFieldsValue }] = useForm({
      rowProps: { gutter: 40 },
      schemas,
      showActionButtonGroup: false,
    })

    return {
      basicformRef,
      BasicForm,
      registerForm,
    }
  },
})
</script>
