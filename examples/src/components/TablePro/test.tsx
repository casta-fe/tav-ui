import { defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { TaTablePro, getTableProId } from '@tav-ui/components/table-pro'
import { API__POE_CUSTOM_ALL } from '@tav-ui/components/table-pro/src/data'
import Button from '@tav-ui/components/button'
import { TaModal, useModal } from '@tav-ui/components/modal'
import { columns2, filterForm2 } from './data'
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
    const handleRoutePush = (e: Event, opts: any) => {
      e.stopPropagation()
      router.push({
        ...opts,
      })
    }
    const loading = ref<boolean>(false)

    // const columns = columns2

    const tableRef = ref<ITableProInstance | null>(null)

    // loading.value = true
    // setTimeout(() => {
    //   loading.value = false
    // }, 300)

    // const handleFilterFormConfig = (): TableProFilterFormConfig => ({
    //   // enabled: false,
    //   ...filterForm2(),
    // })

    const [ModalRegister, { openModal: OpenModal, closeModal: CloseModal }] = useModal()

    onMounted(async () => {
      state.filterFormConfig = await filterForm2()
      state.columns = await columns2({ handleRoutePush, OpenModal })
    })

    const handleCustomActionConfig = (): TableProCustomActionConfig => ({
      add: {
        permission: 'test',
        handleAction: (params) => {
          console.log(params)
        },
      },
      refresh: true,
      statistical: {
        handleAction: (params) => {
          console.log(params)
        },
      },
      column: true,
    })

    // const handleProxyConfig = (): TableProProxyConfig => ({
    //   // autoLoad: false,
    //   props: {
    //     result: 'data.result',
    //     total: 'data.total',
    //   },
    //   ajax: {
    //     query: (info) => {
    //       console.log(info)
    //       // API__POE_INVEST_ALL({
    //       //   filter: {},
    //       //   model: { page: 1, limit: 50 },
    //       // }),
    //       const result = API__POE_CUSTOM_ALL({
    //         filter: { tab: 0 },
    //         model: { page: 1, limit: 300 },
    //       })

    //       return Promise.resolve(result)
    //     },
    //   },
    // })

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
          <TaModal
            height={500}
            title="新增"
            width={864}
            destroy-on-close={true}
            onRegister={ModalRegister}
          >
            123
          </TaModal>
        </div>
      )
    }
  },
})
