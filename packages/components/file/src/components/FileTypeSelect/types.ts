import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type SelectProps as ASelectProps } from 'ant-design-vue'
import {
  type ApiParams,
  type FileMode,
  type FileTypeSelectApiResponseRecord,
  globalConfigFileProps,
} from '../../typings'
import { type ArgumentsOf } from '../../utils'
import { DEFAULT_FILE_MODE } from '../../consts'

// 按照 swagger 编写
export interface ApiQueryFileTypeParams {
  appId?: ApiParams['appId']
  moduleCode: ApiParams['moduleCode']
  typeCodes?: ApiParams['typeCodes']
  permissionControl?: ApiParams['permissionControl']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileTypeSelectApiParams extends ApiQueryFileTypeParams {}

export const fileTypeSelectProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileTypeSelect'],
  apiParams: {
    type: Object as PropType<FileTypeSelectApiParams>,
    default: () => ({ permissionControl: false }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  // ASelect props
  value: { type: Object as PropType<ASelectProps['value']> },
  options: { type: Array as PropType<ASelectProps['options']>, default: () => [] },
  fieldNames: {
    type: Object as PropType<ASelectProps['fieldNames']>,
    default: () => ({
      label: 'name',
      value: 'code',
    }),
  },
  disabled: { type: Object as PropType<ASelectProps['disabled']> },
  placeholder: { type: String as PropType<ASelectProps['placeholder']> },
  getPopupContainer: {
    type: Function as PropType<ASelectProps['getPopupContainer']>,
    default: () => document.body,
  },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  /** apiQueryFileType 已从 ...globalConfigFileProps['fileTypeSelect'] 取到 */
  beforeApiQueryFileType: {
    type: Function as PropType<(apiParams: ApiQueryFileTypeParams) => Promise<any>>,
  },
  /** afterapi 接收参数为 apiresult 数据，可以对接口返回数据做处理，返回 false 会取原始的 apiresult */
  afterApiQueryFileType: {
    type: Function as PropType<(apiResult: FileTypeSelectApiResponseRecord[]) => Promise<any>>,
  },

  //:============================== tafile inner usage ==============================://
  //:============================== tafile inner usage ==============================://
}

export type FileTypeSelectProps = ExtractPropTypes<typeof fileTypeSelectProps>

export const fileTypeSelectEmits = {
  // change: (...args: ArgumentsOf<ASelectProps['onChange']>) => args instanceof Object,
  select: (
    ...args: [
      ...ArgumentsOf<ASelectProps['onSelect']>,
      Exclude<FileTypeSelectProps['fieldNames'], undefined>
    ]
  ) => args instanceof Object,
  deselect: (...args: ArgumentsOf<ASelectProps['onDeselect']>) => args instanceof Object,
  dropdownVisibleChange: (...args: ArgumentsOf<ASelectProps['onDropdownVisibleChange']>) =>
    args instanceof Object,
  clear: (
    ...args: [
      ...ArgumentsOf<ASelectProps['onSelect']>,
      Exclude<FileTypeSelectProps['fieldNames'], undefined>
    ]
  ) => args instanceof Object,
  change: (
    ...args: [
      ...ArgumentsOf<ASelectProps['onSelect']>,
      Exclude<FileTypeSelectProps['fieldNames'], undefined>
    ]
  ) => args instanceof Object,
  optionsChange: (...args: [FileTypeSelectProps['options'], FileTypeSelectProps['fieldNames']]) =>
    args instanceof Object,
}

export type FileTypeSelectEmits = typeof fileTypeSelectEmits

export interface FileTypeSelectInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
