import { defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { TaTablePro, XLSXFormats, getTableProId } from '@tav-ui/components/table-pro'
import { formatToExcelTime } from '@tav-ui/utils'
import {
  API__POE_CUSTOM_ALL,
  API__POE_CUSTOM_ALL_LIST,
} from '@tav-ui/components/table-pro/src/data'
import Button from '@tav-ui/components/button'
import { columns1, filterForm2, footerMethod1 } from './data'
import type {
  ITableProInstance,
  TableProApi,
  TableProCheckboxAll,
  TableProCheckboxChange,
  TableProCustomActionConfig,
} from '@tav-ui/components/table-pro'

export default defineComponent({
  setup() {
    const router = useRouter()
    const id = ref<string>('')
    id.value = getTableProId(router, 'play')!
    const state = reactive({
      filterFormConfig: {},
      columns: [] as any[],
    })

    const loading = ref<boolean>(false)

    // const columns = columns1

    const tableRef = ref<ITableProInstance | null>(null)

    onMounted(async () => {
      state.filterFormConfig = await filterForm2()
      state.columns = await columns1()

      // setTimeout(() => {
      //   console.log(123)
      //   var _columns = [...state.columns]
      //   _columns[_columns.length - 1].visible = false
      //   state.columns = [..._columns]
      // }, 1500)
    })

    const handleCustomActionConfig = (): TableProCustomActionConfig => ({
      add: {
        permission: 'test',
        handleAction: (params) => {
          console.log(params)
        },
      },
      export: {
        columns: [
          // {
          //   field: 'round',
          // },
          {
            field: 'id',
            title: 'ID',
          },
          {
            field: 'customerName',
            title: '客户名称',
            // cellContent: ({ row: { customerName } }) => {
            //   return `${customerName}123`
            // },
          },
          {
            field: 'customerCode',
            title: '客户编号',
          },
          {
            field: 'latestFinancingAmount',
            title: '最新融资金额（万元）',
          },
          {
            field: 'customerType',
            title: '客户类型',
          },
          // 与下面重复了，保留一个即可
          // {
          //   field: 'classification',
          //   title: '分类'
          // },
          {
            field: 'classificationValue',
            title: '客户分类',
          },
          {
            field: 'valuation',
            title: '最新估值（万元）',
          },
          {
            field: 'annualRevenue',
            title: '年度营收（万元）',
            cellFormat: () => XLSXFormats['number|0.000000'],
          },
          {
            field: 'financing',
            title: '融资情况（万元）',
          },
          // 与下面重复了，保留一个即可
          // {
          //   field: 'shareholderList',
          //   title: '主要股东列表'
          // },
          {
            field: 'shareholder',
            title: '主要股东',
          },
          {
            field: 'sourceType',
            title: '客户来源',
          },
          {
            field: 'sourceOther',
            title: '客户来源——其他',
          },
          // 与下面重复了，保留一个即可
          // {
          //   field: 'owner',
          //   title: '客户负责ID'
          // },
          // {
          //   field: 'ownerName',
          //   title: '客户负责人',
          // },
          {
            field: 'country',
            title: '国家',
          },
          {
            field: 'province',
            title: '省份',
          },
          {
            field: 'city',
            title: '城市',
          },
          {
            field: 'districts',
            title: '区/县',
          },
          {
            field: 'address',
            title: '注册地',
          },
          {
            field: 'compnayProfile',
            title: '企业简介',
          },
          {
            field: 'teamProfile',
            title: '团队概况',
          },
          {
            field: 'incomeProfile',
            title: '收入概况',
          },
          {
            field: 'businessProfile',
            title: '业务概况',
          },
          {
            field: 'industrialChain',
            title: '产业链',
          },
          {
            field: 'visitCount',
            title: '拜访记录条数',
          },
          {
            field: 'industryList',
            title: '行业列表',
          },
          {
            field: 'applicationList',
            title: '应用领域列表',
          },
          {
            field: 'creditCode',
            title: '统一社会信用代码',
          },
          {
            field: 'technologyList',
            title: '技术标签列表',
          },
          {
            field: 'technology',
            title: '技术标签',
          },
          {
            field: 'establishResult',
            title: '立项结果',
          },
          {
            field: 'pay',
            title: '是否付费',
          },
          {
            field: 'createBy',
            title: '创建人',
          },
          {
            field: 'createByName',
            title: '创建人名称',
          },
          {
            field: 'createDate',
            title: '创建日期',
            // cellFormat: (cell) => {
            //   cell.value = formatToExcelTime(cell.value)
            //   return XLSXFormats.date
            // },
          },
          {
            field: 'updateBy',
            title: '变更人',
          },
          {
            field: 'updateDate',
            title: '变更日期',
          },
          {
            field: 'serviceNum',
            title: '服务项目数量',
          },
          {
            field: 'serviceDetail',
            title: '服务项目详情',
          },
          {
            field: 'deleted',
            title: '删除状态',
          },
        ],
        handleAction: (params) => {
          console.log(params)
        },
        handleDescription: () => 'dsahdjkashjkda',
        // handleAllApi: () => API__POE_CUSTOM_ALL_LIST({}),
        // handleBackendApi: async ({ filter, model }) => {
        //   console.log(filter, model)
        // },
      },
      refresh: true,
      statistical: {
        handleAction: (params) => {
          console.log(params)
        },
      },
      column: true,
    })

    const handleApi: TableProApi<Promise<any>> = ({ filter, model }) =>
      API__POE_CUSTOM_ALL({
        filter: { ...filter, tab: 0 },
        model: { ...model },
      })

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

    const wrapperHeight = ref('50%')
    const height = ref('20%')
    onMounted(() => {
      setTimeout(() => {
        wrapperHeight.value = '463px'
      }, 16.7)

      setTimeout(() => {
        height.value = '100%'
      }, 100)
    })

    // onMounted(() => {
    //   unref(tableRef.value)?.commitProxy('query', {
    //     filter: {},
    //     model: { page: 1,
    //       limit: 50 }
    //   })
    // })

    return () => {
      return (
        // <div style={{ height: unref(wrapperHeight), overflow: 'hidden' }}>
        //   <div class="ta-page-tabs" style={{ padding: '16px 24px 0' }}>
        //     <div class="ta-button-group">
        //       <div class="ta-button-group-inner">
        //         <button
        //           iconsize="14"
        //           ifshow="true"
        //           class="ant-btn ant-btn-primary ta-basic-button"
        //           type="button"
        //         >
        //           <span>我参与的</span>
        //           <span>（5）</span>
        //         </button>
        //         <button
        //           iconsize="14"
        //           ifshow="true"
        //           class="ant-btn ant-btn-default ta-basic-button"
        //           type="button"
        //         >
        //           <span>待审核</span>
        //           <span>（0）</span>
        //         </button>
        //         <button
        //           iconsize="14"
        //           ifshow="true"
        //           class="ant-btn ant-btn-default ta-basic-button"
        //           type="button"
        //         >
        //           <span>我关注的</span>
        //           <span>（0）</span>
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        <div
          style={{
            width: '80%',
            height: '100%',
            backgroundColor: '#f6f8ff',
            margin: '0 auto',
            overflow: 'auto',
          }}
        >
          <div style={{ width: '90%', height: unref(height), margin: '0 auto' }}>
            {/* <div style={{ height: unref(height), padding: '16px 24px 0' }}> */}
            <TaTablePro
              id={unref(id)}
              ref={tableRef}
              // pagerConfig={{ enabled: false }}
              rowConfig={{ keyField: 'id' }}
              // data={MockData()}
              // columns={columns()}
              columns={state.columns}
              loading={loading.value}
              // filterFormConfig={handleFilterFormConfig()}
              filterFormConfig={state.filterFormConfig}
              // filterFormConfig={{ enabled: false }}
              customActionConfig={handleCustomActionConfig()}
              // proxyConfig={handleProxyConfig()}
              api={handleApi}
              onCheckboxChange={handleCheckboxChange}
              onCheckboxAll={handleCheckboxAll}
              onPageChange={handlePageChange}
              fillInner={false}
              showFooter={true}
              footerMethod={footerMethod1}
              // 虚拟滚动情况下，要么设置 fixedLineHeight 为 false，要么设置 original 为 true 否则导出有问题
              // fixedLineHeight={false}
              // pagerConfig={{ enabled: false }}
            >
              {{
                // filterForm: () => <div>123</div>,
                customAction: () => (
                  <>
                    <Button type={'primary'} preIcon={'ant-design:edit-filled'}>
                      变更负责人
                    </Button>
                    <Button type={'primary'} preIcon={'ant-design:setting-filled'}>
                      设置分组
                    </Button>
                  </>
                ),
                // customerType: ({ row: { customerType } }) => (
                //   <>
                //   {customerType}
                //   </>
                // )
                statisticalList: () => (
                  <div style={{ height: '200px', backgroundColor: '#ccc' }}>12</div>
                ),
              }}
            </TaTablePro>
          </div>
          {/* </div> */}
        </div>
      )
    }
  },
})
