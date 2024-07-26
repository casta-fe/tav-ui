import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type TableProActionItem,
  type TableProColumn,
  type TableProProps,
} from '@tav-ui/components/table-pro'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_FILE_API_PARAMS, DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiQueryFileHistoryParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  type FileVersionApiParams,
  globalConfigFileProps,
} from '../../typings'

export type FileVersionTableColumn = TableProColumn
export type FileVersionTableAction = TableProActionItem & { field: string }

export const fileVersionProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['fileVersion'],
  apiParams: {
    type: Object as PropType<FileVersionApiParams>,
    default: () => ({ ...DEFAULT_FILE_API_PARAMS }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // table-pro props
  dataSource: {
    type: Array as PropType<FileActionUploadApiResponseRecord[]>,
  },
  loading: { type: Boolean },
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
  // modal props
  width: {
    type: [String, Number] as PropType<ModalProps['width']>,
    default: 1000,
  },
  wrapClassName: {
    type: String as PropType<ModalProps['wrapClassName']>,
  },
  destroyOnClose: {
    type: Boolean as PropType<ModalProps['destroyOnClose']>,
    default: true,
  },
  maskClosable: {
    type: Boolean as PropType<ModalProps['destroyOnClose']>,
    default: false,
  },
  getPopupContainer: {
    type: Function as PropType<ModalProps['getContainer']>,
    default: () => document.body,
  },
  //:============================== extend props ==============================://
  visible: { type: Boolean, default: false },
  immediate: { type: Boolean, default: true },
  /** 覆盖 tablepro columns 配置，这里改为函数，函数参数为默认的 column */
  columns: {
    type: Function as PropType<(...args: [FileVersionTableColumn[]]) => FileVersionTableColumn[]>,
  },
  actions: {
    type: Function as PropType<
      (
        ...args: [FileVersionTableAction[], { row: Record<string, any> }]
      ) => FileVersionTableAction[]
    >,
  },
  file: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    default: () => ({} as FileActionUploadApiResponseRecord),
    required: true,
  },
  api: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  beforeApi: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  afterApi: {
    type: Function as PropType<(apiParams: any) => Promise<any>>,
  },
  /** apiQueryFileHistory 已从 ...globalConfigFileProps['fileVersion'] 取到 */
  beforeApiQueryFileHistory: {
    type: Function as PropType<(apiParams: Partial<ApiQueryFileHistoryParams>) => Promise<any>>,
  },
  afterApiQueryFileHistory: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileVersionProps = ExtractPropTypes<typeof fileVersionProps>

export const fileVersionEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FileVersionEmits = typeof fileVersionEmits

export interface FileVersionInstance {
  elRef: Ref<HTMLDivElement | undefined>
  open: () => any
  close: () => any
}
