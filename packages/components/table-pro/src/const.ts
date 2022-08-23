import { buildUUID } from '@tav-ui/utils/uuid'
import componentSetting from '@tav-ui/settings/src/componentSetting'

export const ComponentName = 'TaTablePro'
export const ComponentEmptyName = `${ComponentName}Empty`
export const ComponentOperationsName = `${ComponentName}Operations`
export const ComponentFilterFormName = `${ComponentName}FilterForm`
export const ComponentCustomActionName = `${ComponentName}CustomAction`
export const ComponentActionName = `${ComponentName}Action`
export const ComponentTagsName = `${ComponentName}Tags`
export const ComponentCellName = `${ComponentName}Cell`
export const ComponentEditCellName = `${ComponentName}EditCell`

/**
 * 示例：TaTablePro => ta-table-pro
 * @param name
 * @returns
 */
export function CamelCaseToCls(name: string) {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .slice(1)
}

export function buildTableId() {
  const uuid = buildUUID()
  return `${ComponentName}-${uuid}`
}

const { table } = componentSetting

const {
  pageSizeOptions,
  defaultPageSize,
  fetchSetting,
  defaultSize,
  defaultSortFn,
  defaultFilterFn,
} = table

export const ROW_KEY = '__id'
export const DEFAULT_LINE_HEIGTH = 42

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

// 最多显示3个元素
// 大于三个则显示俩个元素加... 宽度建议 140
// 小于三个全部展示 俩个宽度建议 100，一个宽度建议 60
export const MAX_ACTION_NUMBER = 3

export const DEFAULT_ALIGN = 'left'

export const MIN_WIDTH_SMALL = 45
// export const MIN_WIDTH = 60
export const MIN_WIDTH = 120

/** tooltip 位置 */
export const TOOLTIP_PLACEMENT = 'top'

export const SELECT_COMPONENTS = ['checkbox', 'radio']
export const ACTION_COLUMNS = ['actions', 'action']

export type FetchSetting = typeof componentSetting.table.fetchSetting

export enum ETableProEmits {
  //:==================================================: vxegrid emits :==================================================://
  'Update:data',
  'KeydownStart',
  'Keydown',
  'KeydownEnd',
  'Paste',
  'Copy',
  'Cut',
  'CurrentChange',
  'RadioChange',
  'CheckboxChange',
  'CheckboxAll',
  'CheckboxRangeStart',
  'CheckboxRangeChange',
  'CheckboxRangeEnd',
  'CellClick',
  'CellDblclick',
  'CellMenu',
  'CellMouseenter',
  'CellMouseleave',
  'CellSelected',
  'HeaderCellClick',
  'HeaderCellDblclick',
  'HeaderCellMenu',
  'FooterCellClick',
  'FooterCellDblclick',
  'FooterCellMenu',
  'ClearMerge',
  'SortChange',
  'ClearSort',
  'FilterChange',
  'FilterVisible',
  'ClearFilter',
  'ResizableChange',
  'ToggleRowExpand',
  'ToggleTreeExpand',
  'MenuClick',
  'EditClosed',
  'EditActived',
  'EditDisabled',
  'ValidError',
  'Scroll',
  'Custom',
  'ChangeFnr',
  'OpenFnr',
  'FnrChange',
  'FnrFind',
  'FnrFindAll',
  'FnrReplace',
  'FnrReplaceAll',
  'CellAreaCopy',
  'CellAreaCut',
  'CellAreaPaste',
  'CellAreaMerge',
  'ClearCellAreaMerge',
  'HeaderCellAreaSelection',
  'CellAreaSelectionStart',
  'CellAreaSelectionEnd',
  'CellAreaExtensionStart',
  'CellAreaExtensionEnd',
  'CellAreaArrowsStart',
  'CellAreaArrowsEnd',
  'ActiveCellChangeStart',
  'ActiveCellChangeEnd',
  'PageChange',
  'FormSubmit',
  'FormSubmitInvalid',
  'FormReset',
  'FormCollapse',
  'FormToggleCollapse',
  'ToolbarButtonClick',
  'ToolbarToolClick',
  'Zoom',
  //:==================================================: vxegrid emits :==================================================://

  //:==================================================: extend emits :==================================================://
  'ApiSuccess',
  'ApiError',
  //:==================================================: extend emits :==================================================://
}
