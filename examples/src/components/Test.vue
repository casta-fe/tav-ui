<template>
  <div class="table_wrapper">
    <TaTablePro
      ref="tableRef"
      :columns="state.columns"
      :api="handleApi"
      :filter-form-config="state.filterFormConfig"
      :custom-action-config="{
        export: {
          handleAction: handleExport,
        },
      }"
    />
  </div>
</template>

<script lang="ts">
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
          field: 'customerName',
          title: '客户名称',
          // width: 200,
        },
      ],
      dataList: [
        {
          customerName: 'hahahahaha',
        },
      ],
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
