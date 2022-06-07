import type { VxeGridDefines, VxeTableDefines } from 'vxe-table'

// VxeGridEvents
export type TableProKeydown = (params: VxeGridDefines.KeydownEventParams) => void
export type TableProPaste = (params: VxeGridDefines.PasteEventParams) => void
export type TableProCopy = (params: VxeGridDefines.CopyEventParams) => void
export type TableProCut = (params: VxeGridDefines.CutEventParams) => void
export type TableProCurrentChange = (params: VxeGridDefines.CurrentChangeEventParams) => void
export type TableProRadioChange = (params: VxeGridDefines.RadioChangeEventParams) => void
export type TableProCheckboxChange = (params: VxeGridDefines.CheckboxChangeEventParams) => void
export type TableProCheckboxAll = (params: VxeGridDefines.CheckboxAllEventParams) => void
export type TableProCheckboxRangeStart = (
  params: VxeGridDefines.CheckboxRangeStartEventParams
) => void
export type TableProCheckboxRangeChange = (
  params: VxeGridDefines.CheckboxRangeChangeEventParams
) => void
export type TableProCheckboxRangeEnd = (params: VxeGridDefines.CheckboxRangeEndEventParams) => void
export type TableProCellClick = (params: VxeGridDefines.CellClickEventParams) => void
export type TableProCellDblclick = (params: VxeGridDefines.CellDblclickEventParams) => void
export type TableProCellMenu = (params: VxeGridDefines.CellMenuEventParams) => void
export type TableProCellMouseenter = (params: VxeGridDefines.CellMouseenterEventParams) => void
export type TableProCellMouseleave = (params: VxeGridDefines.CellMouseleaveEventParams) => void
export type TableProHeaderCellClick = (params: VxeGridDefines.HeaderCellClickEventParams) => void
export type TableProHeaderCellDblclick = (
  params: VxeGridDefines.HeaderCellDblclickEventParams
) => void
export type TableProHeaderCellMenu = (params: VxeGridDefines.HeaderCellMenuEventParams) => void
export type TableProFooterCellClick = (params: VxeGridDefines.FooterCellClickEventParams) => void
export type TableProFooterCellDblclick = (
  params: VxeGridDefines.FooterCellDblclickEventParams
) => void
export type TableProFooterCellMenu = (params: VxeGridDefines.FooterCellMenuEventParams) => void
export type TableProSortChange = (params: VxeGridDefines.SortChangeEventParams) => void
export type TableProFilterChange = (params: VxeGridDefines.FilterChangeEventParams) => void
export type TableProFilterVisible = (params: VxeGridDefines.FilterVisibleEventParams) => void
export type TableProResizableChange = (params: VxeGridDefines.ResizableChangeEventParams) => void
export type TableProToggleRowExpand = (params: VxeGridDefines.ToggleRowExpandEventParams) => void
export type TableProToggleTreeExpand = (params: VxeGridDefines.ToggleTreeExpandEventParams) => void
export type TableProMenuClick = (params: VxeGridDefines.MenuClickEventParams) => void
export type TableProEditClosed = (params: VxeGridDefines.EditClosedEventParams) => void
export type TableProEditActived = (params: VxeGridDefines.EditActivedEventParams) => void
export type TableProEditDisabled = (params: VxeGridDefines.EditDisabledEventParams) => void
export type TableProValidError = (params: VxeGridDefines.ValidErrorEventParams) => void
export type TableProScroll = (params: VxeGridDefines.ScrollEventParams) => void
export type TableProCustom = (params: VxeGridDefines.CustomEventParams) => void

export type TableProPageChange = (params: VxeGridDefines.PageChangeEventParams) => void
export type TableProFormSubmit = (params: VxeGridDefines.FormSubmitEventParams) => void
export type TableProFormSubmitInvalid = (
  params: VxeGridDefines.FormSubmitInvalidEventParams
) => void
export type TableProFormReset = (params: VxeGridDefines.FormResetEventParams) => void
export type TableProFormCollapse = (params: VxeGridDefines.FormCollapseEventParams) => void
export type TableProToolbarButtonClick = (
  params: VxeGridDefines.ToolbarButtonClickEventParams
) => void
export type TableProToolbarToolClick = (params: VxeGridDefines.ToolbarToolClickEventParams) => void
export type TableProZoom = (params: VxeGridDefines.ZoomEventParams) => void

// VxeTableEvents
export type TableProKeydownStart = (params: VxeTableDefines.KeydownStartEventParams) => void
// export type Keydown = (params: VxeTableDefines.KeydownEventParams) => void
export type TableProKeydownEnd = (params: VxeTableDefines.KeydownEndEventParams) => void
// export type Paste = (params: VxeTableDefines.PasteEventParams) => void
// export type Copy = (params: VxeTableDefines.CopyEventParams) => void
// export type Cut = (params: VxeTableDefines.CutEventParams) => void
// export type CurrentChange = (params: VxeTableDefines.CurrentChangeEventParams) => void
// export type RadioChange = (params: VxeTableDefines.RadioChangeEventParams) => void
// export type CheckboxChange = (params: VxeTableDefines.CheckboxChangeEventParams) => void
// export type CheckboxAll = (params: VxeTableDefines.CheckboxAllEventParams) => void
// export type CheckboxRangeStart = (params: VxeTableDefines.CheckboxRangeStartEventParams) => void
// export type CheckboxRangeChange = (params: VxeTableDefines.CheckboxRangeChangeEventParams) => void
// export type CheckboxRangeEnd = (params: VxeTableDefines.CheckboxRangeEndEventParams) => void
// export type CellClick = (params: VxeTableDefines.CellClickEventParams) => void
// export type CellDblclick = (params: VxeTableDefines.CellDblclickEventParams) => void
// export type CellMenu = (params: VxeTableDefines.CellMenuEventParams) => void
// export type CellMouseenter = (params: VxeTableDefines.CellMouseenterEventParams) => void
// export type CellMouseleave = (params: VxeTableDefines.CellMouseleaveEventParams) => void
// export type HeaderCellClick = (params: VxeTableDefines.HeaderCellClickEventParams) => void
// export type HeaderCellDblclick = (params: VxeTableDefines.HeaderCellDblclickEventParams) => void
// export type HeaderCellMenu = (params: VxeTableDefines.HeaderCellMenuEventParams) => void
// export type FooterCellClick = (params: VxeTableDefines.FooterCellClickEventParams) => void
// export type FooterCellDblclick = (params: VxeTableDefines.FooterCellDblclickEventParams) => void
// export type FooterCellMenu = (params: VxeTableDefines.FooterCellMenuEventParams) => void
// export type SortChange = (params: VxeTableDefines.SortChangeEventParams) => void
// export type FilterChange = (params: VxeTableDefines.FilterChangeEventParams) => void
// export type FilterVisible = (params: VxeTableDefines.FilterVisibleEventParams) => void
// export type ResizableChange = (params: VxeTableDefines.ResizableChangeEventParams) => void
// export type ToggleRowExpand = (params: VxeTableDefines.ToggleRowExpandEventParams) => void
// export type ToggleTreeExpand = (params: VxeTableDefines.ToggleTreeExpandEventParams) => void
// export type MenuClick = (params: VxeTableDefines.MenuClickEventParams) => void
// export type EditClosed = (params: VxeTableDefines.EditClosedEventParams) => void
// export type EditActived = (params: VxeTableDefines.EditActivedEventParams) => void
// export type EditDisabled = (params: VxeTableDefines.EditDisabledEventParams) => void
// export type ValidError = (params: VxeTableDefines.ValidErrorEventParams) => void
// export type Scroll = (params: VxeTableDefines.ScrollEventParams) => void
// export type Custom = (params: VxeTableDefines.CustomEventParams) => void
