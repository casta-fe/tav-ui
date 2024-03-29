import type { FormSchema } from '@tav-ui/components/form/src/types/form'
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
import type { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip'
import type { CSSProperties, ComputedRef, Ref } from 'vue'
import type { VxeGridPropTypes } from 'vxe-table'
import type { TableProColumn } from './types'

export interface PagerConfig extends VxeGridPropTypes.PagerConfig {
  controller?: 'backend' | 'frontend'
}

export interface TableProFilterForm {
  inputForm?: Omit<FormSchema, 'label' | 'component'> | FormSchema
  pannelForm?: FormSchema[]
}

export interface TableProFilterFormConfig extends TableProFilterForm {
  enabled?: boolean
}

interface CustomAction {
  permission?: string
  permissionCode?: number
  handleBeforeAction?: (e: Event) => void
  handleAction?: (e: Event) => void
  handleAfterAction?: (e: Event) => void
}

export interface TableProCustomActionConfig {
  enabled?: boolean
  add?: CustomAction | boolean
  delete?: CustomAction | boolean
  import?: CustomAction | boolean
  export?:
    | (CustomAction & {
        fileName?: string
        /** 这里是对数据中全量字段进行配置，数据的导出与数据的展示列配置是分开管理的，只能是扁平数组 */
        columns: {
          field: string
          title?: string
          minWidth?: number
          visible?: boolean
          cellContent?: (...args: any[]) => any
          // columnFormat?: (...args: any[]) => any
          cellFormat?: (...args: any[]) => any
        }[]
        /** color 相关的格式必须为 argb，即 #212121 => 212121 */
        styles?: {
          headerHeight?: number
          headerBackgroundColor?: string
          headerFontSize?: number
          cellHeight?: number
          cellFontColor?: string
          cellFontSize?: number
          cellBorderStyle?: string
          cellBorderColor?: string
          footerHeight?: number
          footerBackgroundColor?: string
          footerFontSize?: number
          descriptionHeight?: number
          descriptionBackgroundColor?: string
          descriptionFontSize?: number
          descriptionAlign?: string
        }
        handleDescription?: (...args: any[]) => any
        /** 导出全部异步数据接口 */
        handleAllApi?: TableProApi<Promise<any>>
        handleBackendApi?: TableProApi<Promise<any>>
      })
    | boolean
  refresh?: CustomAction | boolean
  column?: CustomAction | boolean
  statistical?: CustomAction | boolean
}

export type VxeQueryParams = VxeGridPropTypes.ProxyAjaxQueryParams
export type TableProApiParams = {
  filter?: Record<string, any>
  model?: Record<string, any>
  clearSelect?: boolean
  page?: number
}

export interface TableProApi<T> {
  (option: TableProApiParams): T
}

export interface TableProInnerInfo {
  userInfo?: Record<string, any>
  columnsInfoGet?: (...arg: any[]) => Promise<any>
  columnsInfoSet?: (...arg: any[]) => Promise<any>
}

export interface TableProTagsConfig {
  /** label 对应的字段 */
  label?: string
  /** value 对应的字段 */
  value?: string
  /** tag 颜色 */
  color?: string
  // /** tag 是否圆角 */
  round?: boolean | string
  /** tag 自定义样式 */
  style?: CSSProperties
}

export interface TableProPopConfirm {
  title: string
  okText?: string
  cancelText?: string
  confirm: (...arg: any[]) => any
  cancel?: (...arg: any[]) => any
  icon?: string
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight'
}

export interface TableProActionItem extends ButtonProps {
  onClick?: (...arg: any[]) => any
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: string
  popConfirm?: TableProPopConfirm
  disabled?: boolean
  divider?: boolean
  limit?: number
  // 业务控制是否显示
  enabled?: boolean | ((action: TableProActionItem) => boolean)
  tooltip?: string | TooltipProps
  permission?: string
  permissionCode?: number //业务的权限，暂时用于inovation
}

export interface TreeDataItem {
  value: string
  key: string
  title?: string
  disabled?: boolean
  children?: TreeDataItem[]
}

/** 把tree需要的数据融合进column */
export type CustomActionSettingColumnOption = TableProColumn & {
  key?: string
  // title: string // title 复用 column 中的配置即可
  disabled?: boolean
}
export interface CustomActionSettingColumn {
  coverColumnsSetting: (columns: CustomActionSettingColumnOption[], checkedList: string[]) => void
  handleColumnClick: () => void
}

export interface CustomActionSetting {
  refreshRef: null
  columnRef: Ref<CustomActionSettingColumn>
  showColumnsModa: () => void
}

export interface CustomActionRef {
  addRef: null
  deleteRef: null
  importRef: null
  exportRef: null
  showExportModal: () => void
  showColumnsModa: () => void
  settingsRef: Ref<CustomActionSetting>
  actionRef: Ref<ComputedRef>
}
