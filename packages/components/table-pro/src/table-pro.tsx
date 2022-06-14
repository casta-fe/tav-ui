import { computed, defineComponent, ref, toRefs, unref } from 'vue'
import { setupVxeTable } from '@tav-ui/components/table-pro/src/setup'
import { mitt } from '@tav-ui/utils/mitt'
import ComponentCustomAction from './components/custom-action'
import ComponentEmpty from './components/empty'
import ComponentFilterForm from './components/filter-form'
import { CamelCaseToCls, ComponentName, ComponentOperationsName } from './const'
import { useColumns } from './hooks/useColums'
import { useDataSource } from './hooks/useDataSource'
import { useListeners } from './hooks/useListeners'
import { useProps } from './hooks/useProps'
import { createTableContext } from './hooks/useTableContext'
import { useWatchDom } from './hooks/useWatchDom'
import { tableProEmits, tableProProps } from './types'
import { useExtendInstance } from './hooks/useExtendInstance'
// import { isBoolean } from '@tav-ui/utils/is'
import type { TableProEvent, TableProInstance, TableProProps } from './types'

const { Grid } = setupVxeTable()
const ComponentPrefixCls = CamelCaseToCls(ComponentName)
const ComponentOperationsPrefixCls = CamelCaseToCls(ComponentOperationsName)

export default defineComponent({
  name: ComponentName,
  props: tableProProps,
  emits: tableProEmits,
  setup(props, { slots, attrs, expose, emit }) {
    // 获取实例
    const tableRef = ref<TableProInstance | null>(null)

    // 注册 tablepro emitter
    const tableEmitter = mitt()

    // 表格 props
    const _getProps = computed(() => {
      return { ...props } as TableProProps
    })

    // 根据 default 生成默认属性并与传入的 props 合并
    const getProps = useProps(tableProProps, _getProps, tableRef, emit)

    // 扩展 columns
    const getColumns = computed(() => {
      return { columns: useColumns(getProps) }
    })

    // 透传 attr
    const getAttrs = computed(() => {
      return { ...attrs } as any
    })

    // 透传 listener
    const getListeners = useListeners(emit)

    // merge v-bind value
    const getBindValues = computed<TableProProps & TableProEvent>(() => ({
      ...unref(getProps),
      ...unref(getColumns),
      ...unref(getAttrs),
      ...unref(getListeners),
    }))

    // 数据处理
    useDataSource(getProps, tableRef)

    // 执行dom监听的处理
    useWatchDom(getProps, tableRef, tableEmitter)

    // 注入数据
    createTableContext({ tableRef, tableEmitter })

    // 抛出实例
    expose({ ...toRefs(useExtendInstance(tableRef, getProps)) })

    // 类名处理
    const getWrapperClass = computed(() => {
      const values = unref(getBindValues)
      return [
        ComponentPrefixCls,
        attrs.class,
        {
          [`${ComponentPrefixCls}--fill-inner`]: values.fillInner,
          // [`${ComponentPrefixCls}--pager-disabled`]: isBoolean(values.pagerConfig.enabled) && !values.pagerConfig.enabled,
        },
      ]
    })

    // components
    function createOperation() {
      const values = unref(getBindValues)
      return values.showOperations ? (
        <div class={ComponentOperationsPrefixCls}>
          <ComponentFilterForm
            config={values.filterFormConfig}
            tableRef={tableRef}
            tableSlots={slots}
          />
          <ComponentCustomAction
            config={values.customActionConfig}
            tableRef={tableRef}
            tableSlots={slots}
          />
        </div>
      ) : null
    }

    return () => {
      return (
        <div class={unref(getWrapperClass)}>
          <Grid ref={tableRef} {...unref(getBindValues)}>
            {{
              empty: () => <ComponentEmpty />,
              form: () => createOperation(),
              ...slots,
            }}
          </Grid>
        </div>
      )
    }
  },
})
