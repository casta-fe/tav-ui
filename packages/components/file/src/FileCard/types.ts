import { type ExtractPropTypes, type PropType, type Ref, type VNode } from 'vue'
import { type TableProActionItem, type TableProApiParams } from '@tav-ui/components/table-pro'
import {
  type ApiUploadFileParams,
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  type FileActionUploadProps,
} from '../components/FileActionUpload'
import {
  type FileActionUploadLinkEmits,
  type FileActionUploadLinkInstance,
  type FileActionUploadLinkProps,
} from '../components/FileActionUploadLink'
import {
  type ApiDeleteFileParams,
  type ApiDownloadFileParams,
  type ApiDownloadWaterMarkerFileParams,
  type ApiQueryFileByActualIds,
  type ApiQueryFileListParams,
  type ApiQueryFileParams,
  type ApiUpdateFileNameAndLinkParams,
} from '../components/FileTable'
import { DEFAULT_APIPARAMS, DEFAULT_FILE_MODE } from '../consts'
import {
  type FileActionUploadApiResponseRecord,
  type FileActualIds,
  type FileMode,
  type GlobalConfigFileProps,
  globalConfigFileProps,
} from '../typings'
import { type ArgumentsOf } from '../utils'
import { type ApiQueryFileHistoryParams } from '../components/FileVersion'
import { type ApiPreviewFileParams } from '../components/FilePreview'
import { type UseCardActionsReturn } from './hooks'
import type { RuleItem, ValidateError, ValidateFieldsError, Values } from 'async-validator'

export {
  ApiDeleteFileParams,
  ApiDownloadFileParams,
  ApiDownloadWaterMarkerFileParams,
  ApiQueryFileByActualIds,
  ApiQueryFileListParams,
  // ApiQueryFileParams,
  ApiUpdateFileNameAndLinkParams,
}

export interface FileCardListItem {
  title?: string
  field: string
  width?: string // TODO
  editRender?: Record<string, any>
  slots?: {
    edit?: string | ((params: { row: FileActionUploadApiResponseRecord }) => VNode | VNode[]) | null
    default?:
      | string
      | ((params: { row: FileActionUploadApiResponseRecord }) => VNode | VNode[])
      | null
  }
  children?: FileCardListItem[]
}
export type FileCardListItemAction = TableProActionItem & { field: string }
export type FileCardReloadApiParams = TableProApiParams
export type FileCardRuleItem = RuleItem & { key: string; trigger: string }

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileCardApiParams
  extends Omit<ApiUploadFileParams, 'moduleCode'>,
    // ApiQueryFileParams,
    ApiQueryFileListParams,
    ApiQueryFileByActualIds,
    ApiQueryFileHistoryParams,
    ApiUpdateFileNameAndLinkParams,
    ApiDeleteFileParams,
    Partial<ApiDownloadFileParams> {}

export const fileCardProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileCard'],
  apiParams: {
    type: Object as PropType<FileCardApiParams>,
    default: () => ({
      ...DEFAULT_APIPARAMS,
    }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  //:============================== extend props ==============================://
  /** 顶部显隐控制 */
  headerVisible: { type: Boolean, default: true },
  labelVisible: { type: Boolean, default: true },
  /** 顶部操作区显隐控制 */
  headerActionsVisible: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  /**
   * 自动请求，包含功能：
   * 1. 初始化是否自动请求（如果有 api 的话）
   * 2. api依赖参数变化后是否自动请求（如果有 api 以及 api 参数）
   * 3. 如果组件有除 api 外的其他数据源，关闭该属性后才能使用其他数据源
   */
  immediate: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  /** typecode name */
  label: {
    type: String,
    required: true,
  },
  /** typecode */
  value: {
    type: String,
    required: true,
  },
  /** 覆盖 filecard rules 配置，这里改为函数，函数参数为默认的 rules，可以根据 key 来找到制定 rule 进行操作 */
  rules: {
    type: Function as PropType<(...args: [FileCardRuleItem[]]) => FileCardRuleItem[]>,
  },
  errorMessageMode: {
    type: String as PropType<'inline | message'>,
    default: 'inline',
  },
  /** 覆盖 filecard columns 配置，这里改为函数，函数参数为默认的 column */
  items: {
    type: Function as PropType<(...args: [FileCardListItem[]]) => FileCardListItem[]>,
  },
  actions: {
    type: Function as PropType<
      (
        ...args: [FileCardListItemAction[], { row: Record<string, any> }]
      ) => FileCardListItemAction[]
    >,
  },
  maxHeight: {
    type: Number,
  },
  /** filecard 数据源都由 datasource 控制，不论是外部传入或内部接口最终都会放入 datasource */
  dataSource: {
    type: Array as PropType<FileActionUploadApiResponseRecord[] | FileActualIds>,
  },
  /** 内部使用，标识数据源是否来自 cards */
  __dataSourceFromCards: {
    type: Boolean,
    default: false,
  },
  // 控制行编辑，默认只能编辑 filename 以及 hyperlinkaddress，想编辑其他字段需自行处理
  enabledRowEdit: { type: Boolean, default: true },
  // 控制 version 列
  enabledVersion: { type: Boolean, default: true },
  // 控制操作列查看按钮有无
  enabledPreview: { type: Boolean, default: true },
  // 控制操作列更新按钮有无
  enabledUpdate: { type: Boolean, default: true },
  // 开启角色控制
  enabledOwner: { type: Boolean, default: true },
  autoValidate: {
    type: Boolean,
    default: true,
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
  beforeApiUploadFile: {
    type: Function as PropType<(apiParams: ApiUploadFileParams) => Promise<any>>,
  },
  afterApiUploadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  // beforeApiQueryFile: {
  //   type: Function as PropType<(apiParams: ApiQueryFileParams) => Promise<any>>,
  // },
  // afterApiQueryFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiQueryFileList: {
    type: Function as PropType<(apiParams: ApiQueryFileParams) => Promise<any>>,
  },
  afterApiQueryFileList: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiQueryFileByActualIds: {
    type: Function as PropType<(apiParams: ApiQueryFileByActualIds) => Promise<any>>,
  },
  afterApiQueryFileByActualIds: {
    type: Function as PropType<(apiResult: any) => Promise<any>>,
  },
  beforeApiQueryFileHistory: {
    type: Function as PropType<(apiParams: ApiQueryFileHistoryParams) => Promise<any>>,
  },
  afterApiQueryFileHistory: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiUpdateFileNameAndLink: {
    type: Function as PropType<(apiParams: ApiUpdateFileNameAndLinkParams) => Promise<any>>,
  },
  afterApiUpdateFileNameAndLink: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiDeleteFile: {
    type: Function as PropType<(apiParams: ApiDeleteFileParams) => Promise<any>>,
  },
  afterApiDeleteFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiPreviewFile: {
    type: Function as PropType<(apiParams: ApiPreviewFileParams) => Promise<any>>,
  },
  afterApiPreviewFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiDownloadFile: {
    type: Function as PropType<(apiParams: ApiDownloadFileParams) => Promise<any>>,
  },
  afterApiDownloadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiDownloadWaterMarkerFile: {
    type: Function as PropType<(apiParams: ApiDownloadWaterMarkerFileParams) => Promise<any>>,
  },
  afterApiDownloadWaterMarkerFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileCardProps = ExtractPropTypes<typeof fileCardProps>

export const fileCardEmits = {
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

  actualidsChange: (...args: [FileActualIds]) => args instanceof Object,
  rowEdit: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
  rowUpdate: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
  rowDelete: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
}

export type FileCardEmits = typeof fileCardEmits

export interface FileCardInstance {
  fileActionUploadRef: Ref<FileActionUploadInstance | undefined>
  fileActionUploadLinkRef: Ref<FileActionUploadLinkInstance | undefined>
  cleanup(): void
  reload: (params?: ApiQueryFileListParams) => Promise<void>
  createRows: UseCardActionsReturn['cardCreateRows']
  readRows: UseCardActionsReturn['cardReadRows']
  updateRows: UseCardActionsReturn['cardUpdateRows']
  deleteRows: UseCardActionsReturn['cardDeleteRows']
  getDataSource: () => FileActionUploadApiResponseRecord[]
  validate: (callback?: CardValidateCallback) => Promise<boolean>
  clearValidate: () => void
}

export type CardValidationResult = Promise<boolean>
export type CardValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError
) => Promise<void> | void
export interface CardValidateFailure {
  errors: ValidateError[] | null
  fields: Values | ValidateFieldsError
}
