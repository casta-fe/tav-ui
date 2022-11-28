import {
  DEFAULT_CASCADE_PRO_FIELDS,
  DEFAULT_CASCADE_PRO_FIRST_LETTER_TITLE,
  DEFAULT_CASCADE_PRO_OPTIONS,
  DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG,
  DEFAULT_CASCADE_PRO_PLACEHOLDER,
  DEFAULT_CASCADE_PRO_SEARCH_PLACEHOLDER,
  DEFAULT_CASCADE_PRO_TITLE,
  DEFAULT_HOT,
  getHots,
} from '../constants'
import type { GenerateHotList, GeneratePannelItem } from './cascade-pro'
import type { ExtractPropTypes, PropType } from 'vue'

export const cascadeProSearchProps = {
  /** 是否开启搜索 */
  searchVisible: {
    type: Boolean,
    default: true,
  },
  searchPlaceholder: {
    type: String,
    default: DEFAULT_CASCADE_PRO_SEARCH_PLACEHOLDER,
  },
} as const

export type CascadeProSearchProps = ExtractPropTypes<typeof cascadeProSearchProps>

export const cascadeProFirstLetterProps = {
  /** 首字母标题 */
  firstLetterTitle: {
    type: String,
    default: DEFAULT_CASCADE_PRO_FIRST_LETTER_TITLE,
  },
  /** 是否开启首字母 */
  firstLetterVisible: {
    type: Boolean,
    default: true,
  },
  // // TODO 根据不同级数据动态显示首字母
  // /** 哪一个field显示首字母，必须与fields中填入的field对应 */
  // firstLetterFields: {
  //   type: Array as PropType<string[]>,
  //   default: () => DEFAULT_CASCADE_PRO_FIRST_LETTER_FIELDS,
  // },
} as const

export type CascadeProFirstLetterProps = ExtractPropTypes<typeof cascadeProFirstLetterProps>

export const cascadeProHotProps = {
  /** 是否开启热门 */
  hotVisible: {
    type: Boolean,
    default: true,
  },
  /** 热门数据 */
  hotKeyWords: {
    type: Array as PropType<string[]>,
    default: () => DEFAULT_HOT,
  },
  /** 生成热门数据 */
  generateHotList: {
    type: Function as PropType<GenerateHotList>,
    default: getHots,
  },
} as const

export type CascadeProHotProps = ExtractPropTypes<typeof cascadeProHotProps>

export const cascadeProPannelProps = {
  /** 生成面板数据 */
  generatePannelItem: {
    type: Function as PropType<GeneratePannelItem>,
  },
} as const

export type CascadeProPannelProps = ExtractPropTypes<typeof cascadeProPannelProps>

export const cascadeProSelectResultProps = {} as const

export type CascadeProSelectResultProps = ExtractPropTypes<typeof cascadeProSelectResultProps>

export const cascadeProProps = {
  /** 唯一标识（被某些特定的功能所依赖） */
  id: {
    type: String,
  },
  /** 默认值，数组结构 */
  value: {
    type: Object as PropType<any>,
    default: () => [] as any[],
  },
  /** 这里必须放置与传入options层级对应的数据，例如geo中的省-市-区，这里传入 ['province', 'city', 'district'] 数组中的顺序一定要与option对应⚠️ 这个值也会作为回传字段*/
  fields: {
    type: Array as PropType<string[]>,
    default: () => DEFAULT_CASCADE_PRO_FIELDS,
  },
  /** 组件所需的源数据，树结构。*/
  options: {
    type: Array as PropType<any[]>,
    default: () => DEFAULT_CASCADE_PRO_OPTIONS,
  },
  /** 内部处理数据，这里传key的对应关系。具体数据结构请查看 CascadeProOption */
  optionsKeyConfig: {
    type: Object as PropType<Record<string, any>>,
    default: () => DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG,
  },
  ...cascadeProSearchProps,
  ...cascadeProHotProps,
  ...cascadeProFirstLetterProps,
  ...cascadeProPannelProps,
  ...cascadeProSelectResultProps,
} as const

export type CascadeProProps = ExtractPropTypes<typeof cascadeProProps>

export const cascadeProSelectProps = {
  /** modal title */
  title: {
    type: String,
    default: DEFAULT_CASCADE_PRO_TITLE,
  },
  /** form input placeholder */
  placeholder: {
    type: String,
    default: DEFAULT_CASCADE_PRO_PLACEHOLDER,
  },
  /** form input disable */
  disabled: {
    type: Boolean,
    default: false,
  },
  maxTagCount: {
    type: Number,
    default: 3,
  },
  ...cascadeProProps,
} as const

export type CascadeProSelectProps = ExtractPropTypes<typeof cascadeProSelectProps>
