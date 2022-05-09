<template>
  <div class="mb-4">
    <TaButton class="mr-2" @click="setProps({ labelWidth: 150 })"> 更改labelWidth </TaButton>
    <TaButton class="mr-2" @click="setProps({ labelWidth: 120 })"> 还原labelWidth </TaButton>
    <TaButton class="mr-2" @click="setProps({ size: 'large' })"> 更改Size </TaButton>
    <TaButton class="mr-2" @click="setProps({ size: 'default' })"> 还原Size </TaButton>
    <TaButton class="mr-2" @click="setProps({ disabled: true })"> 禁用表单 </TaButton>
    <TaButton class="mr-2" @click="setProps({ disabled: false })"> 解除禁用 </TaButton>
    <TaButton class="mr-2" @click="setProps({ compact: true })"> 紧凑表单 </TaButton>
    <TaButton class="mr-2" @click="setProps({ compact: false })"> 还原正常间距 </TaButton>
    <TaButton class="mr-2" @click="setProps({ actionColOptions: { span: 8 } })">
      操作按钮位置
    </TaButton>
  </div>
  <div class="mb-4">
    <TaButton class="mr-2" @click="setProps({ showActionTaButtonGroup: false })">
      隐藏操作按钮
    </TaButton>
    <TaButton class="mr-2" @click="setProps({ showActionTaButtonGroup: true })">
      显示操作按钮
    </TaButton>
    <TaButton class="mr-2" @click="setProps({ showResetTaButton: false })"> 隐藏重置按钮 </TaButton>
    <TaButton class="mr-2" @click="setProps({ showResetTaButton: true })"> 显示重置按钮 </TaButton>
    <TaButton class="mr-2" @click="setProps({ showSubmitTaButton: false })">
      隐藏查询按钮
    </TaButton>
    <TaButton class="mr-2" @click="setProps({ showSubmitTaButton: true })"> 显示查询按钮 </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          resetTaButtonOptions: {
            disabled: true,
            text: '重置New',
          },
        })
      "
    >
      修改重置按钮
    </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          submitTaButtonOptions: {
            disabled: true,
            loading: true,
          },
        })
      "
    >
      修改查询按钮
    </TaButton>
    <TaButton class="mr-2" @click="handleLoad"> 联动回显 </TaButton>
  </div>
  <TaCollapseContainer title="useForm示例">
    <TaForm @register="register" @submit="handleSubmit" />
  </TaCollapseContainer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useForm, useMessage } from '../../../../dist/index.esm.js';

import type { FormSchema } from '../../../../dist/types/components/form/src/types/form';

const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8,
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: '字段2',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '时间字段',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field8',
    component: 'ApiCascader',
    label: '联动',
    colProps: {
      span: 8,
    },
    componentProps: {
      api: () => {
        console.log(1);
      },
      apiParamKey: 'parentCode',
      dataField: 'data',
      labelField: 'name',
      valueField: 'code',
      initFetchParams: {
        parentCode: '',
      },
      isLeaf: (record) => {
        return !(record.levelType < 3);
      },
    },
  },
  {
    field: 'field9',
    component: 'ApiCascader',
    label: '联动回显',
    colProps: {
      span: 8,
    },
    componentProps: {
      api: () => {
        console.log('1');
      },
      apiParamKey: 'parentCode',
      dataField: 'data',
      labelField: 'name',
      valueField: 'code',
      initFetchParams: {
        parentCode: '',
      },
      isLeaf: (record) => {
        return !(record.levelType < 3);
      },
    },
  },
];

export default defineComponent({
  components: {},
  setup() {
    const { createMessage } = useMessage();

    const [register, { setProps, setFieldsValue, updateSchema }] = useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24,
      },
      fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']],
    });

    async function handleLoad() {
      const promiseFn = function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              field9: ['430000', '430100', '430102'],
              province: '湖南省',
              city: '长沙市',
              district: '岳麓区',
            });
          }, 1000);
        });
      };

      const item = await promiseFn();

      const { field9, province, city, district } = item as any;
      await updateSchema({
        field: 'field9',
        componentProps: {
          displayRenderArray: [province, city, district],
        },
      });
      await setFieldsValue({
        field9,
      });
    }

    return {
      register,
      schemas,
      handleSubmit: (values) => {
        createMessage.success(`click search,values:${JSON.stringify(values)}`);
      },
      setProps,
      handleLoad,
    };
  },
});
</script>
