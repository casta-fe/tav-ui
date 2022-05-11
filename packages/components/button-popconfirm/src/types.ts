import type { ExtractPropTypes } from 'vue'

export const buttonPopconfirmProps = {
  /**
   * Whether to enable the drop-down menu
   * @default: true
   */
  enable: {
    type: Boolean,
    default: true,
  },
}

export type ButtonPopconfirmProps = ExtractPropTypes<typeof buttonPopconfirmProps>
