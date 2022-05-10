import Pagination from 'ant-design-vue/lib/pagination';
import type { VNodeChild } from 'vue';
interface PaginationRenderProps {
  page: number;
  type: 'page' | 'prev' | 'next';
  originalElement: any;
}
export declare class PaginationConfig extends Pagination {
  position?: 'top' | 'bottom' | 'both';
}
export interface PaginationProps {
  total?: number;
  defaultCurrent?: number;
  current?: number;
  defaultPageSize?: number;
  pageSize?: number;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean | object;
  showTotal?: (total: number, range: [number, number]) => any;
  size?: string;
  simple?: boolean;
  itemRender?: (props: PaginationRenderProps) => VNodeChild | JSX.Element;
}
export {};
