<template>
  <!-- <TaPermissions ref="permissionsRef"> -->
  <!-- <PageWrapper content-full-height fixed-height> -->
  <TaPermissionQuery ref="permissionQueryRef" :api-params="permissionQueryApiParams">
    <!-- <template #default="TaPermissionQuerySlotProps"> -->
    <TaTablePermissionDataQuery
      ref="tablePermissionDataQueryRef"
      :api-params="tablePermissionDataQueryApiParams"
    >
      <template #default="TaTablePermissionDataQuerySlotProps">
        <TaTablePro
          ref="tableProRef"
          v-bind="{ ...tableProps, permission: TaTablePermissionDataQuerySlotProps.permission }"
        >
          <template #customAction>
            <!-- permission="invest_sub_company_export" -->
            <!-- permission="FASTP_ROJECT" -->
            <TaButton
              type="primary"
              pre-icon="ant-design:export-outlined"
              :use-permission="{
                code: 'invest_sub_company_export',
                ref: tableProRef,
              }"
            >
              导出子公司
            </TaButton>
          </template>
          <template #name="{ column, row }">
            <a v-if="true">
              <!-- @mousedown="(e) => onMousedown(row, e)" -->
              {{ row[column.field] }}
            </a>
            <template v-else>{{ row[column.field] }}</template>
          </template>
          <template #action="{ row }">
            <TaTableProAction :actions="getThisButtons(row)" />
          </template>
        </TaTablePro>
        <div ref="test1ElRef" class="test1">
          <div ref="test2ElRef" class="test2">
            <button :disabled="testHtmlTagButtonShow">test html tag button</button>
          </div>
        </div>
      </template>
    </TaTablePermissionDataQuery>
    <!-- </template> -->
  </TaPermissionQuery>
  <!-- </PageWrapper> -->
  <!-- </TaPermissions> -->
</template>
<script lang="ts">
import { computed, createVNode, defineComponent, onActivated, ref } from 'vue'
import {
  type FormSchema,
  TaButton,
  TaPermissionQuery,
  // TaPermissions,
  TaTablePermissionDataQuery,
  TaTableTags,
  usePermissionMatchedByParent,
} from '@tav-ui/components'
import {
  type ITableProInstance,
  TaTablePro,
  TaTableProAction,
  type TableProActionItem,
  type TableProColumn,
} from '@tav-ui/components/table-pro'
import { ProvinceCityOptions, ProvinceCityRecord, formatToDate, isObject } from '@tav-ui/utils'
import {
  API__INVEST_COMPANY_DELETE,
  API__INVEST_COMPANY_LIST,
} from '@tav-ui/components/table-pro/src/data'
// import { PageWrapper } from '/@/components/Page'

export default defineComponent({
  name: 'CompanyListPage',
  components: {
    TaButton,
    TaTablePro,
    TaTableProAction,
    TaPermissionQuery,
    // TaPermissions,
    TaTablePermissionDataQuery,
  },
  setup() {
    const permissionsRef = ref()
    const permissionQueryRef = ref()
    const tablePermissionDataQueryRef = ref()
    const test1ElRef = ref()
    const test2ElRef = ref()
    const testHtmlTagButtonShow = computed(() => {
      const result = usePermissionMatchedByParent({
        code: 'document_batch_d_check_warter',
        ref: test2ElRef,
      }).value
      return result
    })
    const permissionQueryApiParams = ref({
      code: 'PERMISSION_TEST_1',
      // "subCodes": []
    })
    const tablePermissionDataQueryApiParams = ref({
      code: 'PERMISSION_DATA_FILTER_111',
      // "subCodes": [],
      // url: null,
      body: {
        filter: {},
        model: {},
      },
      recordkeyName: 'id',
    })
    setTimeout(() => {
      console.log('🚀 ~ setTimeout ~ permissionsRef:', permissionsRef)
    }, 16.7 * 100)

    const tabsActive = { value: '0' }
    const typeEnums = {
      casSubjectNature: [
        {
          label: 'STS',
          value: 0,
        },
        {
          label: '弘光',
          value: 1,
        },
      ],

      enumsIsTrueOrNot: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      enumsIsXmwjRevert: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
      // 投资阶段
      investmentStatus: [
        {
          label: '待考察',
          value: 0,
        },
        {
          label: '投中',
          value: 1,
        },
        {
          // 需求变动 '已投' -> '在投' 22-08-15_11-23
          // 冬梅:更正 '在投' -> '在持' 22-09-07_09-56
          label: '在持',
          value: 2,
        },
        {
          // 需求变动 '退出' -> '完全退出'
          label: '完全退出',
          value: 3,
        },
        /** 需求变动, 仅留4种状态 与白海雷沟通于 22-02-07_16-43
    { label: "待考察", value: 0 },
    { label: "首次投中", value: 1 },
    { label: "首次已部分拨款", value: 2 },
    { label: "首次已全部拨款", value: 3 },
    { label: "追投中", value: 4 },
    { label: "追投已部分拨款", value: 5 },
    { label: "追投已全部拨款已部分退出（到账）", value: 6 },
    { label: "已全部退出（到账）", value: 7 }
     */
      ],
      /**
       * 是否拨款 22-08-15_11-23_23260 白海雷告知:
       *
       * 原有: 状态 -> 投资阶段
       *
       * 新增: 投资状态 [已投, 未投]
       */
      investedStatus: [
        {
          // 冬梅: 更正 '未投' -> '未拨款' 22-09-07_09-56
          label: '未拨款',
          value: 0,
        },
        {
          // 冬梅: 更正 '已投' -> '拨款' 22-09-07_09-56
          label: '拨款',
          value: 1,
        },
      ],
    }
    const IsTrueOrNotMap = new Map<number, string>()
    typeEnums.enumsIsTrueOrNot.map(({ value, label }) => {
      return IsTrueOrNotMap.set(value, label)
    })
    const useTableFilter = (): any => {
      return {
        inputForm: {
          field: 'searchValue',
          componentProps: {
            'enter-button': true,
            placeholder: '请输入企业、院所、高校名称',
          },
        } as Omit<FormSchema, 'component' | 'label'>,
        pannelForm: [
          {
            field: 'filterSearchValue',
            label: '企业、院所、高校名称',
            labelWidth: 150,
            component: 'Input',
            // componentProps: {
            //   // "enter-button": true,
            //   placeholder: "请输入企业、院所、高校名称"
            // }
          },
        ],
      }
    }

    const columns: TableProColumn[] = [
      {
        title: '企业名称',
        field: 'companyName',
        fixed: 'left',
        width: 280,
        slots: { default: 'name' },
      },
      {
        title: '企业简称',
        field: 'shortName',
        visible: false,
      },
      {
        title: '是否挖掘转化',
        field: 'isXmwjRevert',
        customRender: ({ row, column }) => {
          if (row[column.field]) {
            return createVNode(TaTableTags, { tags: '挖掘转化' })
          }
          return '-'
        },
      },
      {
        title: '是否成立公司',
        field: 'incorporationOrNot',
        params: {
          formatter: ({ cellValue }: any) => IsTrueOrNotMap.get(cellValue) || '-',
        },
      },
      {
        title: '企业最新负责人',
        field: 'principalName',
      },
      // {
      //   title: '状态',
      //   field: 'investmentStatus',
      //   customRender: ({ row }): any =>
      //     row['investmentStatus'] < 3
      //       ? { type: ['warn', 'info', 'danger'][row['investmentStatus']] }
      //       : { color: '#0008' },
      // },
      {
        title: '最早投资轮次',
        field: 'investDepartRoundsValue',
      },
      {
        title: '是否涉密项目',
        field: 'isSecrecy',
        params: {
          formatter({ row }: any) {
            const { isSecrecy } = row
            if (undefined === isSecrecy) return ''
            return IsTrueOrNotMap.get(isSecrecy) || ''
          },
        },
      },
      // {
      //   title: '企业标签',
      //   field: 'lableValue',
      //   width: 300,
      //   customRender: ({ row, column }) =>
      //     createVNode(TaTableTags, {
      //       tags: row[column.field]?.replace(/(null,)|(,null)|(null)/g, ``),
      //     }),
      // },
      {
        title: '专精特新标签',
        field: 'specializedRefinedAndInnovativeLabel',
      },
      {
        title: '所属行业',
        field: 'industryFieldValue',
      },
      {
        title: '所在地',
        field: 'provinceLocation',
        customRender: ({ row: { province, city, districts } }: any) => {
          //@ts-ignore
          return `${ProvinceCityRecord[province] || ''}${ProvinceCityRecord[city] || ''}${
            //@ts-ignore
            ProvinceCityRecord[districts] || ''
          }`
        },
      },
      {
        title: '公司阶段',
        field: 'scaleOfCompanyValue',
        visible: false,
      },
      {
        title: '技术标签',
        field: 'technology',
        visible: false,
      },
      {
        title: '应用标签',
        field: 'adhibition',
        visible: false,
      },

      {
        title: '是否中科院项目',
        field: 'whetherCas',
        params: {
          formatter({ row }: any) {
            const record: any = row
            if (!record.companyInstitutesVo) return ''
            const { whetherCas } = record.companyInstitutesVo
            if (undefined === whetherCas) return ''
            return IsTrueOrNotMap.get(whetherCas) || ''
          },
        },
      },
      {
        title: '投资小组',
        field: 'investGroupValue',
        minWidth: 200,
      },
      {
        title: '所属基金',
        field: 'fundName',
        minWidth: 200,
      },
      {
        title: '中科院院所',
        field: 'casName',
        visible: false,
      },
      {
        title: '是否高校',
        field: 'whetherCollege',
        visible: false,
        params: {
          formatter({ row }: any) {
            const record: any = row
            if (!record.companyInstitutesVo) return ''
            const { whetherCollege } = record.companyInstitutesVo
            if (undefined === whetherCollege) return ''
            return IsTrueOrNotMap.get(whetherCollege) || ''
          },
        },
      },
      {
        title: '高校名称',
        field: 'collegeName',
        visible: false,
      },
      {
        title: '项目来源',
        field: 'projectSourceValue',
        visible: false,
        params: {
          formatter({ row }: any) {
            const record: any = row
            if (!record.companyInspectInfomationVo) return ''
            const { projectSourceValue } = record.companyInspectInfomationVo
            if (undefined === projectSourceValue) return ''
            return projectSourceValue || ''
          },
        },
      },
      {
        title: '经济区域',
        field: 'economicRegionValue',
        visible: false,
      },
      {
        title: '第一笔拨款时间',
        field: 'allocationTime',
        // sorter: true,
        width: 150,
        params: {
          formatter: ['date', 'YYYY-MM-DD'],
        },
      },
      {
        title: '创建时间',
        field: 'createDate',
        sortable: true,
        width: 150,
        params: {
          formatter: ['date', 'YYYY-MM-DD'],
        },
      },
      {
        title: '统一社会信用代码',
        field: 'creditCode',
        visible: false,
        width: 180,
      },
      {
        title: '注册地址',
        field: 'companyAddress',
        visible: false,
        minWidth: 500,
      },
      {
        title: '企业成立时间',
        field: 'estiblishDate',
        visible: false,
        minWidth: 150,
      },
      {
        title: '法定代表人',
        field: 'legalPersonName',
        visible: false,
        minWidth: 180,
      },
      {
        title: '项目简介',
        field: 'productInformation',
        visible: false,
        minWidth: 180,
      },
      {
        // width: 170,
        title: '操作',
        fixed: 'right',
        field: 'action',
        slots: { default: 'action' },
      },
    ]

    /**
     * 22-09-26_10-05
     * 贾旭鹏告知:
     * 与我相关"投资部助理"可以编辑所有,仅可删除(我创建的)
     */
    const getThisButtons = (record: any): TableProActionItem[] => {
      return [
        {
          label: '编辑',
          enabled: true,
        },
        {
          label: '删除',
          usePermission: {
            code: 'FILTER_DELET_BUTTON',
            // code: 'FILTER_DELET_BUTTON123',
            ref: tableProRef,
            row: record,
          },
          popConfirm: {
            title: '是否确认删除?',
            confirm: () => {
              handleDelete([record.companyCode])
            },
          },
        },
        {
          label: '商务审批',
          enabled: true,
        },
      ]
    }

    const tableProRef = ref<ITableProInstance>()
    const reload = () => tableProRef.value?.instance?.reload()

    const filterFormConfig = useTableFilter()

    const tableProps: any = {
      api: ({ filter, model }: any) =>
        API__INVEST_COMPANY_LIST({
          filter,
          model,
        }),
      beforeApi(opt: any) {
        let { filter = {} } = opt
        isObject(filter) || (filter = {})
        if (filter.isXmwjRelat) {
          filter.isXmwjRelat = Number(filter.isXmwjRelat)
        }
        // #region 创建时间
        if (Reflect.has(filter, 'timeRange')) {
          ;[filter.startTime, filter.endTime] = filter.timeRange.map((el: any) => formatToDate(el))
          if (filter.startTime && filter.endTime)
            [filter.startTime, filter.endTime] = [
              `${filter.startTime} 00:00:00`,
              `${filter.endTime} 23:59:59`,
            ]
          filter.timeRange = undefined
        }
        // #region 第一笔拨款时间
        if (Reflect.has(filter, 'allocationTimeRange')) {
          ;[filter.firstGrantStartDate, filter.firstGrantEndDate] = filter.allocationTimeRange.map(
            (el: any) => formatToDate(el)
          )
          if (filter.firstGrantStartDate && filter.firstGrantEndDate)
            [filter.firstGrantStartDate, filter.firstGrantEndDate] = [
              `${filter.firstGrantStartDate} 00:00:00`,
              `${filter.firstGrantEndDate} 23:59:59`,
            ]
          filter.allocationTimeRange = undefined
        }
        // #endregion

        // #region 添加市筛选
        const province = Reflect.get(filter, 'province')
        if (province) {
          Reflect.deleteProperty(filter, 'province')

          const cityCodes = Reflect.get(filter, 'cityCodes')
          // 用户选择市后又取消选择
          if (!(Array.isArray(cityCodes) && cityCodes.length)) {
            Reflect.set(
              filter,
              'cityCodes',
              ProvinceCityOptions.find((el) => el.value === province)?.children?.map(
                (el) => el.value
              )
            )
          }
        }
        // #endregion

        filter.status = tabsActive.value
        for (const k in filter) {
          if (filter[k] == undefined) {
            Reflect.deleteProperty(filter, k)
          }
        }
        console.log('🚀 ~ beforeApi ~ JSON:', JSON.parse(JSON.stringify(opt)))
        return opt
      },
      checkboxConfig: { enabled: false },
      columns,
      filterFormConfig,
      customActionConfig: {
        add: {
          permission: 'invest_company_add',
          handleAction() {
            console.log('🚀 ~ handleAction ~ handleAction:', 'invest_company_add')
          },
        },
        // column: true,
        refresh: true,
      },
      pagerConfig: { pageSize: 30 },
      apiPermissionParams: {
        code: 'PERMISSION_TEST_1',
        // "subCodes": []
      },
      apiPermissionDataParams: {
        code: 'PERMISSION_DATA_FILTER_111',
        // "subCodes": [],
        requestUrl: '/company/information/listPager',
        requestPayload: {
          filter: {},
          model: {},
        },
        fieldNames: {
          id: 'id',
        },
      },
    }

    const handleDelete = (companyCodes: string[]) => {
      API__INVEST_COMPANY_DELETE({ companyCodes }).then(() => {
        reload()
      })
    }

    onActivated(reload)

    return {
      tableProRef,
      tableProps,
      getThisButtons,
      permissionsRef,
      permissionQueryRef,
      tablePermissionDataQueryRef,
      permissionQueryApiParams,
      tablePermissionDataQueryApiParams,
      test1ElRef,
      test2ElRef,
      testHtmlTagButtonShow,
      usePermissionMatchedByParent,
    }
  },
})
</script>
