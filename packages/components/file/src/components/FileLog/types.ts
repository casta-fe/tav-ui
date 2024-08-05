import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import {
  type TableProActionItem,
  type TableProColumn,
  type TableProProps,
} from '@tav-ui/components/table-pro'
import { type ModalProps } from '@tav-ui/components/modal'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'

export type FileLogTableColumn = TableProColumn
export type FileLogTableAction = TableProActionItem & { field: string }

// 按照 swagger 编写
export interface ApiQueryFileLogParams {
  actualIds: ApiParams['actualIds']
  appId: ApiParams['appId']
  createBy?: number[]
  endCreateDate?: string
  startCreateDate?: string
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileLogApiParams extends ApiQueryFileLogParams {}

export const fileLogProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileLog'],
  apiParams: {
    type: Object as PropType<FileLogApiParams>,
    default: () => ({}),
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
  /** 是否自动请求 */
  immediate: { type: Boolean, default: true },
  /** 覆盖 tablepro columns 配置，这里改为函数，函数参数为默认的 column */
  columns: {
    type: Function as PropType<(...args: [FileLogTableColumn[]]) => FileLogTableColumn[]>,
  },
  actions: {
    type: Function as PropType<
      (...args: [FileLogTableAction[], { row: Record<string, any> }]) => FileLogTableAction[]
    >,
  },
  file: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    default: () => ({} as FileActionUploadApiResponseRecord),
    required: true,
  },
  /** apiQueryFileLog 已从 ...globalConfigFileProps['fileLog'] 取到 */
  beforeApiQueryFileLog: {
    type: Function as PropType<(apiParams: ApiQueryFileLogParams) => Promise<any>>,
  },
  afterApiQueryFileLog: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileLogProps = ExtractPropTypes<typeof fileLogProps>

export const fileLogEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FileLogEmits = typeof fileLogEmits

export interface FileLogInstance {
  elRef: Ref<HTMLDivElement | undefined>
  open: () => any
  close: () => any
}
