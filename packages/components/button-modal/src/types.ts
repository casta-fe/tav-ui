import { buttonProps } from '@tav-ui/components/button'
import type { ExtractPropTypes } from 'vue'

export const buttonModalProps = {
  ...buttonProps,
  isInDropDown: {
    type: Boolean,
    default: false,
  },
}

export declare type ButtonModalProps = Partial<ExtractPropTypes<typeof buttonModalProps>>
