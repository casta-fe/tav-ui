import { defineComponent, reactive, ref } from 'vue'
import { Grid as VxeGrid } from 'vxe-table'
import { TaButton } from '@tav-ui/components/button'
import { TableAction } from '@tav-ui/components/table'
import { MockData } from './data'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'
// import './index.less'

// 选中的回调

export default defineComponent({
  name: 'TaTablePro',
  components: {},
  props: {},
  setup() {
    const VxeGridRef = ref<VxeGridInstance | null>(null)
    const gridOptions2 = reactive<VxeGridProps>({
      showOverflow: true,
      showHeaderOverflow: true,
      showFooterOverflow: true,
      size: 'small',
      border: 'inner',
      loading: false, // 暴漏
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
      checkboxConfig: {
        highlight: true,
        range: true,
      },
      // 开启虚拟滚动后必须指定行高，想用动态行高则需关闭虚拟滚动
      resizable: true,
      highlightHoverRow: true,
      toolbarConfig: {
        custom: true,
        slots: {
          buttons: 'toolbar_buttons',
          tools: 'toolbar_tools',
        },
      },
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
          <VxeGrid
            ref={VxeGridRef}
            {...gridOptions2}
            onCheckboxChange={handleCheckboxChange}
            onCheckboxAll={handleCheckboxAll}
          >
            {{
              form: () => (
                <div class="ta-table-pro-operations">
                  <TaButton preIcon="ant-design:account-book-filled">123</TaButton>
                </div>
              ),
              toolbar_buttons: () => (
                <TaButton preIcon="ant-design:account-book-filled">456</TaButton>
              ),
              toolbar_tools: () => (
                <TaButton preIcon="ant-design:account-book-filled">789</TaButton>
              ),
              top: () => (
                <div class="alert-message">
                  <span class="alert-message-content">
                    <div>自定义模板</div>
                  </span>
                </div>
              ),
              avator: ({ row }) => {
                console.log(row)
                return row.avator ? <img src={row.avator} style="width: 100px;" /> : <span>无</span>
              },
              actions: () => {
                return (
                  // <>
                  // <TaButton preIcon="ant-design:account-book-filled">123</TaButton>
                  // <TaButton preIcon="ant-design:account-book-filled">456</TaButton>
                  // <TaButton preIcon="ant-design:account-book-filled">789</TaButton>
                  // </>
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
          </VxeGrid>
        </div>
      )
    }
  },
})
