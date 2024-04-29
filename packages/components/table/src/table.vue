<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      v-bind="getFormProps"
      ref="formRef"
      submit-on-reset
      :table-action="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </BasicForm>
    <!-- ::==================== i7eo：添加 ///// start ///// ====================:: -->
    <div
      v-show="showTableAction"
      ref="actionRef"
      class="ta-basic-table-operations flex flex-wrap align-center justify-between"
    >
      <template v-if="useFilter.isVisible">
        <Filter
          ref="filterElRef"
          :forms="getFilterProps"
          :table-action="tableAction"
          :filter-exclusion="filterExclusion"
        />
      </template>
      <template v-else>
        <div class="ta-basic-table-custom-title">
          <slot name="customTitle" v-bind="$slots['customTitle'] || {}" />
        </div>
      </template>
      <CustomAction
        v-if="useInnerCustomAction.isVisible"
        :visible="useInnerCustomAction"
        :handlers="useInnerCustomAction"
        :table-action="tableAction"
      >
        <slot name="customAction" v-bind="$slots['customAction'] || {}" />
      </CustomAction>
      <!-- <div v-if="!tableData.length" class="ta-basic-table-operations-mask"></div> -->
    </div>
    <!-- ::==================== i7eo：添加 ///// end  ///// ====================:: -->

    <Table
      v-show="getEmptyDataIsShowTable"
      ref="tableElRef"
      v-bind="getBindValues"
      :row-class-name="getRowClassName"
      @change="handleTableChange"
    >
      <!-- headerCell插槽无法正常渲染，去掉先 -->
      <template
        v-for="column in columns"
        #[`header-${column.dataIndex}`]
        :key="column.dataIndex?.toString()"
      >
        <HeaderCell :column="column" />
      </template>
      <!-- 增加对antdv3.x兼容 -->
      <template #bodyCell="data">
        <slot name="bodyCell" v-bind="data || {}" />
      </template>
    </Table>

    <!-- <div v-show="getBindValues.masking" class="ta-basic-table-mask"></div> -->
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  computed,
  defineComponent,
  inject,
  onActivated,
  onMounted,
  provide,
  ref,
  toRaw,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { isEqual, omit } from 'lodash-es'
import { Table } from 'ant-design-vue'
import { mitt } from '@tav-ui/utils/mitt'
import { warn } from '@tav-ui/utils/log'
import { isFunction, isNullOrUnDef } from '@tav-ui/utils/is'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { onUnmountedOrOnDeactivated } from '@tav-ui/hooks/core/onUnmountedOrOnDeactivated'
import { useForm } from '@tav-ui/components/form/src/hooks/useForm'
import BasicForm from '@tav-ui/components/form'
import CustomAction from './components/CustomAction.vue'
import expandIcon from './components/ExpandIcon'
import Filter from './components/Filter.vue'
import HeaderCell from './components/HeaderCell.vue'
import { useColumns } from './hooks/useColumns'
import { useCustomRow } from './hooks/useCustomRow'
import { useDataSource } from './hooks/useDataSource'
import { useLoading } from './hooks/useLoading'
import { useMasking } from './hooks/useMasking'
import { usePagination } from './hooks/usePagination'
import { useRowSelection } from './hooks/useRowSelection'
import { createTableContext } from './hooks/useTableContext'
import { useTableExpand } from './hooks/useTableExpand'
import { useTableFooter } from './hooks/useTableFooter'
import { useTableForm } from './hooks/useTableForm'
import { useTableHeader } from './hooks/useTableHeader'
import { useTableScroll } from './hooks/useTableScroll'
import { useTableScrollTo } from './hooks/useTableScrollTo'
import { useTableStyle } from './hooks/useTableStyle'
import { tableProps } from './props'
import type { Ref } from 'vue'
import type {
  BasicTableProps,
  ColumnChangeParam,
  InnerHandlers,
  SizeType,
  TableActionType,
} from './types/table'

const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight'
type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'TaTable',
  components: {
    Table,
    BasicForm,
    HeaderCell,
    Filter,
    CustomAction,
  },
  props: tableProps,
  emits: [
    'fetch-success',
    'fetch-error',
    'selection-change',
    'register',
    'row-click',
    'row-dbClick',
    'row-contextmenu',
    'row-mouseenter',
    'row-mouseleave',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
    'expanded-rows-change',
    'change',
    'columns-change',
  ],
  setup(props, { attrs, emit, slots, expose }) {
    const tableEmitter = mitt()
    provide('tableEmitter', tableEmitter)
    const tableElRef = ref(null)
    const tableData = ref<Recordable[]>([])

    const wrapRef = ref(null)
    const formRef = ref(null)
    const actionRef = ref(null)
    const innerPropsRef = ref<Partial<BasicTableProps>>()
    const cacheActionWidths = ref<Record<string, any>>({})
    const columnsForAction = ref<any[]>([])
    const maxWidthForAction = ref<number>(0)

    const prefixCls = 'ta-basic-table'
    const [registerForm, formActions] = useForm()

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    // ::==================== i7eo：添加 ///// start ///// ====================:: //
    const filterElRef = ref(null)
    const useFilter = computed(() => {
      const { filter } = unref(getProps)
      const result = {
        isVisible: false,
        isInputFormVisible: false,
        isPannelFormVisible: false,
      }
      if (!filter) {
        result.isVisible = false
      } else {
        const { inputForm, pannelForm } = filter
        if (inputForm && Object.keys(inputForm).length > 0) {
          result.isInputFormVisible = true
        } else {
          result.isInputFormVisible = false
        }

        if (pannelForm && pannelForm.length > 0) {
          result.isPannelFormVisible = true
        } else {
          result.isPannelFormVisible = false
        }

        if (result.isInputFormVisible || result.isPannelFormVisible) {
          result.isVisible = true
        } else {
          result.isVisible = false
        }
      }
      return result
    })

    const getFilterProps = computed(() => {
      return getProps.value.filter
    })

    const useInnerCustomAction = computed(() => {
      const { useAdd, useDelete, useImport, useExport, useRefresh, permission } = unref(getProps)
      let isAddVisible = false
      let isDeleteVisible = false
      let isImportVisible = false
      let isExportVisible = false
      let isRefreshVisible = false
      const Permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>

      // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
      isAddVisible = isNullOrUnDef(permission?.add)
        ? useAdd?.ifShow
        : unref(Permissions)[permission!.add]?.ifShow && useAdd?.ifShow
      isDeleteVisible = isNullOrUnDef(permission?.delete)
        ? useDelete?.ifShow
        : unref(Permissions)[permission!.delete]?.ifShow && useDelete?.ifShow
      isImportVisible = isNullOrUnDef(permission?.import)
        ? useImport?.ifShow
        : unref(Permissions)[permission!.import]?.ifShow && useImport?.ifShow
      isExportVisible = isNullOrUnDef(permission?.export)
        ? useExport?.ifShow
        : unref(Permissions)[permission!.export]?.ifShow && useExport?.ifShow
      isRefreshVisible = isNullOrUnDef(permission?.refresh)
        ? useRefresh?.ifShow
        : unref(Permissions)[permission!.refresh]?.ifShow && useRefresh?.ifShow

      const result = {
        isVisible:
          isAddVisible ||
          isDeleteVisible ||
          isImportVisible ||
          isExportVisible ||
          isRefreshVisible ||
          !!slots.customAction,
        isAddVisible,
        addHandle: useAdd?.handleAction,
        isDeleteVisible,
        deleteHandle: useDelete?.handleAction,
        isImportVisible,
        importHandle: useImport?.handleAction,
        isExportVisible,
        exportHandle: useExport?.handleAction,
        isRefreshVisible,
      }
      return result
    })
    // ::==================== i7eo：添加 ///// end  ///// ====================:: //

    const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false)
    watchEffect(() => {
      unref(isFixedHeightPage) &&
        props.canResize &&
        warn(
          "'canResize' of BasicTable may not work in PageWrapper with 'fixedHeight' (especially in hot updates)"
        )
    })

    const { getLoading, setLoading } = useLoading(getProps)
    const { getMasking, setMasking } = useMasking(getProps)
    const {
      getPaginationInfo,
      getPagination,
      setPagination,
      setShowPagination,
      getShowPagination,
    } = usePagination(getProps)

    const {
      getRowSelection,
      getRowSelectionRef,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setSelectedRowKeys,
    } = useRowSelection(getProps, tableData, emit)

    const {
      handleTableChange: onTableChange,
      getDataSourceRef,
      getDataSource,
      getRawDataSource,
      setTableData,
      updateTableDataRecord,
      deleteTableDataRecord,
      insertTableDataRecord,
      findTableDataRecord,
      fetch,
      getRowKey,
      reload,
      getAutoCreateKey,
      updateTableData,
    } = useDataSource(
      tableElRef,
      getProps,
      {
        tableData,
        getPaginationInfo,
        setLoading,
        setPagination,
        getFieldsValue: formActions.getFieldsValue,
        clearSelectedRowKeys,
      },
      emit,
      filterElRef
    )

    function handleTableChange(...args: any[]) {
      // @ts-ignore
      onTableChange.call(undefined, ...args)
      emit('change', ...args)
      // 解决通过useTable注册onChange时不起作用的问题
      const { onChange } = unref(getProps)
      // @ts-ignore
      onChange && isFunction(onChange) && onChange.call(undefined, ...args)
    }

    const {
      getViewColumns,
      getColumns,
      setCacheColumnsByField,
      setColumns,
      getColumnsRef,
      getCacheColumns,
    } = useColumns(getProps, getPaginationInfo)

    const { getScrollRef, redoHeight, fnInit, keepScrollIns } = useTableScroll(
      getProps,
      tableElRef,
      getColumnsRef,
      getRowSelectionRef,
      getDataSourceRef,
      slots as any,
      wrapRef,
      formRef,
      actionRef
    )

    // propsRef: ComputedRef<BasicTableProps>,
    // tableElRef: Ref<ComponentRef>,
    // columnsRef: ComputedRef<BasicColumn[]>,
    // rowSelectionRef: ComputedRef<TableRowSelection | null>,
    // getDataSourceRef: ComputedRef<Recordable[]>,
    // wrapRef: Ref<HTMLElement | null>,
    // formRef: Ref<HTMLElement | null>,
    // actionRef: Ref<HTMLElement | null>

    const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef)

    const { customRow } = useCustomRow(getProps, {
      setSelectedRowKeys,
      getSelectRowKeys,
      clearSelectedRowKeys,
      getAutoCreateKey,
      emit,
    })

    const { getRowClassName } = useTableStyle(getProps, prefixCls)

    const { getExpandOption, expandAll, expandRows, collapseAll } = useTableExpand(
      getProps,
      tableData,
      emit
    )

    const handlers: InnerHandlers = {
      onColumnsChange: (data: ColumnChangeParam[]) => {
        emit('columns-change', data)
        // support useTable
        unref(getProps).onColumnsChange?.(data)
      },
    }

    const { getHeaderProps } = useTableHeader(getProps, slots, handlers)

    const { getFooterProps } = useTableFooter(getProps, getScrollRef, tableElRef, getDataSourceRef)

    const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } =
      useTableForm(getProps, slots, fetch, getLoading)

    const _getColumns = computed(() => {
      let columns = unref(getViewColumns)
      if (unref(columnsForAction) && unref(columnsForAction).length > 0) {
        columns = unref(columnsForAction)
      }
      return columns
    })

    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef)
      let propsData: Recordable = {
        // ...(dataSource.length === 0 ? { getPopupContainer: () => document.body } : {}),
        ...attrs,
        customRow,
        expandIcon: slots.expandIcon ? null : expandIcon(),
        ...unref(getProps),
        ...unref(getHeaderProps),
        scroll: unref(getScrollRef),
        loading: unref(getLoading),
        masking: unref(getMasking),
        tableLayout: 'fixed',
        rowSelection: unref(getRowSelectionRef),
        rowKey: unref(getRowKey),
        // columns: toRaw(unref(getViewColumns)),
        columns: unref(_getColumns),
        pagination: toRaw(unref(getPaginationInfo)),
        dataSource,
        footer: unref(getFooterProps),
        ...unref(getExpandOption),
      }
      if (slots.expandedRowRender) {
        propsData = omit(propsData, 'scroll')
      }

      propsData = omit(propsData, ['class', 'onChange'])
      return propsData
    })

    const getWrapperClass = computed(() => {
      const values = unref(getBindValues)
      return [
        prefixCls,
        attrs.class,
        {
          [`${prefixCls}-form-container`]: values.useSearchForm,
          [`${prefixCls}--inset`]: values.inset,
          [`${prefixCls}--full-height`]: values.fullHeight,
        },
      ]
    })

    const getEmptyDataIsShowTable = computed(() => {
      const { emptyDataIsShowTable, useSearchForm } = unref(getProps)
      if (emptyDataIsShowTable || !useSearchForm) {
        return true
      }
      return !!unref(getDataSourceRef).length
    })

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props }
    }
    const getFilterForm = () => {
      //@ts-ignore
      return filterElRef.value.pannelFormRef
    }
    // 统计 action 渲染数据，动态设置宽度
    const setCacheActionWidths = ({ key = '', value = 0 }) => {
      if (key) {
        cacheActionWidths.value[key] = value
      }
    }
    watch(
      () => [unref(getViewColumns), cacheActionWidths],
      ([newCol], [preCol]) => {
        const _tableData = unref(tableData)
        const maxWidth = Math.max(...Object.values(unref(cacheActionWidths)))
        if (!isEqual(newCol, preCol) || (_tableData && maxWidth > unref(maxWidthForAction))) {
          const columns = unref(getViewColumns).map((column) => {
            if (
              typeof column.dataIndex === 'string' &&
              ['action', 'actions'].includes(column.dataIndex)
            ) {
              column.width = Math.ceil(maxWidth)
              column.minWidth = Math.ceil(maxWidth)
              return column
            }
            return column
          })
          columnsForAction.value = columns
          maxWidthForAction.value = maxWidth
        }
      },
      {
        deep: true,
      }
    )
    onMounted(() => {
      fnInit()
    })
    onActivated(() => {
      if (keepScrollIns.value) {
        keepScrollIns.value.scrollFn()
      }
    })
    onUnmountedOrOnDeactivated(() => {
      cacheActionWidths.value = {}
      columnsForAction.value = []
      maxWidthForAction.value = 0
    })
    const tableAction: TableActionType = {
      reload,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setPagination,
      setTableData,
      updateTableDataRecord,
      deleteTableDataRecord,
      insertTableDataRecord,
      findTableDataRecord,
      redoHeight,
      setSelectedRowKeys,
      setColumns,
      setLoading,
      setMasking,
      getDataSource,
      getRawDataSource,
      setProps,
      getRowSelection,
      getPaginationRef: getPagination,
      getColumns,
      getCacheColumns,
      emit,
      updateTableData,
      setShowPagination,
      getShowPagination,
      setCacheColumnsByField,
      expandAll,
      expandRows,
      scrollTo,
      collapseAll,
      getFilterForm,
      getSize: () => {
        return unref(getBindValues).size as SizeType
      },
    }
    createTableContext({ ...tableAction, wrapRef, getBindValues, setCacheActionWidths })

    // ::==================== i7eo：添加 ///// start ///// ====================:: //
    watchEffect(() => {
      // 数据渲染完毕后发送 dom，此时布局已经确定
      // if (tableElRef.value && tableData.value.length) {
      if (tableElRef.value) {
        tableEmitter.emit('table:fetch-refs', {
          table: (tableElRef.value as any).$el,
        })
      }
    })
    // ::==================== i7eo：添加 ///// end  ///// ====================:: //

    expose(tableAction)

    emit('register', tableAction, formActions)

    return {
      tableData,
      filterElRef,
      useFilter,
      getFilterProps,
      useInnerCustomAction,
      tableElRef,
      getBindValues,
      getLoading,
      registerForm,
      handleSearchInfoChange,
      getEmptyDataIsShowTable,
      handleTableChange,
      getRowClassName,
      wrapRef,
      tableAction,
      redoHeight,
      getFormProps: getFormProps as any,
      replaceFormSlotKey,
      getFormSlotKeys,
      getWrapperClass,
      columns: getViewColumns,
      formRef,
      actionRef,
    }
  },
})
</script>
