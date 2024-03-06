<template>
  <div>
    <h2>table Example</h2>
    <div style="height: 70vh">
      <TaTable
        :columns="columns"
        :api="tableApi"
        :can-resize="canResize"
        :loading="loading"
        :bordered="border"
        :pagination="pagination"
        :filter-exclusion="false"
        :action-column="{
          width: 150,
          title: '操作',
          dataIndex: 'action',
        }"
        @columns-change="handleColumnChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a> {{ record.name }} </a>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <TableAction :actions="getTableActionsButton()" />
          </template>
        </template>
        <!-- <template #toolbar>
          <a-button type="primary" @click="toggleCanResize">
            {{ !canResize ? '自适应高度' : '取消自适应' }}
          </a-button>
          <a-button type="primary" @click="toggleBorder">
            {{ !border ? '显示边框' : '隐藏边框' }}
          </a-button>
          <a-button type="primary" @click="toggleLoading">
            开启loading
          </a-button>
          <a-button type="primary" @click="toggleStriped">
            {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
          </a-button>
        </template> -->
      </TaTable>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { TaTable, TableAction } from '@tav-ui/components/table'

import { getBasicColumns, getBasicData } from './tableData'
import type { ColumnChangeParam } from '@tav-ui/components/table'

export default defineComponent({
  components: {
    TaTable,
    TableAction,
  },
  setup() {
    const canResize = ref(true)
    const loading = ref(false)
    const striped = ref(true)
    const border = ref(true)
    const pagination = ref<any>(true)
    function toggleCanResize() {
      canResize.value = !canResize.value
    }
    const tableApi = async () => {
      // await new Promise((resolve) =>
      //   setTimeout(() => {
      //     return resolve(true)
      //   }, 3000)
      // )
      return Promise.resolve({ data: getBasicData() })
    }
    function toggleStriped() {
      striped.value = !striped.value
    }
    function toggleLoading() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        pagination.value = { pageSize: 20 }
      }, 3000)
    }
    function toggleBorder() {
      border.value = !border.value
    }

    function handleColumnChange(data: ColumnChangeParam[]) {
      console.log('ColumnChanged', data)
    }
    const inputForm = {
      field: 'keyword',
      componentProps: {
        placeholder: '请输入机构名称',
      },
    }

    const pannelForm = [
      {
        field: 'investorName',
        component: 'Input',
        label: '投资人',
        colProps: {
          span: 14,
        },
        componentProps: {
          placeholder: '请输入投资人名称',
        },
      },
      {
        field: 'institutionName',
        component: 'Input',
        label: '机构名称',
        colProps: {
          span: 14,
        },
        componentProps: {
          placeholder: '请输入机构名称',
        },
      },
      {
        field: 'investmentType',
        component: 'RadioGroup',
        label: '跟投领投',
        colProps: {
          span: 24,
        },
        componentProps: {
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '跟投',
              value: 0,
            },
            {
              label: '领投',
              value: 1,
            },
          ],
        },
      },
      {
        field: 'personalInvestment',
        component: 'CheckboxGroup',
        label: '个人投资领域',
        colProps: {
          span: 24,
        },
        componentProps: {
          options: [
            {
              label: 'slsl',
              value: 'sksk',
            },
          ], //INVEST_FIELD_LIST
        },
      },
    ]

    const filterForms = {
      inputForm,
      pannelForm,
    }
    const state = reactive({
      filterForms,
    })
    const getTableActionsButton = () => {
      return [
        // {
        //   label: '查看',
        //   // permission: 'bpmn_list_design',
        // },
        // {
        //   label: '删除',
        //   // permission: 'bpmn_list_design',
        // },
        {
          label: '下载源文件12321321321',
          // permission: 'bpmn_list_deploy',
          popConfirm: {
            title: '删除后将无法恢复，确定删除吗？',
            confirm: () => {
              console.log('del')
            },
          },
        },
        // {
        //   label: '更新XML',
        //   // permission: 'bpmn_list_design',
        // },
        // {
        //   label: '下载源文件',
        //   // permission: 'bpmn_list_design',
        // },
      ]
    }
    return {
      columns: getBasicColumns(),
      tableApi,
      data: getBasicData(),
      canResize,
      loading,
      striped,
      border,
      toggleStriped,
      toggleCanResize,
      toggleLoading,
      toggleBorder,
      pagination,
      handleColumnChange,
      getTableActionsButton,
      ...toRefs(state),
    }
  },
})
</script>
