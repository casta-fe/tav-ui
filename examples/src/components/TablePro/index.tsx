import { computed, defineComponent, provide, reactive, ref, unref } from 'vue'
import { TableAction, TableCustomAction } from '@tav-ui/components/table'
import { MockData } from '@tav-ui/components/table-pro/src/data'
import { setupVxeTable } from '@tav-ui/components/table-pro/src/setup'
import { tableProProps } from '@tav-ui/components/table-pro/src/types'
import { mitt } from '@tav-ui/utils/mitt'
import type { TableProProps } from '@tav-ui/components/table-pro/src/types'
import '@tav-ui/theme-chalk/src/components/table-pro.less'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'

const { Grid } = setupVxeTable()

// 选中的回调

export default defineComponent({
  name: 'TaTablePro',
  props: tableProProps,
  setup(props) {
    // 表格 props
    const innerPropsRef = ref<Partial<TableProProps>>()
    // 兼容传入 table-pro 与 vxetable 的 props
    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as TableProProps
    })
    console.log(getProps.value)

    // 获取实例
    const VxeGridRef = ref<VxeGridInstance | null>(null)

    // 注入 table 顶层 emitter
    const tableEmitter = mitt()
    provide('tableEmitter', tableEmitter)

    const gridOptions2 = reactive<VxeGridProps>({
      height: 500, // 暴漏
      columns: [
        { type: 'checkbox', width: 50 },
        { field: 'name', title: 'Name', width: 500 },
        { field: 'sex', title: 'Sex', width: 500 },
        { field: 'role', title: 'Role' },
        {
          field: 'avator',
          title: 'Avator',
          slots: {
            default: 'avator',
          },
        },
        {
          field: 'address',
          title:
            'AddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddressAddress',
          width: 1000,
        },
        {
          field: 'actions',
          title: 'Actions',
          slots: {
            default: 'actions',
          },
        },
      ], // 暴漏
      data: MockData(), // 暴漏

      loading: false, // 暴漏
      showOverflow: true,
      showHeaderOverflow: true,
      showFooterOverflow: true,
      size: 'small',
      border: 'inner',
      checkboxConfig: {
        highlight: true,
        range: true,
      },
      // 开启虚拟滚动后必须指定行高，想用动态行高则需关闭虚拟滚动
      resizable: true,
      highlightHoverRow: true,
    })

    gridOptions2.loading = true
    setTimeout(() => {
      gridOptions2.loading = false
    }, 300)

    const handleCheckboxChange = () => {
      const $grid = VxeGridRef.value
      console.log('check one')
      console.log($grid?.getCheckboxRecords())
    }

    const handleCheckboxAll = () => {
      const $grid = VxeGridRef?.value
      console.log('check all: ', $grid)
    }

    return () => {
      return (
        <div class="ta-table-pro">
          <Grid
            ref={VxeGridRef}
            {...gridOptions2}
            onCheckboxChange={handleCheckboxChange}
            onCheckboxAll={handleCheckboxAll}
          >
            {{
              form: () => (
                <div class="ta-table-pro-operations">
                  {/* <TableFilter /> */}
                  <TableCustomAction />
                </div>
              ),
              top: () => (
                <div class="alert-message">
                  <span class="alert-message-content">
                    <div>自定义模板</div>
                  </span>
                </div>
              ),
              avator: ({ row }) => {
                // console.log(row)
                return row.avator ? <img src={row.avator} style="width: 100px;" /> : <span>无</span>
              },
              actions: () => {
                return (
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
                  />
                )
              },
            }}
          </Grid>
        </div>
      )
    }
  },
})
