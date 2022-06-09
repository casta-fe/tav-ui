import { Tag } from 'ant-design-vue'
import { TableAction } from '@tav-ui/components/table'
import { TaTableProAction, TaTableProTags } from '@tav-ui/components/table-pro'
import { API__POE_CUSTOM_ALL } from '@tav-ui/components/table-pro/src/data'
import type { FormSchema } from '@tav-ui/components/form'
import type { TableProColumn, TableProFilterForm } from '@tav-ui/components/table-pro'

export const columns1 = (): TableProColumn[] => {
  return [
    { field: 'projectName', title: '投行部项目名称', fixed: 'left', minWidth: 100 },
    { field: 'projectCode', title: '投行部项目编码', width: 200 },
    { field: 'customerName', title: '客户名称', width: 1000 },
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
      slots: {
        default: () => [
          <TableAction
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
        ],
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

export const columns2 = async (): Promise<TableProColumn[]> => {
  await API__POE_CUSTOM_ALL({
    filter: { tab: 0 },
    model: { page: 1, limit: 50 },
  })

  return [
    { field: 'customerName', title: '客户名称', fixed: 'left' },
    { field: 'customerCode', title: '客户编号', fixed: 'left' },
    {
      field: 'classificationValue',
      title: '客户分类',
      width: 1000,
      slots: {
        default: ({ row: { classificationValue } }) => {
          return [<TaTableProTags data={classificationValue} tagConfig={{ color: 'blue' }} />]
        },
      },
    },
    {
      field: 'customerType',
      title: '客户类型',
      slots: {
        default: ({ row: { customerType } }) => [customerType == 1 ? '机构' : '企业'],
      },
    },
    {
      field: 'industryList',
      title: '行业',
      slots: {
        default: ({ row: { industryList } }) => {
          return [<TaTableProTags data={industryList} tagConfig={{ color: 'green' }} />]
        },
      },
    },
    {
      field: 'applicationList',
      title: '应用领域',
      slots: {
        default: ({ row: { applicationList } }) => {
          return [<TaTableProTags data={applicationList} tagConfig={{ color: 'purple' }} />]
        },
      },
    },
    {
      field: 'address',
      title: '注册地',
    },
    {
      field: 'ownerName',
      title: '客户负责人',
    },
    {
      field: 'sourceType',
      title: '客户来源',
    },
    {
      field: 'shareholder',
      title: '主要股东',
    },
    {
      field: 'valuation',
      title: '最新估值（万元）',
    },
    {
      field: 'annualRevenue',
      title: '年度营收（万元）',
    },
    {
      field: 'latestFinancingAmount',
      title: '最新融资金额（万元）',
    },
    {
      field: 'createDate',
      title: '创建时间',
    },
    {
      field: 'action',
      title: '操作',
      fixed: 'right',
      // width: 85,
      slots: {
        default: () => [
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
          // <>
          //   321839218937218372819732819372817dhahdjsahdjksahdjsahdjksahjdhsake921392183921839218392183921839128391283920183920183912083912dsahidhjksajdk
          // </>,
        ],
      },
    },
  ]
}

export const filterForm2 = async (): Promise<TableProFilterForm> => {
  await API__POE_CUSTOM_ALL({
    filter: { tab: 0 },
    model: { page: 1, limit: 2 },
  })

  return {
    inputForm: {
      field: 'customerName',
      componentProps: {
        placeholder: '请输入客户名称',
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
