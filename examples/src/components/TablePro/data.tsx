import { Tag } from 'ant-design-vue'
import { TableAction } from '@tav-ui/components/table'
import {
  TaTableProAction,
  TaTableProTags,
  XLSXFormats,
  getTagsContent,
} from '@tav-ui/components/table-pro'
import {
  API__POE_CUSTOM_ALL,
  API__POE_CUSTOM_ALL_LIST,
} from '@tav-ui/components/table-pro/src/data'
import { formatToExcelTime } from '@tav-ui/utils'
import type { FormSchema } from '@tav-ui/components/form'
import type {
  TableProColumn,
  TableProFilterForm,
  TableProFooter,
} from '@tav-ui/components/table-pro'

/** 如果js计算不准请使用 mathjs 代替 */
const sumNum = (list: any[], field: string) => {
  let count = 0
  list.forEach((item) => {
    count += Number(item[field])
  })
  return count
}

export const columns1 = (): TableProColumn[] => {
  return [
    { field: 'projectName', title: '投行部项目名称', fixed: 'left', minWidth: 100 },
    { field: 'projectCode', title: '投行部项目编码', width: 200 },
    // { field: 'id', title: 'ID', width: 10, visible: false },
    {
      field: 'customerName',
      title: '客户名称',
      width: 300,
      // fixed: 'left',
      visible: false,
    },
    {
      field: 'round',
      title: 'round',
      width: 100,
    },
    {
      field: 'classificationValue',
      title: '客户分类',
      slots: {
        default: ({ row: { classificationValue } }) => {
          const renderTag = (text: string) => {
            return (
              <Tag
                color={'#e6edff63'}
                style={{ border: '1px solid #3C6CFE', borderRadius: '20px', color: '#3A67FC' }}
              >
                {text}
              </Tag>
            )
          }
          if (Array.isArray(classificationValue)) {
            return [<div>{classificationValue.map((v) => renderTag(v))}</div>]
          } else if (classificationValue) {
            return [renderTag(classificationValue)]
          }
          return [<div style={{ textAlign: 'center' }}>-</div>]
        },
      },
    },
    {
      field: 'customerOwnerName',
      title: '客户负责人',
    },
    {
      field: 'projectOwnerName',
      title: '项目负责人',
    },
    {
      field: 'analystUserList',
      title: '分析师',
      slots: {
        default: ({ row: { analystUserList } }) => [
          <>{analystUserList?.map((v) => v.name).join('、')}</>,
        ],
      },
    },
    {
      field: 'annualRevenue',
      title: '年度营收（万元）',
    },
    {
      field: 'projectStatus',
      title: '项目状态',
    },
    {
      field: 'roundValue',
      title: '服务轮次',
    },
    {
      field: 'priority',
      title: '项目优先级',
    },
    {
      field: 'quality',
      title: '质地',
    },
    {
      field: 'timeRequirements',
      title: '时间要求',
    },
    {
      field: 'projectSourceType',
      title: '项目来源',
    },
    {
      field: 'projectCreateTime',
      title: '项目创建时间',
    },
    {
      field: 'createByName',
      title: '创建人',
    },
    {
      field: 'projectEndTime',
      title: '项目完成时间',
    },
    {
      field: 'actions',
      title: '操作',
      fixed: 'right',
      // visible: false,
      slots: {
        default: () => {
          return [
            <TaTableProAction
              actions={[
                {
                  label: '编辑',
                  onClick: () => {
                    console.log('edit')
                  },
                },
                {
                  label: '测试1',
                  onClick: () => {
                    console.log('test 1')
                  },
                },
                {
                  label: '测试2',
                  onClick: () => {
                    console.log('test 2')
                  },
                },
                {
                  label: '删除',
                  popConfirm: {
                    title: '删除后将无法恢复，确定删除吗？',
                    confirm: () => {
                      console.log('del')
                    },
                  },
                },
              ]}
            />,
          ]
        },
      },
    },
  ]
}

export const filterForm1 = (): TableProFilterForm => ({
  inputForm: {
    field: 'projectName',
    componentProps: {
      placeholder: '请输入项目名称',
    },
  } as Omit<FormSchema, 'label' | 'component'>,
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
        options: [
          {
            label: 'P0',
            value: 0,
          },
          {
            label: 'P1',
            value: 1,
          },
          {
            label: 'P2',
            value: 2,
          },
          {
            label: 'P3',
            value: 3,
          },
        ],
      },
    },
    {
      field: 'projectSourceTypeList',
      component: 'CheckboxGroup',
      label: '项目来源',
      colProps: {
        span: 24,
      },
      valueType: 'number',
      componentProps: {
        placeholder: '请选择项目来源',
        options: [
          {
            label: '被投企业',
            value: 1,
          },
          {
            label: '拟投企业',
            value: 2,
          },
          {
            label: '合作伙伴',
            value: 3,
          },
          {
            label: '其他',
            value: 4,
          },
        ],
      },
    },
    {
      field: 'projectStatusList',
      component: 'CheckboxGroup',
      label: '项目状态',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请选择项目状态',
        options: [
          {
            label: '进行中',
            value: 1,
          },
          {
            label: '已结束',
            value: 2,
          },
        ],
      },
    },
  ] as FormSchema[],
})

export const footerMethod1: TableProFooter = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合值'
      }
      if (['round'].includes(column.field)) {
        return sumNum(data, column.field)
      }
      return null
    }),
  ]
}

export const columns2 = async ({ handleRoutePush, OpenModal }): Promise<TableProColumn[]> => {
  await API__POE_CUSTOM_ALL({
    filter: { tab: 0 },
    model: { page: 1, limit: 50 },
  })

  return [
    // {
    //   field: 'customerName',
    //   title: '客户名称',
    //   fixed: 'left',
    //   customRender: ({ row: { customerName } }) => (
    //     <a
    //       href="javascript:;"
    //       style="color: #3a67fc"
    //       onClick={(e) => {
    //         handleRoutePush(e, {
    //           name: 'Test',
    //         })
    //       }}
    //     >
    //       {customerName}
    //     </a>
    //   ),
    // },
    // { field: 'customerCode', title: '客户编号', fixed: 'left' },
    // {
    //   type: 'seq',
    //   field: 'seq',
    //   title: '序号',
    //   width: 60,
    // },
    {
      title: '集合0',
      field: 'collect0',
      fixed: undefined,
      // visible: false,
      children: [
        {
          field: 'customerName0',
          title: '客户名称0',
          width: 100,
          // visible: false,
          fixed: 'left',
          customRender: ({ row: { customerName } }) => (
            <a
              href="javascript:;"
              style="color: #3a67fc"
              onClick={(e) => {
                handleRoutePush(e, {
                  name: 'Test',
                })
              }}
            >
              {customerName}
            </a>
          ),
        },
        {
          field: 'customerCode0',
          title: '客户编号0',
          width: 100,
          // visible: false,
        },
      ],
    },
    {
      field: 'classificationValue',
      title: '客户分类',
      width: 200,
      // showTooltip: true,
      visible: false,
      // slots: {
      //   default: ({ row: { classificationValue } }) => {
      //     return [
      //       <TaTableProTags
      //         data={classificationValue}
      //         tagConfig={{ color: 'blue', round: '50px' }}
      //       />,
      //     ]
      //   },
      // },
      customRender: ({ row: { classificationValue } }) => (
        <TaTableProTags data={classificationValue} tagConfig={{ color: 'blue' }} />
      ),
    },
    {
      field: 'address',
      title: '注册地',
      visible: false,
    },
    {
      field: 'ownerName',
      title: '客户负责人',
      visible: false,
    },
    {
      field: 'sourceType',
      title: '客户来源',
      customRender: ({ row: { address, ownerName, sourceType } }) => (
        <>{`${address}::${ownerName}::${sourceType}`}</>
      ),
    },
    {
      title: '集合1',
      field: 'collect1',
      // fixed: 'left',
      children: [
        {
          field: 'customerType',
          title: '客户类型',
          width: 200,
          // slots: {
          //   default: ({ row: { customerType } }) => [customerType == 1 ? '机构' : '企业'],
          // },
          customRender: ({ row: { customerType } }) => (customerType == 1 ? '机构' : '企业'),
          // slots: {
          //   default: 'customerType'
          // }
        },
        {
          field: 'industryList',
          title: '行业',
          width: 200,
          // slots: {
          //   default: ({ row: { industryList } }) => {
          //     return [<TaTableProTags data={industryList} tagConfig={{ color: 'green' }} />]
          //   },
          // },
          customRender: ({ row: { industryList } }) => (
            <TaTableProTags data={industryList} tagConfig={{ color: 'green' }} />
          ),
        },
      ],
    },
    // {
    //   field: 'applicationList',
    //   title: '应用领域',
    //   // slots: {
    //   //   default: ({ row: { applicationList } }) => {
    //   //     return [<TaTableProTags data={applicationList} tagConfig={{ color: 'purple' }} />]
    //   //   },
    //   // },
    //   customRender: ({ row: { applicationList } }) => (
    //     <TaTableProTags data={applicationList} tagConfig={{ color: 'purple' }} />
    //   ),
    // },
    // {
    //   field: 'shareholder',
    //   title: '主要股东',
    // },
    // {
    //   field: 'valuation',
    //   title: '最新估值（万元）',
    // },
    // { field: 'customerCode', title: '客户编号', fixed: 'left' },
    {
      title: '集合2',
      field: 'collect2',
      children: [
        {
          field: 'annualRevenue',
          title: '年度营收（万元）',
          width: 200,
        },
        {
          field: 'latestFinancingAmount',
          title: '最新融资金额（万元）',
          width: 200,
        },
        {
          field: 'createDate',
          title: '创建时间',
          width: 200,
        },
      ],
    },
    // {
    //   field: 'annualRevenue',
    //   title: '年度营收（万元）',
    // },
    // {
    //   field: 'latestFinancingAmount',
    //   title: '最新融资金额（万元）',
    // },
    // {
    //   field: 'createDate',
    //   title: '创建时间',
    // },
    {
      field: 'action',
      title: '操作',
      fixed: 'right',
      // showTooltip: false,
      // width: 85,
      // slots: {
      //   default: () => [
      //     <TaTableProAction
      //       actions={[
      //         {
      //           label: '编辑',
      //           onClick: () => {
      //             console.log('edit')
      //           },
      //         },
      //         {
      //           label: '测试1',
      //           onClick: () => {
      //             console.log('test 1')
      //           },
      //         },
      //         {
      //           label: '测试2',
      //           onClick: () => {
      //             console.log('test 2')
      //           },
      //         },
      //         {
      //           label: '删除',
      //           popConfirm: {
      //             title: '删除后将无法恢复，确定删除吗？',
      //             confirm: () => {
      //               console.log('del')
      //             },
      //           },
      //         },
      //       ]}
      //     />,
      //   ],
      // },
      customRender: () => (
        <TaTableProAction
          actions={[
            {
              label: '编辑',
              onClick: () => {
                OpenModal()
              },
            },
            {
              label: '测试112321321321321',
              popConfirm: {
                title: '删除后将无法恢复，确定删除吗？',
                confirm: () => {
                  console.log('del')
                },
              },
            },
            {
              label: '测试2',
              onClick: () => {
                console.log('test 2')
              },
            },
            {
              label: '删除',
              popConfirm: {
                title: '删除后将无法恢复，确定删除吗？',
                confirm: () => {
                  console.log('del')
                },
              },
            },
          ]}
        />
      ),
    },
  ]
}

export const filterForm2 = async (): Promise<TableProFilterForm> => {
  // await API__POE_CUSTOM_ALL({
  //   filter: { tab: 0 },
  //   model: { page: 1, limit: 2 },
  // })

  return {
    inputForm: {
      // field: 'customerName',
      // componentProps: {
      //   placeholder: '请输入客户名称',
      // },
      field: 'time',
      component: 'DateInterval',
      componentProps: {
        // defaultRange: 'lastYear',
        // onChange: (v: any) => {
        //   console.log(v)
        // },
        // onGetCurDate: (data: any) => {
        //   console.log(data, '=============')
        // },
      },
    },
    pannelForm: [
      // {
      //   field: "industryIds",
      //   component: "CheckboxGroup",
      //   label: "行业",
      //   colProps: {
      //     span: 24
      //   },
      //   componentProps: () => {
      //     return {
      //       options: INDUSTRY_List.value
      //     };
      //   }
      // },
      // {
      //   field: "classification",
      //   component: "CheckboxGroup",
      //   label: "客户分类",
      //   colProps: {
      //     span: 24
      //   },
      //   componentProps: () => {
      //     return {
      //       options: CLASSIFICATION_List.value
      //     };
      //   }
      // },
      {
        field: 'minValuation',
        component: 'InputNumber',
        label: '估值区间',
        colProps: {
          span: 7,
          // offset: 6,
          // pull: 6
        },
        componentProps: {
          placeholder: '万元',
          allowClear: true,
        },
      },
      {
        field: 'maxValuation',
        component: 'InputNumber',
        label: '至',
        colProps: {
          span: 7,
          offset: 5,
          pull: 6,
        },
        componentProps: {
          placeholder: '万元',
          allowClear: true,
        },
      },
      {
        field: 'minAnnualRevenue',
        component: 'InputNumber',
        label: '营收区间',
        colProps: {
          span: 7,
        },
        componentProps: {
          placeholder: '万元',
          allowClear: true,
        },
      },
      {
        field: 'maxAnnualRevenue',
        component: 'InputNumber',
        label: '至',
        colProps: {
          span: 7,
          offset: 5,
          pull: 6,
        },
        componentProps: {
          placeholder: '万元',
          allowClear: true,
        },
      },
      {
        field: 'customerType',
        component: 'RadioGroup',
        label: '客户类型',
        colProps: {
          span: 24,
        },
        defaultValue: 0,
        componentProps: {
          options: [
            {
              label: '全部',
              value: 0,
            },
            {
              label: '机构',
              value: 1,
            },
            {
              label: '企业',
              value: 2,
            },
          ],
        },
      },
      // {
      //   field: 'ownerList',
      //   component: 'MemberSelect',
      //   label: '客户负责人',
      //   colProps: {
      //     span: 12,
      //     offset: 12,
      //     pull: 12,
      //   },
      //   componentProps: {
      //     multiple: true,
      //     placeholder: '请选择客户负责人',
      //     allowClear: true,
      //     getPopupContainer: () => document.body,
      //   },
      // },
    ],
  }
}

export const footerMethod2: TableProFooter = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合值'
      }
      if (['annualRevenue'].includes(column.field)) {
        return sumNum(data, column.field)
      }
      if (['latestFinancingAmount'].includes(column.field)) {
        return sumNum(data, column.field)
      }
      return null
    }),
  ]
}

export const columns3 = async ({ handleRoutePush }): Promise<TableProColumn[]> => {
  await API__POE_CUSTOM_ALL({
    filter: { tab: 0 },
    model: { page: 1, limit: 50 },
  })

  return [
    {
      field: 'name',
      title: '名称',
      width: 280,
      fixed: 'left',
      treeNode: true,
    },
    { field: 'type', title: '类型', width: 100 },
    { field: 'icon', title: '图标', width: 80 },
    { field: 'status', title: '启用/禁用', width: 120 },
    { field: 'allowAuthz', title: '允许非超管授权', width: 120 },
    { title: '排序号', field: 'seq', width: 80 },
    { title: '编码', field: 'code' },
    { title: '资源', field: 'resource' },
    {
      field: 'action',
      title: '操作',
      fixed: 'right',
      customRender: () => (
        <TaTableProAction
          actions={[
            {
              label: '编辑',
              onClick: () => {
                console.log('edit')
              },
            },
            {
              label: '测试1',
              onClick: () => {
                console.log('test 1')
              },
            },
            {
              label: '测试2',
              onClick: () => {
                console.log('test 2')
              },
            },
            {
              label: '删除',
              popConfirm: {
                title: '删除后将无法恢复，确定删除吗？',
                confirm: () => {
                  console.log('del')
                },
              },
            },
          ]}
        />
      ),
    },
  ]
}
