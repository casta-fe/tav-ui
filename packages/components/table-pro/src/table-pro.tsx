import { computed, defineComponent, ref, unref, watchEffect } from 'vue'
import { setupVxeTable } from '@tav-ui/components/table-pro/src/setup'
import { mitt } from '@tav-ui/utils/mitt'
import ComponentEmpty from './components/empty'
import ComponentFilterForm from './components/filter-form'
import ComponentCustomAction from './components/custom-action'
import { CamelCaseToCls, ComponentName, ComponentOperationsName } from './const'
import { useListeners } from './hooks/useListeners'
import { tableProEmits, tableProProps } from './types'
import { useColumns } from './hooks/useColums'
import { useProps } from './hooks/useProps'
import { useDataSource } from './hooks/useDataSource'
import { createTableContext } from './hooks/useTableContext'
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

    // 注入数据
    createTableContext({ tableRef, tableEmitter })

    // 抛出实例
    expose(tableRef)

    // vxeGrid 渲染完毕
    watchEffect(() => {
      if (unref(tableRef.value)) {
        tableEmitter.emit('table-pro:dom-ready', {
          table: unref(tableRef.value)?.$el,
        })
      }
    })

    return () => {
      return (
        <div
          class={`${ComponentPrefixCls} ${
            unref(getBindValues).fillInner ? `${ComponentPrefixCls}--fill-inner` : ''
          }`}
        >
          <Grid ref={tableRef} {...unref(getBindValues)}>
            {{
              empty: () => <ComponentEmpty />,
              form: () =>
                unref(getBindValues).showOperations ? (
                  <div class={ComponentOperationsPrefixCls}>
                    <ComponentFilterForm
                      config={unref(getBindValues).filterFormConfig}
                      tableRef={tableRef}
                      tableSlots={slots}
                    />
                    <ComponentCustomAction
                      config={unref(getBindValues).customActionConfig}
                      tableRef={tableRef}
                      tableSlots={slots}
                    />
                  </div>
                ) : null,
            }}
          </Grid>
        </div>
      )
    }
  },
})
