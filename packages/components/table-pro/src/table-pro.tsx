import { computed, defineComponent, ref, toRefs, unref, watch } from 'vue'
import { mitt } from '@tav-ui/utils/mitt'
import { useHideTooltips } from '@tav-ui/hooks/web/useTooltip'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
// import TaCollapseTransition from '@tav-ui/components/transition'
import { onUnmountedOrOnDeactivated } from '@tav-ui/hooks/core/onUnmountedOrOnDeactivated'
import { onMountedOrActivated } from '@tav-ui/hooks/core/onMountedOrActivated'
import ComponentCustomAction from './components/custom-action'
import ComponentEmpty from './components/empty'
import ComponentFilterForm from './components/filter-form'
import {
  ACTION_COLUMNS,
  CamelCaseToCls,
  ComponentName,
  ComponentOperationsName,
  buildTableId,
} from './const'
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
import { useCanvasCalcContent } from './hooks/useColumnAutoWidth'
import type { ComputedRef } from 'vue'
import type { TableProColumn, TableProEvent, TableProInstance, TableProProps } from './types'
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
    const cacheActionWidths = ref<Record<string, any>>({})
    // const columnsForAction = ref<TableProColumn[]>([])
    const maxWidthForAction = ref<number>(0)

    // 注册 tablepro emitter
    const tableEmitter = mitt()

    // 数据返回的时机当作表格内部渲染完毕的时机
    const isTableProRendered = computed(() => {
      return (
        JSON.stringify(unref(tableRef)?.getTableData().visibleData) &&
        JSON.stringify(unref(tableRef)?.getTableData().visibleData) !== '[]'
      )
    })

    // 表格 props
    const _getProps = computed(() => {
      return { ...props, id: props.id ?? buildTableId() } as TableProProps
    })

    // 根据 default 生成默认属性并与传入的 props 合并
    const getProps = useProps(tableProProps, _getProps, tableRef, emit)

    // 扩展 columns
    const getColumns = computed(() => {
      // const columns: TableProColumn[] = useColumns(getProps, tableRef, emit)
      const columns: TableProColumn[] = useColumns(
        unref(getProps).columns,
        unref(getProps).checkboxConfig,
        unref(getProps).radioConfig,
        tableRef,
        emit
      )
      return { columns }
    })

    // 列持久化处理
    // const columnApiOptions = useColumnApi(getProps, useGlobalConfig(), tableEmitter)
    const columnApiOptions = useColumnApi(
      unref(getProps).id,
      unref(getProps).customActionConfig.column,
      useGlobalConfig(),
      tableEmitter
    )

    // columnApiOptions?.useCachedColumnCoverCurrentColumns(getColumns, customActionRef as any)
    watch(
      () => unref(isTableProRendered),
      (isRendered) => {
        if (isRendered) {
          columnApiOptions?.useCachedColumnCoverCurrentColumns(getColumns, customActionRef as any)
        }
      }
    )

    // 透传 attr
    const getAttrs = computed(() => {
      return { ...attrs } as any
    })

    // 透传 listener
    const getListeners = useListeners(emit)

    // extend props&apis
    const { loading, setLoading } = useLoading(getProps)
    // const { loading, setLoading } = useLoading(unref(getProps).loading)

    // 手动处理单元格 tooltip
    const { onCellMouseenter, onCellMouseleave, instances } = useCellHover(getProps, emit)
    // const { onCellMouseenter, onCellMouseleave, instances } = useCellHover(
    //   unref(getProps).id,
    //   unref(getProps).showTooltip,
    //   emit
    // )

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
    // useDataSource(
    //   unref(getProps).api,
    //   unref(getProps).immediate,
    //   unref(getProps).pagerConfig,
    //   tableRef
    // )

    // 执行dom监听的处理
    useWatchDom(tableRef, customActionRef, tableEmitter)

    const { calcContent, clearCalcContentCanvas } = useCanvasCalcContent()
    // 统计 action 渲染数据，动态设置宽度
    const setCacheActionWidths = ({ key = '', value = 0 }) => {
      if (key) {
        cacheActionWidths.value[key] = value
      }
    }
    function handleNotPersistentColumnActionWidth() {
      const tableData = unref(tableRef)?.getTableData().tableData
      const maxWidth = Math.max(...Object.values(unref(cacheActionWidths)))
      if (tableData && maxWidth > unref(maxWidthForAction)) {
        // const currentColumns = unref(getColumns).columns
        const currentColumns = unref(tableRef)?.getTableColumn().collectColumn
        // const columns = currentColumns!.map((column) => {
        //   if (column.field && ACTION_COLUMNS.includes(column.field)) {
        //     column.width = Math.ceil(maxWidth)
        //     column.minWidth = Math.ceil(maxWidth)
        //     // if (column.width) {
        //     //   //@ts-ignore
        //     //   column.width = undefined
        //     // }
        //     // if (column.maxWidth) {
        //     //   //@ts-ignore
        //     //   column.maxWidth = undefined
        //     // }
        //     return column
        //   }
        //   return column
        // })
        const isSomeColumnSetWidth = currentColumns!.some((column) => !!column.width)
        const columns = [] as any[]
        let actionPrevColumnHandled = false
        for (let i = currentColumns!.length - 1; i >= 0; i--) {
          const _column = currentColumns![i]
          if (_column.field) {
            if (ACTION_COLUMNS.includes(_column.field)) {
              _column.width = Math.ceil(maxWidth)
              _column.minWidth = Math.ceil(maxWidth)
            } else if (
              _column.visible &&
              !_column.fixed &&
              !actionPrevColumnHandled &&
              !isSomeColumnSetWidth
            ) {
              if (_column.width) {
                _column.minWidth = _column.width
              }
              //@ts-ignore
              _column.width = undefined
              //@ts-ignore
              _column.maxWidth = undefined
              actionPrevColumnHandled = true
            }
          }
          columns.unshift(_column)
        }
        // columnsForAction.value = columns
        unref(tableRef)?.loadColumn(columns)
        unref(tableRef)?.recalculate()
        maxWidthForAction.value = maxWidth
      }
    }
    if (columnApiOptions && unref(getBindValues).customActionConfig.column) {
      // 开启了列持久化
      tableEmitter.on('table-pro:column-covered', () => {
        handleNotPersistentColumnActionWidth()
      })

      // 开启了列持久化但是无持久化数据
      tableEmitter.on('table-pro:column-covered-no-data', () => {
        handleNotPersistentColumnActionWidth()
      })
    }
    watch(
      () => JSON.stringify(cacheActionWidths.value),
      () => {
        handleNotPersistentColumnActionWidth()
      }
    )

    // 表格高度，height设置百分比会跳动，设置auto后需要手动把剩余空间的高度计算后赋值
    const { wrapperRef, operationRef, getHeight, setHeight } = useHeight()
    useFixHeight(tableRef, wrapperRef, setHeight, tableEmitter, getProps)

    // 注入数据
    createTableContext({
      tableRef,
      tableEmitter,
      tablePropsRef: getBindValues,
      columnApiOptions,
      setCacheActionWidths,
      calcContent,
    })

    // 抛出实例
    expose({
      ...toRefs(
        useExtendInstance(
          tableRef,
          getProps,
          {
            setLoading,
            resetFilterInput: () => filterRef.value.resetFilterInput(),
            resizeTableHeight: setHeight,
            showExportModal: () => {
              customActionRef.value?.showExportModal()
            },
            showColumnsModa: () => {
              customActionRef.value?.showColumnsModa()
            },
          },
          filterRef
        )
      ),
    })

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
            filterExclusion={props.filterExclusion}
            tableRef={tableRef}
            tableSlots={slots}
            filterModalClassName={values.filterModalClassName}
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

    function parentElResizeObserverHandler() {
      let parentElResizeObserver: ResizeObserver | null = null
      let isFixed = false

      function createParentElResizeObserver() {
        const el = unref(tableRef)?.$el.parentElement
        if (el) {
          // resizeObserver = new window.ResizeObserver(function () { return unref(tableRef)?.recalculate(); });
          parentElResizeObserver = new window.ResizeObserver((entries) => {
            for (const entry of entries) {
              if (entry.contentBoxSize) {
                const contentBoxSize = Array.isArray(entry.contentBoxSize)
                  ? entry.contentBoxSize[0]
                  : entry.contentBoxSize

                // console.log(entry, contentBoxSize)
                if (contentBoxSize.inlineSize > 0 && contentBoxSize.blockSize > 0 && !isFixed) {
                  unref(tableRef)
                    ?.recalculate()
                    .then(() => {
                      isFixed = true
                    })
                }
              }
            }
          })
          parentElResizeObserver.observe(el)
        }
      }

      function clearParentElResizeObserver() {
        parentElResizeObserver?.disconnect()
      }

      return {
        createParentElResizeObserver,
        clearParentElResizeObserver,
      }
    }

    const { createParentElResizeObserver, clearParentElResizeObserver } =
      parentElResizeObserverHandler()

    onMountedOrActivated(() => {
      createParentElResizeObserver()
      handleNotPersistentColumnActionWidth()
    })

    function clearCellTooltip() {
      // 鼠标不移出单元格直接单击跳转时要移出正在显示的提示
      onCellMouseleave()
      instances.clear()
    }

    function clearColumnAutoWidth() {
      // columnsForAction.value = []
      cacheActionWidths.value = {}
      maxWidthForAction.value = 0
      clearCalcContentCanvas()
    }

    onUnmountedOrOnDeactivated(() => {
      clearCellTooltip()
      clearColumnAutoWidth()
      clearParentElResizeObserver()
    })

    return () => {
      return (
        <div class={unref(getWrapperClass)} ref={wrapperRef} id={unref(getBindValues).id}>
          {createOperation()}
          <div class={ComponentPrefixCls} style={{ height: unref(getHeight), overflow: 'hidden' }}>
            <Grid
              ref={tableRef}
              {...unref(getBindValues)}
              onPageChange={(...args) => {
                unref(getBindValues).onPageChange?.(...args)
                clearCellTooltip()
                // clearColumnAutoWidth()
              }}
              onSortChange={() => {
                // unref(getBindValues).onSortChange?.(...args)
                clearCellTooltip()
                // clearColumnAutoWidth()
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
