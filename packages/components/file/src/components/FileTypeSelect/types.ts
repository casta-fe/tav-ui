import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type SelectProps as ASelectProps } from 'ant-design-vue'
import { type ApiParams, type FileInjectedProps, fileInjectedProps } from '../../typings'
import { DEFAULT_API_PARAMS } from '../../consts'
import { type ArgumentsOf } from '../../utils'

export const fileTypeSelectProps = {
  //:============================== extend props ==============================://
  ...fileInjectedProps,
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({ ...DEFAULT_API_PARAMS }),
  },
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
  // immediate: { type: Boolean, default: true },
  /** queryfiletype 接口 */
  api: { type: Function as PropType<FileInjectedProps['apiReadFileType']> },
  /** beforeApi 接收参数为 apiparams，想要修改请在传入的 props 中修改，返回值仅为 boolean，返回 false 会中断 api 发送 */
  beforeApi: { type: Function as PropType<(apiParams: ApiParams) => Promise<boolean>> },
  /** afterapi 接收参数为 apiresult 数据，可以对接口返回数据做处理，返回 false 会取原始的 apiresult */
  afterApi: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileTypeSelectProps = ExtractPropTypes<typeof fileTypeSelectProps>

export const fileTypeSelectEmits = {
  change: (...args: ArgumentsOf<ASelectProps['onChange']>) => args instanceof Object,
  select: (
    ...args: [
      ...ArgumentsOf<ASelectProps['onSelect']>,
      Exclude<FileTypeSelectProps['fieldNames'], undefined>
    ]
  ) => args instanceof Object,
  deselect: (...args: ArgumentsOf<ASelectProps['onDeselect']>) => args instanceof Object,
  dropdownVisibleChange: (...args: ArgumentsOf<ASelectProps['onDropdownVisibleChange']>) =>
    args instanceof Object,
  optionsChange: (...args: [FileTypeSelectProps['options'], FileTypeSelectProps['fieldNames']]) =>
    args instanceof Object,
}

export type FileTypeSelectEmits = typeof fileTypeSelectEmits

export interface FileTypeSelectInstance {
  elRef: Ref<HTMLDivElement | undefined>
  /** 因为 ASelect 导出实例为 any，所以这里只能为 any */
  ASelectRef: Ref<any | undefined>
}
