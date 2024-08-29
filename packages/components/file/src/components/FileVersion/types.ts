import { type ExtractPropTypes, type PropType } from 'vue'
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
import { type ApiPreviewFileParams } from '../FilePreview/types'
import {
  type ApiDownloadFileParams,
  type ApiDownloadWaterMarkerFileParams,
} from '../FileTable/types'

export type FileVersionTableColumn = TableProColumn
export type FileVersionTableAction = TableProActionItem & { field: string }

// 按照 swagger 编写
export interface ApiQueryFileHistoryParams {
  actualIds: ApiParams['actualIds']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileVersionApiParams extends ApiQueryFileHistoryParams {}

export const fileVersionProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileVersion'],
  apiParams: {
    type: Object as PropType<FileVersionApiParams>,
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
  /** 给table填充颜色，将table和filterform区分开 */
  fillInner: {
    type: Boolean,
    default: false,
  },
  /** 控制 filterform & customaction 整体显示与隐藏 */
  showOperations: {
    type: Boolean,
    default: false,
  },
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
  /**
   * 自动请求，包含功能：
   * 1. 初始化是否自动请求（如果有 api 的话）
   * 2. api依赖参数变化后是否自动请求（如果有 api 以及 api 参数）
   * 3. 如果组件有除 api 外的其他数据源，关闭该属性后才能使用其他数据源
   */
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
  // 控制操作列查看按钮有无
  enabledPreview: { type: Boolean, default: true },
  /** apiQueryFileHistory 已从 ...globalConfigFileProps['fileVersion'] 取到 */
  beforeApiQueryFileHistory: {
    type: Function as PropType<(apiParams: ApiQueryFileHistoryParams) => Promise<any>>,
  },
  afterApiQueryFileHistory: { type: Function as PropType<(apiResult: any) => Promise<any>> },
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

export type FileVersionProps = ExtractPropTypes<typeof fileVersionProps>

export const fileVersionEmits = {
  open: () => true,
  close: () => true,
  'update:visible': (visible: boolean) => isBoolean(visible),
}

export type FileVersionEmits = typeof fileVersionEmits

export interface FileVersionInstance {
  open: () => any
  close: () => any
  cleanup(): void
}
