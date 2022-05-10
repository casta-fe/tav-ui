/* eslint-disable @typescript-eslint/ban-types */
import type { RoleEnum } from '@tav-ui/enums/roleEnum';
import type { VueNode } from '@tav-ui/utils/propTypes';
import type {
  ColumnProps,
  TableRowSelection as ITableRowSelection,
} from 'ant-design-vue/lib/table/interface';
import type { VNodeChild } from 'vue';
import type { FormProps, FormSchema } from '../../../form/src/types/form';
import type { PermissionButton, useAction } from '../props';
import type { ComponentType } from './componentType';
import type { PaginationProps } from './pagination';
declare type Recordable<T = any> = Record<string, T>;
declare type EmitType = (event: string, ...args: any[]) => void;
export declare type SortOrder = 'ascend' | 'descend';
export interface TableCurrentDataSource<T = Recordable> {
  currentDataSource: T[];
}
export interface FilterForms {
  inputForm?: Omit<FormSchema, 'label' | 'component'> | FormSchema;
  pannelForm?: FormSchema[];
}
export interface TableRowSelection<T = any> extends ITableRowSelection {
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => any;
  onSelect?: (record: T, selected: boolean, selectedRows: Object[], nativeEvent: Event) => any;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any;
  onSelectInvert?: (selectedRows: string[] | number[]) => any;
}
export interface TableCustomRecord<T = Recordable> {
  record?: T;
  index?: number;
}
export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  indent?: number;
  expanded?: boolean;
}
export interface ColumnFilterItem {
  text?: string;
  value?: string;
  children?: any;
}
export interface SorterResult {
  column: ColumnProps;
  order: SortOrder;
  field: string;
  columnKey: string;
}
export interface FetchParams {
  searchInfo?: Recordable;
  page?: number;
  sortInfo?: Recordable;
  filterInfo?: Recordable;
  clearSelect?: boolean;
}
export interface GetColumnsParams {
  ignoreIndex?: boolean;
  ignoreAction?: boolean;
  sort?: boolean;
}
export declare type SizeType = 'default' | 'middle' | 'small' | 'large';
export interface TableActionType {
  reload: (opt?: FetchParams) => Promise<Recordable<any>[] | undefined>;
  getSelectRows: <T = Recordable>() => T[];
  clearSelectedRowKeys: () => void;
  expandAll: () => void;
  expandRows: (keys: string[], cover?: boolean) => void;
  scrollTo: (pos: string) => void;
  collapseAll: () => void;
  getSelectRowKeys: () => string[];
  deleteSelectRowByKey: (key: string) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setTableData: <T = Recordable>(values: T[]) => void;
  updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void;
  deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void;
  insertTableDataRecord: (record: Recordable, index?: number) => Recordable | void;
  findTableDataRecord: (rowKey: string | number) => Recordable | void;
  getColumns: (opt?: GetColumnsParams) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
  getDataSource: <T = Recordable>() => T[];
  getRawDataSource: <T = Recordable>() => T;
  setLoading: (loading: boolean) => void;
  setMasking: (loading: boolean) => void;
  setProps: (props: Partial<BasicTableProps>) => void;
  redoHeight: () => void;
  setSelectedRowKeys: (rowKeys: string[] | number[]) => void;
  getPaginationRef: () => PaginationProps | boolean;
  getSize: () => SizeType;
  getRowSelection: () => TableRowSelection<Recordable>;
  getCacheColumns: () => BasicColumn[];
  emit?: EmitType;
  updateTableData: (index: number, key: string, value: any) => Recordable;
  setShowPagination: (show: boolean) => Promise<void>;
  getShowPagination: () => boolean;
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void;
}
export interface FetchSetting {
  pageField: string;
  sizeField: string;
  listField: string;
  totalField: string;
}
export interface TableSetting {
  redo?: boolean;
  size?: boolean;
  setting?: boolean;
  fullScreen?: boolean;
}
export interface BasicTableProps<T = any> {
  clickToRowSelect?: boolean;
  isTreeTable?: boolean;
  sortFn?: (sortInfo: SorterResult) => any;
  filterFn?: (data: Partial<Recordable<string[]>>) => any;
  inset?: boolean;
  showTableSetting?: boolean;
  tableSetting?: TableSetting;
  striped?: boolean;
  autoCreateKey?: boolean;
  summaryFunc?: (...arg: any) => Recordable[];
  summaryData?: Recordable[];
  showSummary?: boolean;
  canColDrag?: boolean;
  api?: (...arg: any) => Promise<any>;
  beforeFetch?: (...arg: any[]) => any;
  afterFetch?: (...arg: any[]) => any;
  handleSearchInfoFn?: (...arg: any[]) => any;
  fetchSetting?: Partial<FetchSetting>;
  immediate?: boolean;
  emptyDataIsShowTable?: boolean;
  searchInfo?: Recordable;
  defSort?: Recordable;
  useSearchForm?: boolean;
  formConfig?: Partial<FormProps>;
  filter?: FilterForms;
  useAdd?: useAction;
  useDelete?: useAction;
  useImport?: useAction;
  useExport?: useAction;
  useRefresh?: useAction;
  columns: BasicColumn[];
  showIndexColumn?: boolean;
  indexColumnProps?: BasicColumn;
  actionColumn?: BasicColumn;
  ellipsis?: boolean;
  canResize?: boolean;
  resizeHeightOffset?: number;
  clearSelectOnPageChange?: boolean;
  rowKey?: string | ((record: Recordable) => string);
  dataSource?: Recordable[];
  titleHelpMessage?: string | string[];
  maxHeight?: number;
  fullHeight?: boolean;
  bordered?: boolean;
  pagination?: PaginationProps | boolean;
  paginationControl?: string;
  loading?: boolean;
  masking?: boolean;
  childrenColumnName?: string;
  components?: object;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[];
  expandedRowKeys?: string[];
  expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element;
  expandIcon?: Function | VNodeChild | JSX.Element;
  expandRowByClick?: boolean;
  expandIconColumnIndex?: number;
  footer?: Function | VNodeChild | JSX.Element;
  indentSize?: number;
  locale?: object;
  rowClassName?: (record: TableCustomRecord<T>, index: number) => string;
  rowSelection?: TableRowSelection;
  scroll?: {
    x?: number | true;
    y?: number;
  };
  showHeader?: boolean;
  size?: SizeType;
  title?: VNodeChild | JSX.Element | string | ((data: Recordable) => string);
  customHeaderRow?: (column: ColumnProps, index: number) => object;
  customRow?: (record: T, index: number) => object;
  tableLayout?: 'auto' | 'fixed' | string;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  transformCellText?: Function;
  beforeEditSubmit?: (data: {
    record: Recordable;
    index: number;
    key: string | number;
    value: any;
  }) => Promise<any>;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
  onExpand?: (expande: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;
  0: any;
  onColumnsChange?: (data: ColumnChangeParam[]) => void;
  permission?: Partial<PermissionButton>;
}
export declare type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>;
export interface BasicColumn extends ColumnProps {
  children?: BasicColumn[];
  filters?: {
    text: string;
    value: string;
    children?:
      | unknown[]
      | (((props: Record<string, unknown>) => unknown[]) & (() => unknown[]) & (() => unknown[]));
  }[];
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';
  customTitle?: VueNode;
  slots?: Recordable;
  defaultHidden?: boolean;
  helpMessage?: string | string[];
  format?: CellFormat;
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  auth?: RoleEnum | RoleEnum[] | string | string[];
  ifShow?: boolean | ((column: BasicColumn) => boolean);
}
export interface ColumnChangeParam {
  dataIndex: string;
  fixed: boolean | 'left' | 'right' | undefined;
  visible: boolean;
}
export interface InnerHandlers {
  onColumnsChange: (data: ColumnChangeParam[]) => void;
}
export {};
