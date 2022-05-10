export declare const ROW_KEY = '_id';
export declare const PAGE_SIZE_OPTIONS: string[];
export declare const PAGE_SIZE: number;
export declare const FETCH_SETTING: {
  pageField: string;
  sizeField: string;
  listField: string;
  totalField: string;
};
export declare const DEFAULT_SIZE: string;
export declare const DEFAULT_SORT_FN: (sortInfo: import('./types/table').SorterResult) => {
  sort: string;
  dir: string;
};
export declare const DEFAULT_FILTER_FN: (
  data: Partial<{
    [x: string]: string[];
  }>
) => Partial<{
  [x: string]: string[];
}>;
export declare const DEFAULT_ALIGN = 'left';
export declare const INDEX_COLUMN_FLAG = 'INDEX';
export declare const ACTION_COLUMN_FLAG = 'ACTION';
export declare const MAX_ACTION_NUMBER = 3;
