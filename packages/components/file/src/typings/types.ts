import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type FileTypeSelectProps } from '../components/FileTypeSelect'
import { type FileActionUploadProps } from '../components/FileActionUpload'
import {
  type FileTableEmits,
  type FileTableInstance,
  type FileTableProps,
} from '../components/FileTable'
// import { type FileVersionProps } from '../components/FileVersion'
// import { type FileViewProps } from '../components/FileView'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_MODE } from '../consts'
import { type FileActionUploadLinkProps } from '../components/FileActionUploadLink'
import { type ArgumentsOf } from '../utils'
import { type GlobalConfigFileProps } from './global-config'
import { type FileApiParamBusinessParamsJson } from './api'

/** 单纯定义参数类型，方便统一管理、使用 */
export interface ApiParams {
  /** 控制查询哪个系统 */
  appId?: string
  /** 模块code */
  moduleCode?: string
  /** 类型 code */
  typeCode?: string
  /** 类型 code */
  typeCodes?: string[]
  /** 业务 businessKey */
  businessKey?: string
  /** 业务 businessId */
  businessId?: string
  /** 业务 businessId */
  businessIds?: string[]
  /** 业务 businessKey & 业务 businessId 互斥检查 */
  businessCheck?: boolean
  /** 业务自定义数据 */
  businessParamsJson?: string
  /** 是否控权限 */
  permissionControl?: boolean
  /** 文件真实 id */
  fileActualId?: string
  /** 文件真实 id 数组 */
  fileActualIds?: string[]
  /** 是否及时更新 */
  instantUpdate?: boolean

  /** 文件id Format: int64 */
  id?: number
  /** 文件ids */
  ids?: number[]
  /** 聚合查询框, 非必填 */
  searchValue?: string
  /**开始时间 Format: date-time */
  startTime?: string
  /** 结束时间  Format: date-time */
  endTime?: string
  /** 文件列表  */
  files?: File[]
}

/** fileTypeSelect 组件下所有 api 需要的参数 */
export const fileTypeSelectApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  moduleCode: { type: Object as PropType<ApiParams['moduleCode']> },
  typeCodes: { type: Object as PropType<ApiParams['typeCodes']> },
  permissionControl: { type: Object as PropType<ApiParams['permissionControl']> },
  // businessParamsJson: { type: Object as PropType<FileApiParamBusinessParamsJson> },
}
export type FileTypeSelectApiParams = ExtractPropTypes<typeof fileTypeSelectApiParams>

/** fileActionUpload 组件下所有 api 需要的参数 */
export const fileActionUploadApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  moduleCode: { type: Object as PropType<ApiParams['moduleCode']> },
  typeCode: { type: Object as PropType<ApiParams['typeCode']> },
  // permissionControl: { type: Object as PropType<ApiParams['permissionControl']> }, // 文件上传不控权
  businessId: { type: Object as PropType<ApiParams['businessId']> },
  businessKey: { type: Object as PropType<ApiParams['businessKey']> },
  businessParamsJson: { type: Object as PropType<FileApiParamBusinessParamsJson> },
  files: { type: Object as PropType<ApiParams['files']>, required: true },
  fileActualId: { type: Object as PropType<ApiParams['fileActualId']> },
  instantUpdate: { type: Object as PropType<ApiParams['instantUpdate']> },
}
export type FileActionUploadApiParams = ExtractPropTypes<typeof fileActionUploadApiParams>

/** fileActionUploadLink 组件下所有 api 需要的参数 */
export const fileActionUploadLinkApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  moduleCode: { type: Object as PropType<ApiParams['moduleCode']> },
  typeCode: { type: Object as PropType<ApiParams['typeCode']> },
  // permissionControl: { type: Object as PropType<ApiParams['permissionControl']> }, // 文件上传不控权
  businessId: { type: Object as PropType<ApiParams['businessId']> },
  businessKey: { type: Object as PropType<ApiParams['businessKey']> },
  businessParamsJson: { type: Object as PropType<FileApiParamBusinessParamsJson> },
  files: { type: Object as PropType<ApiParams['files']>, required: true },
  fileActualId: { type: Object as PropType<ApiParams['fileActualId']> },
  instantUpdate: { type: Object as PropType<ApiParams['instantUpdate']> },
}
export type FileActionUploadLinkApiParams = ExtractPropTypes<typeof fileActionUploadLinkApiParams>

/** fileTable 组件下所有 api 需要的参数 */
export const fileTableApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  moduleCode: { type: Object as PropType<ApiParams['moduleCode']> },
  typeCode: { type: Object as PropType<ApiParams['typeCode']> },
  typeCodes: { type: Object as PropType<ApiParams['typeCodes']> },
  permissionControl: { type: Object as PropType<ApiParams['permissionControl']> },
  businessId: { type: Object as PropType<ApiParams['businessId']> },
  businessIds: { type: Object as PropType<ApiParams['businessIds']> },
  businessKey: { type: Object as PropType<ApiParams['businessKey']> },
  businessParamsJson: { type: Object as PropType<FileApiParamBusinessParamsJson> },
  businessCheck: { type: Object as PropType<ApiParams['businessCheck']> },
  fileActualId: { type: String as PropType<ApiParams['fileActualId']> },
  fileActualIds: { type: Object as PropType<ApiParams['fileActualIds']> },
  files: { type: Object as PropType<ApiParams['files']>, required: true },
  id: { type: Number as PropType<ApiParams['id']> },
  ids: { type: Object as PropType<Exclude<ApiParams['id'], undefined>[]> },
}
export type FileTableApiParams = ExtractPropTypes<typeof fileTableApiParams>

/** fileVersion 组件下所有 api 参数 */
export const fileVersionApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  fileActualIds: { type: Object as PropType<ApiParams['fileActualIds']> },
  permissionControl: { type: Object as PropType<ApiParams['permissionControl']> },
  id: { type: Number as PropType<ApiParams['id']> },
  ids: { type: Object as PropType<Exclude<ApiParams['id'], undefined>[]> },
}
export type FileVersionApiParams = ExtractPropTypes<typeof fileVersionApiParams>

/** fileView 组件下所有 api 参数 */
export const fileViewApiParams = {
  appId: { type: Object as PropType<ApiParams['appId']> },
  id: { type: Object as PropType<ApiParams['id']> },
}
export type FileViewApiParams = ExtractPropTypes<typeof fileViewApiParams>

/** 只读/新增/编辑（更新）/立即更新，默认只读 */
export type FileMode = 'read' | 'create' | 'update' | 'updateInstantly'

export const fileProps = {
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({ ...DEFAULT_FILE_API_PARAMS }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE, required: true },

  /** 顶部显隐控制 */
  headerVisible: { type: Boolean, default: true },
  title: { type: String, title: 'TaFile' },
  titleVisible: { type: Boolean, default: false },
  /** 顶部操作区显隐控制 */
  headerActionsVisible: { type: Boolean, default: true },
  /** fileactions */
  fileActionsVisible: { type: Boolean, default: true },
  /** 文件真实id(v-model双向绑定) */
  fileActualIds: { type: Array as PropType<string[]> },

  // GlobalConfigFileProps[子组件] 只放子组件用到的 api，各 api 都有 before/after 劫持函数，在子组件中单独定义、使用
  /** FileTypeSelect Props */
  fileTypeSelect: {
    type: Object as PropType<FileTypeSelectProps & GlobalConfigFileProps['fileTypeSelect']>,
  },
  /** FileActionUpload Props */
  fileActionUpload: {
    type: Object as PropType<FileActionUploadProps & GlobalConfigFileProps['fileActionUpload']>,
  },
  // /** FileActionUploadLink Props */
  // fileActionUploadLink: {
  //   type: Object as PropType<
  //     FileActionUploadLinkProps & GlobalConfigFileProps['fileActionUploadLink']
  //   >,
  // },
  // /** FileActionUploadLinkForm Props */
  // fileActionUploadLinkForm: { type: Object as PropType<FileActionsProps & GlobalConfigFileProps['fileActionUploadLink']> },
  /** FileTable Props */
  fileTable: { type: Object as PropType<FileTableProps & GlobalConfigFileProps['fileTable']> },
  // /** FileVersion Props */
  // fileVersion: {
  //   type: Object as PropType<FileVersionProps & GlobalConfigFileProps['fileVersion']>,
  // },
  // /** FileView Props */
  // fileView: {
  //   type: Object as PropType<FileViewProps & GlobalConfigFileProps['fileView']>,
  // },
}

export type FileProps = ExtractPropTypes<typeof fileProps>

export const fileEmits = {
  change: (...args: ArgumentsOf<FileTableEmits['change']>) => args instanceof Object,
  'update:fileActualIds': (...args: ArgumentsOf<FileTableEmits['fileActualIdsChange']>) =>
    args instanceof Object,
}

export type FileEmits = typeof fileEmits

export interface FileInstance {
  elRef: Ref<HTMLDivElement | undefined>
  fileTableRef: Ref<FileTableInstance | undefined>
}
