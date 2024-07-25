import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type ITableProInstance,
  type TableProActionItem,
  type TableProColumn,
  type TableProProps,
} from '@tav-ui/components/table-pro'
import {
  type ApiDeleteFileParams,
  type ApiDownloadFileParams,
  type ApiDownloadWaterMarkerFileParams,
  type ApiQueryFileParams,
  type ApiUpdateFileNameAndLinkParams,
  type ApiUpdateFileParams,
  type ApiUploadFileParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  type FileTableApiParams,
  globalConfigFileProps,
} from '../../typings'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_MODE } from '../../consts'
import { type FileVersionCache } from '../../hooks'

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

export const fileTableProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['fileTable'],
  apiParams: {
    type: Object as PropType<FileTableApiParams>,
    default: () => ({ ...DEFAULT_FILE_API_PARAMS }),
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
  // 控制行编辑，只能编辑 filename 以及 hyperlinkaddress
  enabledRowEdit: { type: Boolean, default: false },
  // 控制 version 与操作列更新按钮有无，除了这个标识还需要根据返回数据中的字段 hyperlink 与 auto 来判断
  enabledVersion: { type: Boolean, default: true },
  // 控制操作列查看按钮有无
  enabledPreview: { type: Boolean, default: true },
  api: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  beforeApi: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  afterApi: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  /** apiUploadFile 已从 ...globalConfigFileProps['filetable'] 取到 */
  beforeApiUploadFile: {
    type: Function as PropType<(apiParams: Partial<ApiUploadFileParams>) => Promise<any>>,
  },
  afterApiUploadFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  /** apiQueryFile 已从 ...globalConfigFileProps['filetable'] 取到 */
  beforeApiQueryFile: {
    type: Function as PropType<(apiParams: Partial<ApiQueryFileParams>) => Promise<any>>,
  },
  afterApiQueryFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
  beforeApiQueryFileList: {
    type: Function as PropType<(apiParams: Partial<ApiQueryFileParams>) => Promise<any>>,
  },
  afterApiQueryFileList: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  beforeApiUpdateFile: {
    type: Function as PropType<(apiParams: Partial<ApiUpdateFileParams>) => Promise<any>>,
  },
  afterApiUpdateFile: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  beforeApiUpdateFileNameAndLink: {
    type: Function as PropType<
      (apiParams: Partial<ApiUpdateFileNameAndLinkParams>) => Promise<any>
    >,
  },
  afterApiUpdateFileNameAndLink: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  beforeApiDeleteFile: {
    type: Function as PropType<(apiParams: Partial<ApiDeleteFileParams>) => Promise<any>>,
  },
  afterApiDeleteFile: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  beforeApiDownloadFile: {
    type: Function as PropType<(apiParams: Partial<ApiDownloadFileParams>) => Promise<any>>,
  },
  afterApiDownloadFile: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  beforeApiDownloadWaterMarkerFile: {
    type: Function as PropType<
      (apiParams: Partial<ApiDownloadWaterMarkerFileParams>) => Promise<any>
    >,
  },
  afterApiDownloadWaterMarkerFile: { type: Function as PropType<(...args: any[]) => Promise<any>> },
}

export type FileTableProps = ExtractPropTypes<typeof fileTableProps>

export const fileTableEmits = {
  change: (
    ...args: [FileActionUploadApiResponseRecord[], FileActionUploadApiResponseRecord[], string]
  ) => args instanceof Object,
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
}

export type FileTableEmits = typeof fileTableEmits

export interface FileTableInstance {
  elRef: Ref<HTMLDivElement | undefined>
  tableProRef: Ref<ITableProInstance | undefined>
}
