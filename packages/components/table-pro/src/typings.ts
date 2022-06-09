import type { FormSchema } from '@tav-ui/components/form/src/types/form'
import type { VxeGridPropTypes } from 'vxe-table'
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
import type { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip'
import type { CSSProperties } from 'vue'

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
  handleBeforeAction?: (e: Event) => void
  handleAction?: (e: Event) => void
  handleAfterAction?: (e: Event) => void
}

export interface TableProCustomActionConfig {
  enabled?: boolean
  add?: CustomAction | boolean
  delete?: CustomAction | boolean
  import?: CustomAction | boolean
  export?: CustomAction | boolean
  refresh?: CustomAction | boolean
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
  // 业务控制是否显示
  enabled?: boolean | ((action: TableProActionItem) => boolean)
  tooltip?: string | TooltipProps
  permission?: string
}
