import type { ExtractPropTypes, PropType } from 'vue'

export const inputNumberProps = {
  addonAfter: {
    type: [String, Object],
  },
  addonBefore: {
    type: [String, Object],
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  defaultValue: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
  },
  maxLength: {
    type: Number,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<'error' | 'warning'>,
  },
  prefix: {
    type: [String, Object],
  },
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
  },
  suffix: {
    type: [String, Object],
  },
  type: {
    type: String,
    default: 'text',
  },
  value: {
    type: String,
  },
  placeholder: {
    type: String,
  },
}

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>
