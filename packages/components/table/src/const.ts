import componentSetting from '@tav-ui/settings/src/componentSetting'
import { buildUUID } from '@tav-ui/utils/uuid'

const { table } = componentSetting

const {
  pageSizeOptions,
  defaultPageSize,
  fetchSetting,
  defaultSize,
  defaultSortFn,
  defaultFilterFn,
} = table

export const ROW_KEY = '_id' // 原值为id但是目前数据有的时候无唯一id所以这里重新命名，让table自动生成uuid

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = pageSizeOptions

// Number of items displayed per page
export const PAGE_SIZE = defaultPageSize

// Common interface field settings
export const FETCH_SETTING = fetchSetting

// Default Size
export const DEFAULT_SIZE = defaultSize

// Configure general sort function
export const DEFAULT_SORT_FN = defaultSortFn

export const DEFAULT_FILTER_FN = defaultFilterFn

//  Default layout of table cells
export const DEFAULT_ALIGN = 'left'

export const INDEX_COLUMN_FLAG = 'INDEX'

export const ACTION_COLUMN_FLAG = 'ACTION'

// 最多显示3个元素
// 大于三个则显示俩个元素加... 宽度建议 140
// 小于三个全部展示 俩个宽度建议 100，一个宽度建议 60
export const MAX_ACTION_NUMBER = 3

export function buildTableActionId() {
  const uuid = buildUUID()
  return `TaTableAction-${uuid}`
}
