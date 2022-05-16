import type { ExtractPropTypes, PropType } from 'vue'

export const countDownButtonProps = {
  value: { type: [Object, Number, String, Array] },
  count: { type: Number, default: 60 },
  beforeStartFunc: {
    type: Function as PropType<() => Promise<boolean>>,
    default: null,
  },
}

export type CountDownButtonProps = ExtractPropTypes<typeof countDownButtonProps>

export const countDownProps = {
  value: { type: String },
  size: { type: String, validator: (v) => ['default', 'large', 'small'].includes(v) },
  count: { type: Number, default: 60 },
  sendCodeApi: {
    type: Function as PropType<() => Promise<boolean>>,
    default: null,
  },
}

export type CountDownProps = ExtractPropTypes<typeof countDownProps>
