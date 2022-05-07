import type { ExtractPropTypes, PropType } from 'vue'

export const basicHelpProps = {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { type: String, default: '600px' },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { type: String, default: '#ffffff' },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { type: String, default: '14px' },
  /**
   * Help text list
   */
  placement: { type: String, default: 'right' },
  /**
   * Help text list
   */
  text: { type: [Array, String] as PropType<string[] | string> },
}

export type BasicHelpProps = ExtractPropTypes<typeof basicHelpProps>
