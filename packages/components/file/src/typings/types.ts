import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type FileTypeSelectEmits,
  type FileTypeSelectInstance,
  type FileTypeSelectProps,
} from '../components/FileTypeSelect'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  type FileActionUploadProps,
} from '../components/FileActionUpload'
import {
  type FileTableEmits,
  type FileTableInstance,
  type FileTableProps,
  type FileTableReloadApiParams,
} from '../components/FileTable'
import { DEFAULT_APIPARAMS, DEFAULT_FILE_MODE } from '../consts'
// import { type FileActionUploadLinkProps } from '../components/FileActionUploadLink'
import { type ArgumentsOf } from '../utils'
import {
  type FileActionUploadLinkEmits,
  type FileActionUploadLinkInstance,
  type FileActionUploadLinkProps,
} from '../components/FileActionUploadLink'
import { type GlobalConfigFileProps } from './global-config'
import { type FileActualIds } from './api'

/** 单纯定义参数类型，方便统一管理、使用 */
export interface ApiParams {
  /**
   * 查询系统的 id，用于：
   * 1. api/file/queryFileType
   * 2. api/file/upload
   * 3. api/file/queryFile
   * 4. api/file/queryFileList
   * 5. api/file/queryFileTypeSearchCom
   * 6. api/file/updateFile
   * 7. api/file/deleteFileByActualIds
   * 8. api/file/getFileLogModuleList（非必传）
   */
  appId: number | string
  /**
   * 模块 code，用于：
   * 1. api/file/queryFileType
   * 2. api/file/upload
   * 3. api/file/queryFile（非必传）
   * 4. api/file/queryFileList（非必传）
   * 5. api/file/queryFileTypeSearchCom（非必传）
   * 6. api/file/getFileLogModuleList
   */
  moduleCode: string
  /**
   * 类型 code，用于：
   * 1. api/file/upload
   */
  typeCode: string
  /**
   * 类型 codes，用于：
   * 1. api/file/queryFileType（非必传）
   * 2. api/file/queryFile（非必传）
   * 3. api/file/queryFileList（非必传）
   * 4. api/file/queryFileTypeSearchCom（非必传）
   * 5. api/file/getFileLogModuleList（非必传）
   */
  typeCodes: string[]
  /**
   * 业务 businessKey，用于：
   * 1. api/file/upload（非必传）
   * 2. api/file/uploadHyperlink（非必传）
   * 3. api/file/queryFile（非必传）
   * 4. api/file/queryFileList（非必传）
   * 5. api/file/getFileLogModuleList（非必传）
   */
  businessKey: string
  /**
   * 业务 businessId，用于：
   * 1. api/file/upload（非必传）
   * 2. api/file/uploadHyperlink（非必传）
   */
  businessId: string
  /**
   * 业务 businessIds，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   * 3. api/file/getFileLogModuleList（非必传）
   */
  businessIds: string[]
  /**
   * 业务 businessKey & 业务 businessId 互斥检查，用于：
   * 1. api/file/queryFile（非必传，默认 true）
   * 2. api/file/queryFileList（非必传，默认 true）
   */
  businessCheck: boolean
  /**
   * 业务自定义数据，需要在外部使用 json 转为字符串传入。用于：
   * 1. api/file/upload（非必传）
   */
  businessParamsJson: string
  /**
   * 是否控权限，默认 false，用于：
   * 1. api/file/queryFileType（非必传）
   * 2. api/file/queryFile（非必传）
   * 3. api/file/queryFileList（非必传）
   * 4. api/file/queryFileTypeSearchCom（非必传）
   */
  permissionControl: boolean
  /**
   * 文件真实 id，用于：
   * 1. api/file/updateFile
   */
  fileActualId: string
  /**
   * 文件真实 ids，用于：
   * 1. api/file/queryHistoryFileByFileActualIds
   * 2. api/file/deleteFileByActualIds
   * 3. api/file/getFileLogModuleList
   * 4. api/file/queryFileByFileActualIds
   */
  actualIds: string[]
  /**
   * 是否立即更新，用于：
   * 1. api/file/updateFile（非必传）
   * */
  instantUpdate: boolean
  /**
   * 文件 id，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   * 3. api/file/webOnline
   * 4. api/file/fileDownload
   * 5. api/file/downloadToWatermark
   */
  id: number
  /**
   * 排除暂存，默认 false，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  excludeStaging: boolean
  /**
   * 文件列表，用于：
   * 1. api/file/upload
   */
  files: File[]
  /**
   * 文件，用于：
   * 1. api/file/updateFile
   */
  file: File
  /**
   * 文件数据字段，用于：
   * 1. api/file/upload
   */
  fileName: string
  /**
   * 聚合查询框，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  searchValue: string
  /**
   * 开始时间  Format: date-time，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  startTime: string

  /**
   * 结束时间  Format: date-time，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  endTime: string
  /**
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  suffix: string
  /**
   * 查询 modulecode 下级，如果该字段有值那么 modulecode 一定也有值
   * 1. api/file/queryFileType（非必传）
   * 2. api/file/queryFile（非必传）
   * 3. api/file/queryFileList（非必传）
   */
  visibleSubModules: string[]
  /**
   * 业务属性查询后，用哪个属性回显
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  businessDisplayItem: string
  /**
   * 业务属性查询
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  businessSearchItems: { name: string; values: string[] }[]
  /**
   * 排除暂存，默认 true，用于：
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  excludeDeleted: boolean
  /**
   * 负责人List
   * 1. api/file/queryFile（非必传）
   * 2. api/file/queryFileList（非必传）
   */
  owners: string[]
}

/** 只读/新增/编辑（更新）/立即更新，默认只读 */
export type FileMode = 'read' | 'create' | 'update' | 'updateInstantly'

export const fileProps = {
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({
      ...DEFAULT_APIPARAMS,
    }),
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
  fileActualIds: { type: Array as PropType<FileActualIds> },

  // GlobalConfigFileProps[子组件] 只放子组件用到的 api，各 api 都有 before/after 劫持函数，在子组件中单独定义、使用
  /** FileTypeSelect Props */
  fileTypeSelect: {
    type: Object as PropType<FileTypeSelectProps & GlobalConfigFileProps['TaFileTypeSelect']>,
  },
  /** FileActionUpload Props */
  fileActionUpload: {
    type: Object as PropType<FileActionUploadProps & GlobalConfigFileProps['TaFileActionUpload']>,
  },
  /** FileActionUploadLink Props */
  fileActionUploadLink: {
    type: Object as PropType<
      FileActionUploadLinkProps & GlobalConfigFileProps['TaFileActionUploadLink']
    >,
  },
  /** FileTable Props */
  fileTable: { type: Object as PropType<FileTableProps & GlobalConfigFileProps['TaFileTable']> },
  // /** FileVersion Props */
  // fileVersion: {
  //   type: Object as PropType<FileVersionProps & GlobalConfigFileProps['fileVersion']>,
  // },
  // /** FilePreview Props */
  // filePreview: {
  //   type: Object as PropType<FilePreviewProps & GlobalConfigFileProps['filePreview']>,
  // },
}

export type FileProps = ExtractPropTypes<typeof fileProps>

export const fileEmits = {
  // change: (...args: ArgumentsOf<FileTableEmits['change']>) => args instanceof Object,
  'update:fileActualIds': (...args: ArgumentsOf<FileTableEmits['actualidsChange']>) =>
    args instanceof Object,

  'fileTypeSelect:change': (...args: ArgumentsOf<FileTypeSelectEmits['change']>) =>
    args instanceof Object,
  'fileTypeSelect:optionsChange': (...args: ArgumentsOf<FileTypeSelectEmits['optionsChange']>) =>
    args instanceof Object,

  'fileActionUpload:validateSuccessChange': (
    ...args: ArgumentsOf<FileActionUploadEmits['validateSuccessChange']>
  ) => args instanceof Object,
  'fileActionUpload:validateFailureChange': (
    ...args: ArgumentsOf<FileActionUploadEmits['validateFailureChange']>
  ) => args instanceof Object,
  'fileActionUpload:uploadedChange': (
    ...args: ArgumentsOf<FileActionUploadEmits['uploadedChange']>
  ) => args instanceof Object,
  'fileActionUploadLink:validateSuccessChange': (
    ...args: ArgumentsOf<FileActionUploadLinkEmits['validateSuccessChange']>
  ) => args instanceof Object,
  'fileActionUploadLink:validateFailureChange': (
    ...args: ArgumentsOf<FileActionUploadLinkEmits['validateFailureChange']>
  ) => args instanceof Object,
  'fileActionUploadLink:uploadedChange': (
    ...args: ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>
  ) => args instanceof Object,

  'fileTable:rowEdit': (...args: ArgumentsOf<FileTableEmits['rowEdit']>) => args instanceof Object,
  'fileTable:rowUpdate': (...args: ArgumentsOf<FileTableEmits['rowUpdate']>) =>
    args instanceof Object,
  'fileTable:rowDelete': (...args: ArgumentsOf<FileTableEmits['rowDelete']>) =>
    args instanceof Object,
}

export type FileEmits = typeof fileEmits

export interface FileInstance {
  fileTypeSelectRef: Ref<FileTypeSelectInstance | undefined>
  fileActionUploadRef: Ref<FileActionUploadInstance | undefined>
  fileActionUploadLinkRef: Ref<FileActionUploadLinkInstance | undefined>
  fileTableRef: Ref<FileTableInstance | undefined>
  fileTableReload: (params?: FileTableReloadApiParams) => Promise<void>
  fileTableCreateRows: FileTableInstance['createRows']
  fileTableReadRows: FileTableInstance['readRows']
  fileTableUpdateRows: FileTableInstance['updateRows']
  fileTableDeleteRows: FileTableInstance['deleteRows']
  getFileTableSelectRowKeys: FileTableInstance['getFileTableSelectRowKeys']
  clearFileTableSelectedRowByKey: FileTableInstance['clearFileTableSelectedRowByKey']
  getFileTableSelectRows: FileTableInstance['getFileTableSelectRows']
  clearFileTableSelectedRows: FileTableInstance['clearFileTableSelectedRows']
  cleanup(): void
}
