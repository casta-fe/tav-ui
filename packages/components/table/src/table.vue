<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      submit-on-reset
      v-bind="getFormProps"
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
    <div class="ta-basic-table-operations flex flex-wrap align-center justify-between">
      <template v-if="useFilter.isVisible">
        <Filter ref="filterElRef" :forms="getFilterProps" :table-action="tableAction" />
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
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}" />
      </template>

      <template v-for="column in columns" #[`header-${column.dataIndex}`] :key="column.dataIndex">
        <HeaderCell :column="column" />
      </template>
    </Table>

    <!-- <div v-show="getBindValues.masking" class="ta-basic-table-mask"></div> -->
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-empty-function */
import { computed, defineComponent, inject, provide, ref, toRaw, unref, watchEffect } from 'vue';
import { isFunction } from '@tav-ui/utils/is';
import { warn } from '@tav-ui/utils/log';
import mitt from '@tav-ui/utils/mitt';
import { Table } from 'ant-design-vue';
import { omit } from 'lodash-es';
import { useForm } from '../../form/src/hooks/useForm';
import BasicForm from '../../form';
import CustomAction from './components/CustomAction.vue';
import expandIcon from './components/ExpandIcon';
import Filter from './components/Filter.vue';
import HeaderCell from './components/HeaderCell.vue';
import { useColumns } from './hooks/useColumns';
import { useCustomRow } from './hooks/useCustomRow';
import { useDataSource } from './hooks/useDataSource';
import { useLoading } from './hooks/useLoading';
import { useMasking } from './hooks/useMasking';
import { usePagination } from './hooks/usePagination';
import { useRowSelection } from './hooks/useRowSelection';
import { createTableContext } from './hooks/useTableContext';
import { useTableExpand } from './hooks/useTableExpand';
import { useTableFooter } from './hooks/useTableFooter';
import { useTableForm } from './hooks/useTableForm';
import { useTableHeader } from './hooks/useTableHeader';
import { useTableScroll } from './hooks/useTableScroll';
import { useTableScrollTo } from './hooks/useTableScrollTo';
import { useTableStyle } from './hooks/useTableStyle';
import { tableProps } from './props';
import type {
  BasicTableProps,
  ColumnChangeParam,
  InnerHandlers,
  SizeType,
  TableActionType,
} from './types/table';
// import emitter from "@tav-ui/hooks/web/useEmiiter";
// import { usePermission } from "@tav-ui/hooks/web/usePermission";

const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
type Recordable<T = any> = Record<string, T>;

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
    const tableEmitter = mitt();
    provide('tableEmitter', tableEmitter);
    const tableElRef = ref(null);
    const tableData = ref<Recordable[]>([]);

    const wrapRef = ref(null);
    const innerPropsRef = ref<Partial<BasicTableProps>>();

    const prefixCls = 'ta-basic-table';
    const [registerForm, formActions] = useForm();

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
    });

    // ::==================== i7eo：添加 ///// start ///// ====================:: //
    const filterElRef = ref(null);
    const useFilter = computed(() => {
      const { filter } = unref(getProps);
      const result = {
        isVisible: false,
        isInputFormVisible: false,
        isPannelFormVisible: false,
      };
      if (!filter) {
        result.isVisible = false;
      } else {
        const { inputForm, pannelForm } = filter;
        if (inputForm && Object.keys(inputForm).length > 0) {
          result.isInputFormVisible = true;
        } else {
          result.isInputFormVisible = false;
        }

        if (pannelForm && pannelForm.length > 0) {
          result.isPannelFormVisible = true;
        } else {
          result.isPannelFormVisible = false;
        }

        if (result.isInputFormVisible || result.isPannelFormVisible) {
          result.isVisible = true;
        } else {
          result.isVisible = false;
        }
      }
      return result;
    });

    const getFilterProps = computed(() => {
      return getProps.value.filter;
    });

    // const { getPermissions } = usePermission();
    // const Permissions = getPermissions();
    const useInnerCustomAction = computed(() => {
      // const { useAdd, useDelete, useImport, useExport, useRefresh, permission } = unref(getProps);
      // // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
      // const isAddVisible = isNullOrUnDef(permission?.add)
      //   ? useAdd?.ifShow
      //   : unref(Permissions)[permission!.add]?.ifShow && useAdd?.ifShow;
      // const isDeleteVisible = isNullOrUnDef(permission?.delete)
      //   ? useDelete?.ifShow
      //   : unref(Permissions)[permission!.delete]?.ifShow && useDelete?.ifShow;
      // const isImportVisible = isNullOrUnDef(permission?.import)
      //   ? useImport?.ifShow
      //   : unref(Permissions)[permission!.import]?.ifShow && useImport?.ifShow;
      // const isExportVisible = isNullOrUnDef(permission?.export)
      //   ? useExport?.ifShow
      //   : unref(Permissions)[permission!.export]?.ifShow && useExport?.ifShow;
      // const isRefreshVisible = isNullOrUnDef(permission?.refresh)
      //   ? useRefresh?.ifShow
      //   : unref(Permissions)[permission!.refresh]?.ifShow && useRefresh?.ifShow;
      // const result = {
      //   isVisible: false,
      //   isAddVisible,
      //   addHandle: useAdd?.handleAction,
      //   isDeleteVisible,
      //   deleteHandle: useDelete?.handleAction,
      //   isImportVisible,
      //   importHandle: useImport?.handleAction,
      //   isExportVisible,
      //   isRefreshVisible
      // };
      // if (
      //   isAddVisible ||
      //   isDeleteVisible ||
      //   isImportVisible ||
      //   isExportVisible ||
      //   isRefreshVisible
      // ) {
      //   result.isVisible = true;
      // }

      // return result;
      return {
        isVisible: true,
        isAddVisible: true,
        addHandle: () => {},
        isDeleteVisible: true,
        deleteHandle: () => {},
        isImportVisible: true,
        importHandle: () => {},
        isExportVisible: true,
        isRefreshVisible: true,
      };
    });
    // ::==================== i7eo：添加 ///// end  ///// ====================:: //

    const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false);
    watchEffect(() => {
      unref(isFixedHeightPage) &&
        props.canResize &&
        warn(
          "'canResize' of BasicTable may not work in PageWrapper with 'fixedHeight' (especially in hot updates)"
        );
    });

    const { getLoading, setLoading } = useLoading(getProps);
    const { getMasking, setMasking } = useMasking(getProps);
    const {
      getPaginationInfo,
      getPagination,
      setPagination,
      setShowPagination,
      getShowPagination,
    } = usePagination(getProps);

    const {
      getRowSelection,
      getRowSelectionRef,
      getSelectRows,
      clearSelectedRowKeys,
      getSelectRowKeys,
      deleteSelectRowByKey,
      setSelectedRowKeys,
    } = useRowSelection(getProps, tableData, emit);

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
    );

    function handleTableChange(...args) {
      onTableChange.call(undefined, ...args);
      emit('change', ...args);
      // 解决通过useTable注册onChange时不起作用的问题
      const { onChange } = unref(getProps);
      onChange && isFunction(onChange) && onChange.call(undefined, ...args);
    }

    const {
      getViewColumns,
      getColumns,
      setCacheColumnsByField,
      setColumns,
      getColumnsRef,
      getCacheColumns,
    } = useColumns(getProps, getPaginationInfo);

    const { getScrollRef, redoHeight } = useTableScroll(
      getProps,
      tableElRef,
      getColumnsRef,
      getRowSelectionRef,
      getDataSourceRef,
      slots
    );

    const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);

    const { customRow } = useCustomRow(getProps, {
      setSelectedRowKeys,
      getSelectRowKeys,
      clearSelectedRowKeys,
      getAutoCreateKey,
      emit,
    });

    const { getRowClassName } = useTableStyle(getProps, prefixCls);

    const { getExpandOption, expandAll, expandRows, collapseAll } = useTableExpand(
      getProps,
      tableData,
      emit
    );

    const handlers: InnerHandlers = {
      onColumnsChange: (data: ColumnChangeParam[]) => {
        emit('columns-change', data);
        // support useTable
        unref(getProps).onColumnsChange?.(data);
      },
    };

    const { getHeaderProps } = useTableHeader(getProps, slots, handlers);

    const { getFooterProps } = useTableFooter(getProps, getScrollRef, tableElRef, getDataSourceRef);

    const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } =
      useTableForm(getProps, slots, fetch, getLoading);

    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef);
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
        columns: toRaw(unref(getViewColumns)),
        pagination: toRaw(unref(getPaginationInfo)),
        dataSource,
        footer: unref(getFooterProps),
        ...unref(getExpandOption),
      };
      if (slots.expandedRowRender) {
        propsData = omit(propsData, 'scroll');
      }

      propsData = omit(propsData, ['class', 'onChange']);
      return propsData;
    });

    const getWrapperClass = computed(() => {
      const values = unref(getBindValues);
      return [
        prefixCls,
        attrs.class,
        {
          [`${prefixCls}-form-container`]: values.useSearchForm,
          [`${prefixCls}--inset`]: values.inset,
          [`${prefixCls}--full-height`]: values.fullHeight,
        },
      ];
    });

    const getEmptyDataIsShowTable = computed(() => {
      const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
      if (emptyDataIsShowTable || !useSearchForm) {
        return true;
      }
      return !!unref(getDataSourceRef).length;
    });

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

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
      getSize: () => {
        return unref(getBindValues).size as SizeType;
      },
    };
    createTableContext({ ...tableAction, wrapRef, getBindValues });

    // ::==================== i7eo：添加 ///// start ///// ====================:: //
    watchEffect(() => {
      // 数据渲染完毕后发送 dom，此时布局已经确定
      // if (tableElRef.value && tableData.value.length) {
      if (tableElRef.value) {
        tableEmitter.emit('table:fetch-refs', {
          table: (tableElRef.value as any).$el,
        });
      }
    });
    // ::==================== i7eo：添加 ///// end  ///// ====================:: //

    expose(tableAction);

    emit('register', tableAction, formActions);

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
    };
  },
});
</script>