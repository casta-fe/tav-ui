<template>
  <div class="table_wrapper">
    <TaTablePro
      id="Test1234567"
      ref="tableRef"
      :columns="state.columns"
      :api="handleApi"
      :filter-form-config="state.filterFormConfig"
      :custom-action-config="{
        export: {
          handleAction: handleExport,
        },
        column: true,
      }"
    />
  </div>
</template>

<script lang="ts">
import { createVNode } from 'vue'
import { TaTablePro } from '@tav-ui/components/table-pro'
// eslint-disable-next-line import/order
import { defineComponent, reactive, ref, unref } from 'vue'
// eslint-disable-next-line import/order
import type { ITableProInstance, TableProApi } from '@tav-ui/components/table-pro'

export default defineComponent({
  name: 'Test',
  components: { TaTablePro },
  setup() {
    const state = reactive<Record<string, any>>({
      filterFormConfig: {
        inputForm: {
          field: 'projectName',
          componentProps: {
            placeholder: '请输入项目名称',
          },
        },
        pannelForm: [
          {
            field: 'customerName',
            component: 'Input',
            label: '客户名称',
            colProps: {
              span: 12,
              offset: 12,
              pull: 12,
            },
            componentProps: {
              placeholder: '请输入客户名称',
              allowClear: true,
            },
          },
          {
            field: 'priorityList',
            component: 'CheckboxGroup',
            label: '项目优先级',
            colProps: {
              span: 24,
            },
            componentProps: {
              placeholder: '请选择项目优先级',
              options: [{ label: 'P1', value: 1 }],
            },
          },
        ],
      },
      columns: [
        {
          field: 'group1',
          title: '分组1',

          children: [
            {
              field: 'group11',
              title: '分组1-1',
              customRender: () => {
                return 'sssss'
              },
            },
            {
              field: 'group12',
              title: '分组1-2',
            },
          ],
        },
        {
          field: 'group2',
          title: '分组2',
          children: [
            {
              field: 'group21',
              title: '分组2-1',
              children: [
                {
                  field: 'group211',
                  title: '分组2-1-1',
                },
                {
                  field: 'group212',
                  title: '分组2-1-2',
                },
              ],
            },
            {
              field: 'group22',
              title: '分组2-2',
            },
          ],
        },
      ],
      dataList: [],
    })

    const tableRef = ref<ITableProInstance | null>(null)

    const handleApi: TableProApi<Promise<any>> = async ({ filter, model }) => {
      console.log(filter)
      const API = async () => {
        return {
          code: '0000',
          msg: null,
          success: true,
          data: {
            result: [
              {
                customerName: 'hahahahaha',
                group1_1: 'ssssssssssss',
              },
            ],
          },
        }
      }
      const data = await API()
      return data
    }

    const handleExport = () => {
      unref(tableRef)?.instance?.reload({})
    }
    return { state, tableRef, handleApi, handleExport }
  },
})
</script>

<style lang="less" scoprd>
.table_wrapper {
  width: 100%;
  height: 800px;
  padding: 16px;
}
</style>
