<template>
  <!-- <PageWrapper content-full-height fixed-height> -->
  <TaTablePro ref="tableProRef" v-bind="tableProps">
    <template #customAction>
      <TaButton
        type="primary"
        permission="invest_sub_company_export"
        pre-icon="ant-design:export-outlined"
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
  <!-- </PageWrapper> -->
</template>
<script lang="ts">
import { createVNode, defineComponent, onActivated, ref } from 'vue'
import { TaButton, TaTableTags } from '@tav-ui/components'
import {
  type FilterForms,
  type ITableProInstance,
  TaTablePro,
  TaTableProAction,
  type TableProActionItem,
  type TableProColumn,
  type TableProProps,
} from '@tav-ui/components/table-pro'
import { ProvinceCityOptions, ProvinceCityRecord, formatToDate, isObject } from '@tav-ui/utils'
import { API__INVEST_COMPANY_LIST } from '@tav-ui/components/table-pro/src/data'
// import { PageWrapper } from '/@/components/Page'

export default defineComponent({
  name: 'CompanyListPage',
  components: {
    TaButton,
    TaTablePro,
    TaTableProAction,
  },
  setup() {
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
    const useTableFilter = (): FilterForms => {
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
          return ''
        },
      },
      {
        title: '是否成立公司',
        field: 'incorporationOrNot',
        params: {
          formatter: ({ cellValue }) => IsTrueOrNotMap.get(cellValue) || '-',
        },
      },
      {
        title: '企业最新负责人',
        field: 'principalName',
      },
      {
        title: '状态',
        field: 'investmentStatus',
        customRender: ({ row, column }) =>
          row[column.field] < 3
            ? { type: ['warn', 'info', 'danger'][row[column.field]] }
            : { color: '#0008' },
      },
      {
        title: '最早投资轮次',
        field: 'investDepartRoundsValue',
      },
      {
        title: '是否涉密项目',
        field: 'isSecrecy',
        params: {
          formatter({ row }) {
            const { isSecrecy } = row
            if (undefined === isSecrecy) return ''
            return IsTrueOrNotMap.get(isSecrecy) || ''
          },
        },
      },
      {
        title: '企业标签',
        field: 'lableValue',
        width: 300,
        customRender: ({ row, column }) =>
          createVNode(TaTableTags, {
            tags: row[column.field]?.replace(/(null,)|(,null)|(null)/g, ``),
          }),
      },
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
        customRender: ({ row: { province, city, districts } }) => {
          return `${ProvinceCityRecord[province] || ''}${ProvinceCityRecord[city] || ''}${
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
          formatter({ row }) {
            const record: ListPagerRowType = row
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
          formatter({ row }) {
            const record: ListPagerRowType = row
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
          formatter({ row }) {
            const record: ListPagerRowType = row
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
    const getThisButtons = (): TableProActionItem[] => {
      return [
        {
          label: '编辑',
          enabled: true,
        },
        // {
        //   label: '删除',
        //   enabled: true,
        // },
        // {
        //   label: '商务审批',
        //   enabled: true,
        // },
      ]
    }

    const tableProRef = ref<ITableProInstance>()
    const reload = () => tableProRef.value?.instance?.reload()

    const filterFormConfig = useTableFilter()

    const tableProps: TableProProps = {
      api: ({ filter, model }) =>
        API__INVEST_COMPANY_LIST({
          filter,
          model,
        }),
      beforeApi(opt) {
        let { filter = {} } = opt
        isObject(filter) || (filter = {})
        if (filter.isXmwjRelat) {
          filter.isXmwjRelat = Number(filter.isXmwjRelat)
        }
        // #region 创建时间
        if (Reflect.has(filter, 'timeRange')) {
          ;[filter.startTime, filter.endTime] = filter.timeRange.map((el) => formatToDate(el))
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
            (el) => formatToDate(el)
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
        // copyFilter = JSON.parse(JSON.stringify(opt))
        return opt
      },
      checkboxConfig: { enabled: false },
      columns,
      filterFormConfig,
      customActionConfig: {
        add: {
          permission: 'invest_company_add',
          handleAction() {
            formProps.editId = 0
            formProps.companyCode = ''
            modalProps.title = '新增企业'
            modalProps.destroyOnClose = false
            openModal()
          },
        },
        // column: true,
        refresh: true,
      },
      pagerConfig: { pageSize: 30 },
    }

    onActivated(reload)

    return {
      tableProps,
      getThisButtons,
    }
  },
})
</script>
