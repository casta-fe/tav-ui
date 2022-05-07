import type { ExtractPropTypes, PropType } from 'vue'

export const basicTitleProps = {
  /**
   * Help text list or string
   * @default: ''
   */
  helpMessage: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  /**
   * Whether the color block on the left side of the title
   * @default: false
   */
  span: { type: Boolean },
  icon: { type: String },
  iconColor: { type: String },
  /**
   * Whether to default the text, that is, not bold
   * @default: false
   */
  normal: { type: Boolean },
}

export type BasicTitleProps = ExtractPropTypes<typeof basicTitleProps>
