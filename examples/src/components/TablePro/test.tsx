import { defineComponent, ref, unref } from 'vue'
import Button from '@tav-ui/components/button'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { API__POE_CUSTOM_ALL } from '@tav-ui/components/table-pro/src/data'
import { columns2, filterForm2 } from './data'
import type {
  TableProApi,
  TableProCheckboxAll,
  TableProCheckboxChange,
  TableProCustomActionConfig,
  TableProFilterFormConfig,
  TableProInstance,
  TableProProxyConfig,
} from '@tav-ui/components/table-pro'

export default defineComponent({
  setup() {
    const loading = ref<boolean>(false)

    const columns = columns2

    const tableRef = ref<TableProInstance | null>(null)

    // loading.value = true
    // setTimeout(() => {
    //   loading.value = false
    // }, 300)

    const handleFilterFormConfig = (): TableProFilterFormConfig => ({
      // enabled: false,
      ...filterForm2(),
    })

    const handleCustomActionConfig = (): TableProCustomActionConfig => ({
      add: {
        permission: 'test',
        handleAction: (params) => {
          console.log(params)
        },
      },
      refresh: true,
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
        model,
      })

    const handleCheckboxChange: TableProCheckboxChange = (params) => {
      console.log('handleCheckboxChange: ', params)
      console.log(unref(tableRef.value)?.getCheckboxRecords())
      // unref(tableRef.value)?.scrollTo(null, 0)
    }

    const handleCheckboxAll: TableProCheckboxAll = (params) => {
      console.log('handleCheckboxAll: ', params)
    }

    const handlePageChange = (info) => {
      console.log(info)
    }

    // onMounted(() => {
    //   unref(tableRef.value)?.commitProxy('query', {
    //     filter: {},
    //     model: { page: 1,
    //       limit: 50 }
    //   })
    // })

    return () => {
      return (
        <div
          style={{
            width: '80%',
            height: '100%',
            backgroundColor: '#f6f8ff',
            padding: '50px 0',
            margin: '0 auto',
          }}
        >
          <div style={{ width: '90%', height: '100%', margin: '0 auto' }}>
            <TaTablePro
              ref={tableRef}
              // data={MockData()}
              columns={columns()}
              loading={loading.value}
              height="auto"
              // height={500}
              filterFormConfig={handleFilterFormConfig()}
              customActionConfig={handleCustomActionConfig()}
              // proxyConfig={handleProxyConfig()}
              api={handleApi}
              onCheckboxChange={handleCheckboxChange}
              onCheckboxAll={handleCheckboxAll}
              onPageChange={handlePageChange}
            >
              {{
                // filterForm: () => (<div>123</div>),
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
              }}
            </TaTablePro>
          </div>
        </div>
      )
    }
  },
})
