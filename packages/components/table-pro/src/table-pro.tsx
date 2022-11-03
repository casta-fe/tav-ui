import { computed, defineComponent, ref, toRefs, unref } from 'vue'
import { mitt } from '@tav-ui/utils/mitt'
import { useHideTooltips } from '@tav-ui/hooks/web/useTooltip'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
// import TaCollapseTransition from '@tav-ui/components/transition'
import { onUnmountedOrOnDeactivated } from '@tav-ui/hooks/core/onUnmountedOrOnDeactivated'
import ComponentCustomAction from './components/custom-action'
import ComponentEmpty from './components/empty'
import ComponentFilterForm from './components/filter-form'
import { CamelCaseToCls, ComponentName, ComponentOperationsName, buildTableId } from './const'
import { useCellHover } from './hooks/useCellHover'
import { useColumnApi } from './hooks/useColumnApi'
import { useColumns } from './hooks/useColums'
import { useDataSource } from './hooks/useDataSource'
import { useExtendInstance } from './hooks/useExtendInstance'
import { useFixHeight, useHeight } from './hooks/useHeight'
import { useListeners } from './hooks/useListeners'
import { useLoading } from './hooks/useLoading'
import { useProps } from './hooks/useProps'
import { createTableContext } from './hooks/useTableContext'
import { useWatchDom } from './hooks/useWatchDom'
import { setupVxeTable } from './setup'
import { tableProEmits, tableProProps } from './types'
import type { ComputedRef } from 'vue'
import type { TableProEvent, TableProInstance, TableProProps } from './types'
import type { CustomActionRef } from './typings'

const _VXETable = setupVxeTable()
const { Grid } = _VXETable
export const VXETable = _VXETable
const ComponentPrefixCls = CamelCaseToCls(ComponentName)
const ComponentOperationsPrefixCls = CamelCaseToCls(ComponentOperationsName)

export default defineComponent({
  name: ComponentName,
  props: tableProProps,
  emits: tableProEmits,
  setup(props, { slots, attrs, expose, emit }) {
    // 获取实例
    const tableRef = ref<TableProInstance | null>(null)
    const filterRef = ref<ComputedRef | null>(null)
    const customActionRef = ref<CustomActionRef | null>(null)

    // 注册 tablepro emitter
    const tableEmitter = mitt()

    // 表格 props
    const _getProps = computed(() => {
      return { ...props, id: props.id ?? buildTableId() } as TableProProps
    })

    // 根据 default 生成默认属性并与传入的 props 合并
    const getProps = useProps(tableProProps, _getProps, tableRef, emit)

    // 扩展 columns
    const getColumns = computed(() => {
      return { columns: useColumns(getProps, tableRef, emit) }
    })

    // 列持久化处理
    const columnApiOptions = useColumnApi(getProps, useGlobalConfig())
    columnApiOptions?.useCachedColumnCoverCurrentColumns(getColumns, customActionRef as any)

    // 透传 attr
    const getAttrs = computed(() => {
      return { ...attrs } as any
    })

    // 透传 listener
    const getListeners = useListeners(emit)

    // extend props&apis
    const { loading, setLoading } = useLoading(getProps)

    // 手动处理单元格 tooltip
    const { onCellMouseenter, onCellMouseleave, instances } = useCellHover(getProps, emit)

    // 监听全局鼠标滚动取消cell tooltip
    useHideTooltips(instances)

    // merge v-bind value
    const getBindValues = computed<TableProProps & TableProEvent>(() => ({
      ...unref(getProps),
      ...unref(getColumns),
      ...unref(getAttrs),
      ...unref(getListeners),
      onCellMouseenter,
      onCellMouseleave,
      loading: unref(loading),
    }))

    // 数据处理
    useDataSource(getProps, tableRef)

    // 执行dom监听的处理
    useWatchDom(getProps, tableRef, customActionRef, tableEmitter)

    // 注入数据
    createTableContext({ tableRef, tableEmitter, tablePropsRef: getBindValues, columnApiOptions })

    // 抛出实例
    expose({ ...toRefs(useExtendInstance(tableRef, getProps, { setLoading }, filterRef)) })

    // 类名处理
    const getWrapperClass = computed(() => {
      const values = unref(getBindValues)
      return [
        // ComponentPrefixCls,
        attrs.class,
        `${ComponentPrefixCls}-wrapper`,
        {
          [`${ComponentPrefixCls}--fill-inner`]: values.fillInner,
        },
      ]
    })

    // 统计面板
    const statisticalShow = ref(false)
    const triggerStatistical = () => {
      statisticalShow.value = !statisticalShow.value
      setTimeout(() => {
        setHeight()
      }, 0)
    }

    // components
    function createOperation() {
      const values = unref(getBindValues)
      const isFilterFormHasContent =
        values.filterFormConfig.inputForm || values.filterFormConfig.pannelForm
      const isCustomActionHasContent =
        values.customActionConfig.add ||
        values.customActionConfig.delete ||
        values.customActionConfig.export ||
        values.customActionConfig.import ||
        values.customActionConfig.refresh ||
        slots.customAction
      return values.showOperations && (isFilterFormHasContent || isCustomActionHasContent) ? (
        <div class={ComponentOperationsPrefixCls} ref={operationRef}>
          <ComponentFilterForm
            ref={filterRef}
            config={values.filterFormConfig}
            tableRef={tableRef}
            tableSlots={slots}
          />
          <ComponentCustomAction
            ref={customActionRef}
            config={values.customActionConfig}
            tableRef={tableRef}
            tableSlots={slots}
            onTriggerStatistical={triggerStatistical}
          />
          {/* <TaCollapseTransition> */}
          <div v-show={statisticalShow.value} class={`${ComponentOperationsPrefixCls}-statistical`}>
            {slots?.statisticalList?.()}
          </div>
          {/* </TaCollapseTransition> */}
        </div>
      ) : null
    }

    // 表格高度，height设置百分比会跳动，设置auto后需要手动把剩余空间的高度计算后赋值
    const { wrapperRef, operationRef, getHeight, setHeight } = useHeight()
    useFixHeight(tableRef, wrapperRef, setHeight, tableEmitter)

    onUnmountedOrOnDeactivated(() => {
      // 鼠标不移出单元格直接单击跳转时要移出正在显示的提示
      onCellMouseleave()
    })

    return () => {
      return (
        <div class={unref(getWrapperClass)} ref={wrapperRef} id={unref(getBindValues).id}>
          {createOperation()}
          <div class={ComponentPrefixCls} style={{ height: unref(getHeight) }}>
            <Grid
              ref={tableRef}
              {...unref(getBindValues)}
              onPageChange={(...args) => {
                unref(getBindValues).onPageChange?.(...args)
                instances.clear()
              }}
              onSortChange={(...args) => {
                unref(getBindValues).onSortChange?.(...args)
                instances.clear()
              }}
            >
              {{
                empty: () => <ComponentEmpty />,
                ...slots,
              }}
            </Grid>
          </div>
        </div>
      )
    }
  },
})
