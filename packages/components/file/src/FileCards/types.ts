import {
  type ExtractPropTypes,
  type PropType,
  type Ref,
  type SetupContext,
  type UnwrapRef,
} from 'vue'
import { DEFAULT_APIPARAMS, DEFAULT_FILE_IGNORE_TYPES, DEFAULT_FILE_MODE } from '../consts'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  type FileTypeSelectApiResponseRecord,
  type GlobalConfigFileProps,
  globalConfigFileProps,
} from '../typings'
import { type Arrayable } from '../utils'
import { type ApiQueryFileTypeParams } from '../components/FileTypeSelect'
import { type ApiQueryFileListParams } from '../components/FileTable'
import { type FileCardContext, type FileCardPropKey, type FileCardProps } from '../FileCard'
import type { MaybeRef } from '@vueuse/core'

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileCardsApiParams
  extends ApiQueryFileTypeParams,
    Omit<ApiQueryFileListParams, 'moduleCode'> {}

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
  // /**
  //  * @description Validation rules of form.
  //  */
  // rules: {
  //   type: Object,
  // },
  /**
   * @description Whether to show the error message.
   */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /**
   * @description When validation fails, scroll to the first error form entry.
   */
  scrollToError: Boolean,
  /**
   * @description When validation fails, it scrolls to the first error item based on the scrollIntoView option.
   */
  scrollIntoViewOptions: {
    type: [Object, Boolean],
  },
  /** FileCard Props */
  fileCard: {
    type: Object as PropType<(FileCardProps & GlobalConfigFileProps['TaFileCard'])[]>,
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
}

export type FileCardsProps = ExtractPropTypes<typeof fileCardsProps>

export const fileCardsEmits = {
  open: () => true,
  close: () => true,
}

export type FileCardsEmits = typeof fileCardsEmits

export interface FileCardsInstance {
  elRef: Ref<HTMLDivElement | undefined>
  cleanup(): void
}

export interface FileCardsContext extends FileCardsProps {
  emit: SetupContext<FileCardsEmits>['emit']
  getCard: (propKey: string) => FileCardContext | undefined
  addCard: (card: FileCardContext) => void
  removeCard: (card: FileCardContext) => void
  resetCards: (propKeys?: Arrayable<FileCardPropKey>) => void
  clearValidate: (propKeys?: Arrayable<FileCardPropKey>) => void
  validateCard: (
    propKeys?: Arrayable<FileCardPropKey>,
    callback?: (isValid: boolean, invalidFields?: any) => Promise<void> | void
  ) => Promise<boolean>
}
