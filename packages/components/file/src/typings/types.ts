import { type FileTypeSelectProps } from '../components/FileTypeSelect'
import { type FileTableProps } from '../components/FileTable'
import { type FileActionsProps } from '../components/FileActions'
import { type FileInjectedProps } from './injected-props'

export interface ApiParams {
  params?: {
    appId?: number
    id?: string
    searchValue?: string
    startTime?: Date
    endTime?: Date
    typeCodes?: string[] // 不能都不传，至少传一个或都传
    moduleCodes?: string[]
    businessKeys?: string[]
    permissionControl?: boolean // default false
  }
}

// 注意该文件与 vue 文件中的 props 类型需要同步更新
export interface FileProps extends ApiParams, FileInjectedProps {
  /** 顶部显隐控制 */
  headerVisible?: boolean
  /** 顶部操作区显隐控制 */
  headerActionsVisible?: boolean
  title?: string
  titleVisible?: boolean

  fileTypeSelect?: FileTypeSelectProps
  fileActions?: FileActionsProps
  fileTable?: FileTableProps

  // this._props.params.id,
  // this._props.params.endTime,
  // this._props.params.typeCode,
  // this._props.params.startTime,
  // this._props.params.moduleCode,
  // this._props.params.businessKey,
  // this._props.params.searchValue,

  // 各个组件支持的 api 以及 before/after 需要在大组件体现
}

export interface FileEmits {
  click: (evt: MouseEvent) => boolean
}
