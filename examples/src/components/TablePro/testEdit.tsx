import { defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { DatePicker, Input, InputNumber, Select } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Button from '@tav-ui/components/button'
import { TaTablePro, TaTableProTags } from '@tav-ui/components/table-pro'
import { API__POE_CUSTOM_ALL, API__POE_INDUSTRY_ALL } from '@tav-ui/components/table-pro/src/data'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { formatToDateTime } from '@tav-ui/utils'
import type {
  ITableProInstance,
  TableProApi,
  TableProCheckboxAll,
  TableProCheckboxChange,
  TableProColumn,
  TableProCustomActionConfig,
  TableProEditRules,
  TableProFilterForm,
  TableProFooterMethod,
} from '@tav-ui/components/table-pro'

interface IState {
  loading: boolean
  filterForm: TableProFilterForm
  columns: TableProColumn[]
  editRules: TableProEditRules
}

const message = useMessage()

export default defineComponent({
  setup() {
    const router = useRouter()
    const tableRef = ref<ITableProInstance | null>(null)
    const state = reactive<IState>({
      loading: false,
      filterForm: {},
      columns: [],
      editRules: {
        customerCode: [{ required: true, message: '请输入客户编号' }],
        industryList: [{ required: true, message: '请选择行业' }],
      },
    })

    // filterForm
    const createFilterForm = async (): Promise<TableProFilterForm> => {
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
        ],
      }
    }

    // columns
    const createColumns = async (): Promise<TableProColumn[]> => {
      const { data } = await API__POE_INDUSTRY_ALL()
      const industryOptions = data.map((industry) => ({
        label: industry.name,
        value: industry.id,
        ...industry,
      }))

      return [
        {
          field: 'customerName',
          title: '客户名称客户名称客户名称客户名称客户名称客户名称客户名称客户名称客户名称客户名称',
          fixed: 'left',
          customRender: ({ row: { customerName } }) => (
            <a
              href="javascript:;"
              style="color: #3a67fc"
              onClick={(e) => {
                e.stopPropagation()
                router.push({
                  name: 'Test',
                })
              }}
            >
              {customerName}
            </a>
          ),
        },
        {
          field: 'customerCode',
          title: '客户编号',
          fixed: 'left',
          // editRender: {},
          // slots: {
          //   edit: (scope) => {
          //     return [
          //       <Input
          //         vModel={[scope.row.customerCode, 'value']}
          //         onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
          //       />,
          //     ]
          //   },
          // },
          customEditRender: (scope) => (
            // 注意编辑时必须这样写，把scope整体传入updateStatus以及vModel否则vxetable edit不生效
            <Input
              vModel={[scope.row.customerCode, 'value']}
              placeholder={'请输入客户编号'}
              onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
            />
          ),
        },
        {
          field: 'industryList',
          title: '行业',
          // slots: {
          //   default: ({ row: { industryList } }) => {
          //     return [<TaTableProTags data={industryList} tagConfig={{ color: 'green' }} />]
          //   },
          // },
          customEditRender: (scope) => {
            return (
              <Select
                vModel={[scope.row.industryList, 'value']}
                mode={'multiple'}
                options={industryOptions}
                onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
                placeholder={'请选择行业'}
              />
            )
          },
          customRender: (scope) => {
            return (
              <TaTableProTags
                data={scope.row.industryList}
                dataset={industryOptions}
                tagConfig={{ color: 'green' }}
              />
            )
          },
        },
        {
          field: 'valuation',
          title: '最新估值（万元）',
          customEditRender: (scope) => (
            <InputNumber
              vModel={[scope.row.valuation, 'value']}
              onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
              placeholder={'请输入最新估值（万元）'}
            />
          ),
        },
        {
          field: 'annualRevenue',
          title: '年度营收（万元）',
          customEditRender: (scope) => (
            <InputNumber
              vModel={[scope.row.annualRevenue, 'value']}
              onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
              placeholder={'请输入年度营收（万元）'}
            />
          ),
        },
        {
          field: 'latestFinancingAmount',
          title: '最新融资金额（万元）',
          customEditRender: (scope) => (
            <InputNumber
              vModel={[scope.row.latestFinancingAmount, 'value']}
              onChange={() => unref(tableRef)?.instance.updateStatus(scope)}
              placeholder={'请输入最新融资金额（万元）'}
            />
          ),
        },
        {
          field: 'createDate',
          title: '创建时间',
          customEditRender: (scope) => (
            <DatePicker vModel={[scope.row.createDate, 'value']} format={'YYYY-MM-DD HH:mm:ss'} />
          ),
          customRender: (scope) => {
            return formatToDateTime(scope.row.createDate || null)
          },
        },
      ]
    }

    // init filterForm&columns
    const initTablePro = async () => {
      state.filterForm = (await createFilterForm()) as any
      state.columns = await createColumns()
    }

    const handleCustomActionConfig = (): TableProCustomActionConfig => ({
      add: {
        permission: 'test',
        handleAction: (params) => {
          console.log(params)
        },
      },
      refresh: true,
    })

    const handleApi: TableProApi<Promise<any>> = async ({ filter, model }) => {
      const response = await API__POE_CUSTOM_ALL({
        filter: { ...filter, tab: 0 },
        model: { ...model },
      })

      response.data.result = response.data.result.map((item) => ({
        ...item,
        industryList: item.industryList.map((industry) => industry.id),
      }))

      return response
    }

    const handleFooterMethod: TableProFooterMethod = (params) => {
      const { columns, data } = params
      const meanNum = (list: any[], field: string) => {
        let count = 0
        list.forEach((item) => {
          count += Number(item[field])
        })
        return count / list.length
      }

      const sumNum = (list: any[], field: string) => {
        let count = 0
        list.forEach((item) => {
          count += Number(item[field])
        })
        return count
      }
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '平均'
          }
          if (['valuation', 'annualRevenue', 'latestFinancingAmount'].includes(column.field)) {
            return meanNum(data, column.field)
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '和值'
          }
          if (['valuation', 'annualRevenue', 'latestFinancingAmount'].includes(column.field)) {
            return sumNum(data, column.field)
          }
          return null
        }),
      ]
    }

    const handleCheckboxChange: TableProCheckboxChange = (params) => {
      console.log('handleCheckboxChange: ', params)
      console.log(unref(tableRef)?.instance?.getSelectRowKeys())
      setTimeout(() => {
        // unref(tableRef)?.instance?.reload({ clearSelect: true })
        // unref(tableRef)?.instance?.reload()
        // unref(tableRef)?.instance?.reload({ page: 1 })
        // unref(tableRef)?.instance?.clearSelectedRows()
        // unref(tableRef)?.instance?.clearSelectedRowByKey(3284)
        // unref(tableRef)?.instance?.setLoading(true)
      }, 1500)
    }

    const handleCheckboxAll: TableProCheckboxAll = (params) => {
      console.log('handleCheckboxAll: ', params)
      console.log(unref(tableRef)?.instance?.getTableColumn())
    }

    const handlePageChange = (info) => {
      console.log(info)
    }

    const handleInsert = async (type: 'top' | 'bottom') => {
      const record = {
        customerName: 'i7eo',
        customerCode: '3499',
        createDate: null,
      }
      const { row } = await unref(tableRef)!.instance.insertAt(record, type === 'bottom' ? -1 : 0)
      await unref(tableRef)!.instance.setEditCell(row, 'customerCode')
    }

    const handleRevert = () => {
      message.createConfirm({
        content: '确认要还原吗？一旦还原，您的修改会即刻丢失🥶',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unref(tableRef)!.instance.revertData()
        },
      })
    }
    const handleDelete = () => {
      const tableInstance = unref(tableRef)!.instance
      const selectedRows = tableInstance.getSelectRows()
      if (selectedRows.length) {
        message.createConfirm({
          content: '确认要删除吗？🥶',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            tableInstance.removeCheckboxRow()
          },
        })
      } else {
        message.createConfirm({
          content: '请至少选择一条数据🥶',
          okText: '确认',
          cancelText: '取消',
        })
      }
    }
    const handleSave = async () => {
      const $table = unref(tableRef)!.instance

      const errMap = await $table.fullValidate()
      if (errMap) {
        const msgList: string[] = []
        Object.values(errMap).forEach((errList: any) => {
          errList.forEach((params: any) => {
            const { rowIndex, column, rules } = params
            rules.forEach((rule: any) => {
              msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
            })
          })
        })
        message.createMessage.error(msgList.join('，'))
      } else {
        message.createMessage.success('校验成功！')
      }

      const { insertRecords, removeRecords, updateRecords } = $table.getRecordset()
      message.createMessage.success(
        `insertRecords=${insertRecords.length} removeRecords=${removeRecords.length} updateRecords=${updateRecords.length}`
      )
    }

    const wrapperHeight = ref('50%')
    const height = ref('20%')
    onMounted(async () => {
      await initTablePro()

      setTimeout(() => {
        wrapperHeight.value = '463px'
      }, 16.7)

      setTimeout(() => {
        height.value = '100%'
      }, 100)
    })

    return () => {
      const columns = state.columns as any
      const filterForm = state.filterForm as any
      return (
        <div
          style={{
            width: '80%',
            height: '968px',
            backgroundColor: '#f6f8ff',
            margin: '0 auto',
            overflow: 'auto',
          }}
        >
          <div style={{ width: '90%', height: unref(height), margin: '0 auto' }}>
            <TaTablePro
              ref={tableRef}
              rowConfig={{ keyField: 'id' }}
              loading={state.loading}
              filterFormConfig={filterForm}
              columns={columns}
              customActionConfig={handleCustomActionConfig()}
              api={handleApi}
              onCheckboxChange={handleCheckboxChange}
              onCheckboxAll={handleCheckboxAll}
              onPageChange={handlePageChange}
              fillInner={false}
              // 表尾
              showFooter={true}
              footerMethod={handleFooterMethod}
              // 如果让表格可编辑下面三个属性必须全开
              editConfig={{ trigger: 'click', mode: 'row', showStatus: true }}
              editRules={state.editRules}
              keepSource={true}
            >
              {{
                // filterForm: () => (<div>123</div>),
                customAction: () => (
                  <>
                    <Button
                      type={'primary'}
                      preIcon={'ant-design:redo-outlined'}
                      onClick={handleRevert}
                    >
                      还原数据
                    </Button>
                    <Button
                      type={'primary'}
                      preIcon={'ant-design:delete-filled'}
                      onClick={handleDelete}
                    >
                      删除数据
                    </Button>
                    <Button
                      type={'primary'}
                      preIcon={'ant-design:cloud-upload-outlined'}
                      onClick={handleSave}
                    >
                      保存数据
                    </Button>
                  </>
                ),
                bottom: () => (
                  <div class="insert" style={{ textAlign: 'center' }}>
                    <Button
                      type={'link'}
                      preIcon={'ant-design:plus-square-filled'}
                      onClick={() => handleInsert('top')}
                    >
                      插入数据
                    </Button>
                  </div>
                ),
              }}
            </TaTablePro>
          </div>
        </div>
      )
    }
  },
})
