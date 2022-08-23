import { defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { API__POE_MENU_ALL } from '@tav-ui/components/table-pro/src/data'
import Button from '@tav-ui/components/button'
import { columns3, filterForm2 } from './data'
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
    const tableRef = ref<ITableProInstance | null>(null)

    onMounted(async () => {
      state.filterFormConfig = await filterForm2()
      state.columns = await columns3({ handleRoutePush })
    })

    const handleCustomActionConfig = (): TableProCustomActionConfig => ({
      add: {
        permission: 'test',
        handleAction: (params) => {
          console.log(params)
        },
      },
      export: {
        handleAction: (params) => {
          console.log(params)
        },
      },
      refresh: true,
    })

    const handleApi: TableProApi<Promise<any>> = ({ filter, model }) =>
      API__POE_MENU_ALL({
        filter: { ...filter, tab: 0 },
        model: { ...model },
      })

    const handleCheckboxChange: TableProCheckboxChange = (params) => {
      console.log('handleCheckboxChange: ', params)
      console.log(unref(tableRef)?.instance?.getSelectRowKeys())
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

    return () => {
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
              columns={state.columns}
              loading={loading.value}
              filterFormConfig={state.filterFormConfig}
              customActionConfig={handleCustomActionConfig()}
              api={handleApi}
              onCheckboxChange={handleCheckboxChange}
              onCheckboxAll={handleCheckboxAll}
              onPageChange={handlePageChange}
              fillInner={false}
              treeConfig={{
                rowField: 'id',
                parentField: 'parentId',
                children: 'children',
                // transform: true
                iconOpen: 'vxe-icon-caret-bottom',
                iconClose: 'vxe-icon-caret-right',
              }}
              apiSetting={{
                listField: '',
              }}
              checkboxConfig={{
                enabled: false,
                range: false,
              }}
              pagerConfig={{ enabled: false }}
              exportAllApi={({ filter, model }) =>
                API__POE_MENU_ALL({
                  filter,
                  model: {
                    ...model,
                    // page: 7,
                  },
                })
              }
            >
              {{
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
