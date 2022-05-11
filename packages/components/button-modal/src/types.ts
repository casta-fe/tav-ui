import type { ExtractPropTypes } from 'vue'

export const buttonModalProps = {
  isInDropDown: {
    type: Boolean,
    default: false,
  },
}

export declare type ButtonModalProps = Partial<ExtractPropTypes<typeof buttonModalProps>>
