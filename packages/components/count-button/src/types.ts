import type { ExtractPropTypes, PropType } from 'vue'

export const countButtonProps = {
  value: { type: [Object, Number, String, Array] },
  count: { type: Number, default: 60 },
  beforeStartFunc: {
    type: Function as PropType<() => Promise<boolean>>,
    default: null,
  },
}

export type CountButtonProps = ExtractPropTypes<typeof countButtonProps>
