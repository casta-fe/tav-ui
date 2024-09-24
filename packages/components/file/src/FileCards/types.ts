import { type ExtractPropTypes, type PropType } from 'vue'
import { DEFAULT_APIPARAMS, DEFAULT_FILE_MODE } from '../consts'
import {
  type FileActionUploadApiResponseRecord,
  type FileMode,
  type FileTypeSelectApiResponseRecord,
  type GlobalConfigFileProps,
  globalConfigFileProps,
} from '../typings'
import { type ArgumentsOf } from '../utils'
import { type ApiQueryFileTypeParams } from '../components/FileTypeSelect'
import { type ApiQueryFileListParams } from '../components/FileTable'
import { type FileCardEmits, type FileCardProps } from '../FileCard'
import {
  type FileActionUploadEmits,
  type FileActionUploadProps,
} from '../components/FileActionUpload'
import {
  type FileActionUploadLinkEmits,
  type FileActionUploadLinkProps,
} from '../components/FileActionUploadLink'

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileCardsApiParams
  extends ApiQueryFileTypeParams,
    Omit<ApiQueryFileListParams, 'moduleCode'> {}

export interface FileCardsCatagory {
  label: FileCardProps['label']
  value: FileCardProps['value']
  dataSource: FileCardProps['dataSource']
}

/** 统一配置 filecard */
export type FileCardSingle = Omit<
  FileCardProps & GlobalConfigFileProps['TaFileCard'],
  'label' | 'value' | 'dataSource'
>
/** 单独配置 filecard */
export type FileCardMultiple = (FileCardProps & GlobalConfigFileProps['TaFileCard'])[]

export const fileCardsProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileCards'],
  apiParams: {
    type: Object as PropType<FileCardsApiParams>,
    default: () => ({
      ...DEFAULT_APIPARAMS,
    }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE, required: true },
  //:============================== extend props ==============================://
  visible: { type: Boolean, default: true },
  /**
   * 自动请求，包含功能：
   * 1. 初始化是否自动请求（如果有 api 的话）
   * 2. api依赖参数变化后是否自动请求（如果有 api 以及 api 参数）
   * 3. 如果组件有除 api 外的其他数据源，关闭该属性后才能使用其他数据源
   */
  immediate: { type: Boolean, default: true },
  loading: {
    type: Boolean,
    default: false,
  },
  // 统一控制
  autoValidate: {
    type: Boolean,
    default: true,
  },
  /** 默认 filecard 纵向平铺显示，开启后使用瀑布流布局 */
  waterfallConfig: {
    type: Object as PropType<{
      enabled: boolean // 如果开启 width 默认400
      width?: number
    }>,
    default: () => ({
      enabled: false,
    }),
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
  /** FileCard Props，传对象的话相当于同一配置，传对象数组相当于单独配置。组件内部不做合并处理，单独配置优先 */
  fileCard: {
    type: Object as PropType<FileCardSingle | FileCardMultiple>,
  },
  /** apiQueryFileType 已从 ...globalConfigFileProps['fileTypeSelect'] 取到 */
  beforeApiQueryFileType: {
    type: Function as PropType<(apiParams: ApiQueryFileTypeParams) => Promise<any>>,
  },
  /** afterapi 接收参数为 apiresult 数据，可以对接口返回数据做处理，返回 false 会取原始的 apiresult */
  afterApiQueryFileType: {
    type: Function as PropType<(apiResult: FileTypeSelectApiResponseRecord[]) => Promise<any>>,
  },
  beforeApiQueryFileList: {
    type: Function as PropType<(apiParams: ApiQueryFileListParams) => Promise<any>>,
  },
  afterApiQueryFileList: {
    type: Function as PropType<(apiResult: FileActionUploadApiResponseRecord[]) => Promise<any>>,
  },
  catchApiQueryFileListError: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileCardsProps = ExtractPropTypes<typeof fileCardsProps>

export const fileCardsEmits = {
  // change: (...args: ArgumentsOf<FileCardEmits['change']>) => args instanceof Object,
  'update:fileActualIds': (...args: ArgumentsOf<FileCardEmits['actualidsChange']>) =>
    args instanceof Object,

  // 'fileTypeSelect:change': (...args: ArgumentsOf<FileTypeSelectEmits['change']>) =>
  //   args instanceof Object,
  // 'fileTypeSelect:optionsChange': (...args: ArgumentsOf<FileTypeSelectEmits['optionsChange']>) =>
  //   args instanceof Object,

  'fileActionUpload:validateSuccessChange': (
    ...args: [string, ArgumentsOf<FileActionUploadEmits['validateSuccessChange']>]
  ) => args instanceof Object,
  'fileActionUpload:validateFailureChange': (
    ...args: [string, ArgumentsOf<FileActionUploadEmits['validateFailureChange']>]
  ) => args instanceof Object,
  'fileActionUpload:uploadedChange': (
    ...args: [string, ArgumentsOf<FileActionUploadEmits['uploadedChange']>]
  ) => args instanceof Object,
  'fileActionUploadLink:validateSuccessChange': (
    ...args: [string, ArgumentsOf<FileActionUploadLinkEmits['validateSuccessChange']>]
  ) => args instanceof Object,
  'fileActionUploadLink:validateFailureChange': (
    ...args: [string, ArgumentsOf<FileActionUploadLinkEmits['validateFailureChange']>]
  ) => args instanceof Object,
  'fileActionUploadLink:uploadedChange': (
    ...args: [string, ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>]
  ) => args instanceof Object,

  'fileCard:rowEdit': (...args: ArgumentsOf<FileCardEmits['rowEdit']>) => args instanceof Object,
  'fileCard:rowUpdate': (...args: ArgumentsOf<FileCardEmits['rowUpdate']>) =>
    args instanceof Object,
  'fileCard:rowDelete': (...args: ArgumentsOf<FileCardEmits['rowDelete']>) =>
    args instanceof Object,
}

export type FileCardsEmits = typeof fileCardsEmits

export interface FileCardsInstance {
  cleanup(): void
  getDataSource: (cardPropValue?: string) => FileActionUploadApiResponseRecord[]
  validate: (cardPropValue?: string) => Promise<any>
  clearValidate: (cardPropValue?: string) => void
}
