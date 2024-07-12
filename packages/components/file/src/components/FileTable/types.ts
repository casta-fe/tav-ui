import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type ITableProInstance,
  type TableProColumn,
  type TableProProps,
  tableProProps,
} from '@tav-ui/components/table-pro'
import {
  type ApiParams,
  type FileInjectedProps,
  type UploadFileListItem,
  fileInjectedProps,
} from '../../typings'
import { DEFAULT_API_PARAMS } from '../../consts'

/**
 * 默认列field
 */
type DefaultColumnFields =
  | 'fullName'
  | 'typeName'
  | 'fileSize'
  | 'createByName'
  | 'createTime'
  | 'version'
  | 'action'

export type FileTableColumn = TableProColumn
export const fileTableProps = {
  //:============================== extend props ==============================://
  ...fileInjectedProps,
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({ ...DEFAULT_API_PARAMS }),
  },
  // table-pro props
  ...tableProProps,
  dataSource: {
    type: Array as PropType<UploadFileListItem[]>,
    default: () => [],
  },
  loading: { type: Boolean },
  readonly: { type: Boolean },
  pagerConfig: {
    type: Object as PropType<TableProProps['pagerConfig']>,
    default: () => ({ enabled: false }),
  },
  showOperations: { type: Boolean, default: false },
  fillInner: { type: Boolean, default: false },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  // immediate: { type: Boolean, default: true },
  api: { type: Function as PropType<FileInjectedProps['apiReadFile']> },
  beforeApi: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  afterApi: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  apiDownload: { type: Function as PropType<FileInjectedProps['apiDownload']> },
  beforeApiDownload: { type: Function as PropType<(...args: any[]) => Promise<any>> },
  afterApiDownload: { type: Function as PropType<(...args: any[]) => Promise<any>> },
}

export type FileTableProps = ExtractPropTypes<typeof fileTableProps>

export const fileTableEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}

export type FileTableEmits = typeof fileTableEmits

export interface FileTableInstance {
  elRef: Ref<HTMLDivElement | undefined>
  TableProRef: Ref<ITableProInstance | undefined>
}
