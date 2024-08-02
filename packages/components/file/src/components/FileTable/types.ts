import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type ITableProInstance,
  type TableProActionItem,
  type TableProApiParams,
  type TableProColumn,
  type TableProProps,
} from '@tav-ui/components/table-pro'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'
import { DEFAULT_APIPARAMS, DEFAULT_FILE_MODE } from '../../consts'
import { type FileVersionCache } from '../../hooks'
import { type ApiUploadFileParams } from './../FileActionUpload/types'
import { type ApiQueryFileHistoryParams } from './../FileVersion/types'
import { type ApiPreviewFileParams } from './../FilePreview/types'

// /**
//  * 默认列field
//  */
// type DefaultColumnFields =
//   | 'fullName'
//   | 'typeName'
//   | 'fileSize'
//   | 'createByName'
//   | 'createTime'
//   | 'version'
//   | 'action'

export type FileTableColumn = TableProColumn
export type FileTableAction = TableProActionItem & { field: string }
export type FileTableFilterFormConfig = TableProProps['filterFormConfig']
export type FileTableReloadApiParams = TableProApiParams

// 按照 swagger 编写
export interface ApiQueryFileParams {
  appId: ApiParams['appId']
  businessCheck: ApiParams['businessCheck']
  businessIds?: ApiParams['businessIds']
  businessKey?: ApiParams['businessKey']
  endTime?: ApiParams['endTime']
  finalTypeCodes?: ApiParams['finalTypeCodes']
  id?: ApiParams['id']
  includeStaging?: ApiParams['includeStaging']
  moduleCode?: ApiParams['moduleCode']
  permissionControl?: ApiParams['permissionControl']
  searchValue?: ApiParams['searchValue']
  startTime?: ApiParams['startTime']
  suffix?: ApiParams['suffix']
  typeCodes?: ApiParams['typeCodes']
}

// 按照 swagger 编写
export interface ApiQueryFileListParams {
  appId: ApiParams['appId']
  businessCheck: ApiParams['businessCheck']
  businessIds?: ApiParams['businessIds']
  businessKey?: ApiParams['businessKey']
  endTime?: ApiParams['endTime']
  finalTypeCodes?: ApiParams['finalTypeCodes']
  id?: ApiParams['id']
  includeStaging?: ApiParams['includeStaging']
  moduleCode?: ApiParams['moduleCode']
  permissionControl?: ApiParams['permissionControl']
  searchValue?: ApiParams['searchValue']
  startTime?: ApiParams['startTime']
  suffix?: ApiParams['suffix']
  typeCodes?: ApiParams['typeCodes']
}

// 按照 swagger 编写
export interface ApiQueryFilterFormFileTypeParams {
  appId: ApiParams['appId']
  moduleCode?: ApiParams['moduleCode']
  typeCodes?: ApiParams['typeCodes']
  permissionControl?: ApiParams['permissionControl']
}

// 按照 swagger 编写
export interface ApiUpdateFileNameAndLinkParams {
  appId: ApiParams['appId']
  id?: ApiParams['id']
  name?: string
  address?: string
}

// 按照 swagger 编写
export interface ApiDeleteFileParams {
  appId: ApiParams['appId']
  actualIds: ApiParams['actualIds']
}

// 按照 swagger 编写
export interface ApiDownloadFileParams {
  id: ApiParams['id']
}

// 按照 swagger 编写
export interface ApiDownloadWaterMarkerFileParams {
  id: ApiParams['id']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileTableApiParams
  extends Omit<ApiUploadFileParams, 'moduleCode'>,
    ApiQueryFileParams,
    ApiQueryFileListParams,
    ApiQueryFileHistoryParams,
    ApiUpdateFileNameAndLinkParams,
    ApiDeleteFileParams,
    Partial<ApiDownloadFileParams>,
    ApiQueryFilterFormFileTypeParams {}

export const fileTableProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileTable'],
  apiParams: {
    type: Object as PropType<FileTableApiParams>,
    default: () => ({
      ...DEFAULT_APIPARAMS,
    }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // table-pro props
  dataSource: {
    type: Array as PropType<FileActionUploadApiResponseRecord[]>,
  },
  loading: { type: Boolean, default: false },
  checkboxConfig: {
    type: Object as PropType<TableProProps['checkboxConfig']>,
    default: () => ({ enabled: false }),
  },
  pagerConfig: {
    type: Object as PropType<TableProProps['pagerConfig']>,
    default: () => ({ enabled: false }),
  },
  showOperations: { type: Boolean, default: false },
  fillInner: { type: Boolean, default: false },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  /** 是否自动请求 */
  immediate: { type: Boolean, default: true },
  /** 覆盖 tablepro columns 配置，这里改为函数，函数参数为默认的 column */
  columns: {
    type: Function as PropType<(...args: [FileTableColumn[]]) => FileTableColumn[]>,
  },
  actions: {
    type: Function as PropType<
      (...args: [FileTableAction[], { row: Record<string, any> }]) => FileTableAction[]
    >,
  },
  filterFormConfig: {
    type: [Boolean, Function] as PropType<
      boolean | ((...args: [FileTableFilterFormConfig]) => FileTableFilterFormConfig)
    >,
    default: false,
  },
  /** tafile 内部使用勿传 */
  __uploadDataSource: {
    type: Array as PropType<FileActionUploadApiResponseRecord[]>,
  },
  /** tafile 内部使用勿传 */
  __uploadLinkDataSource: {
    type: Array as PropType<FileActionUploadApiResponseRecord[]>,
  },
  /** 主要用来控制只读/立即更新模式下的query接口使用分页还是不分页，新增/编辑模式下query接口默认使用不分页 */
  modeQueryApiType: { type: String as PropType<'pager' | 'list'>, default: 'list' },
  // 控制行编辑，只能编辑 filename 以及 hyperlinkaddress
  enabledRowEdit: { type: Boolean, default: false },
  // 控制 version 列
  enabledVersion: { type: Boolean, default: true },
  // 控制操作列查看按钮有无
  enabledPreview: { type: Boolean, default: true },
  // 控制操作列更新按钮有无
  enabledUpdate: { type: Boolean, default: true },
  /** apiUploadFile 已从 ...globalConfigFileProps['filetable'] 取到 */
  beforeApiUploadFile: {
    type: Function as PropType<(apiParams: ApiUploadFileParams) => Promise<any>>,
  },
  afterApiUploadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  /** apiQueryFile 已从 ...globalConfigFileProps['filetable'] 取到 */
  beforeApiQueryFile: {
    type: Function as PropType<(apiParams: ApiQueryFileParams) => Promise<any>>,
  },
  afterApiQueryFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiQueryFileList: {
    type: Function as PropType<(apiParams: ApiQueryFileParams) => Promise<any>>,
  },
  // afterApiQueryFileList: { type: Function as PropType<(apiResult: any) => Promise<any>> }, // 与上面 afterApiQueryFile 合并为一个函数
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
  beforeApiQueryFilterFormFileType: {
    type: Function as PropType<(apiParams: ApiQueryFilterFormFileTypeParams) => Promise<any>>,
  },
  afterApiQueryFilterFormFileType: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileTableProps = ExtractPropTypes<typeof fileTableProps>

export const fileTableEmits = {
  // change: (
  //   ...args: [FileActionUploadApiResponseRecord[], FileActionUploadApiResponseRecord[], string]
  // ) => args instanceof Object,
  actualidsChange: (
    ...args: [
      (
        | {
            actualId: string
            moduleCode: string | undefined
            versionList: FileVersionCache[]
          }
        | string
      )[]
    ]
  ) => args instanceof Object,
  rowEdit: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
  rowUpdate: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
  rowDelete: (...args: [FileActionUploadApiResponseRecord]) => args instanceof Object,
}

export type FileTableEmits = typeof fileTableEmits

export interface FileTableInstance {
  elRef: Ref<HTMLDivElement | undefined>
  tableProRef: Ref<ITableProInstance | undefined>
  cleanup: () => Promise<void>
  reload: (params?: FileTableReloadApiParams) => Promise<void>
  createRows: (
    rows: FileActionUploadApiResponseRecord[],
    pos: FileActionUploadApiResponseRecord | -1 | null
  ) => Promise<void>
  readRows: () => Promise<FileActionUploadApiResponseRecord[]>
  updateRows(
    rows: FileActionUploadApiResponseRecord[],
    deleteRows: FileActionUploadApiResponseRecord[],
    pos: FileActionUploadApiResponseRecord | null | -1
  ): Promise<void>
  deleteRows(rows: FileActionUploadApiResponseRecord[]): Promise<void>
}
