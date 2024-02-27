import { propTypes } from '@tav-ui/utils/propTypes'
import type { ExtractPropTypes, PropType } from 'vue'
import type { ButtonShape } from 'ant-design-vue/lib/button'
const tuple = <T extends string[]>(...args: T) => args
const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text')
// const ButtonShapes = tuple('circle', 'round')
const ButtonHTMLTypes = tuple('submit', 'button', 'reset')

export const buttonProps = {
  //antdv button
  prefixCls: propTypes.string,
  type: propTypes.oneOf(ButtonTypes),
  htmlType: propTypes.oneOf(ButtonHTMLTypes).def('button'),
  shape: {
    type: String as PropType<ButtonShape>,
  },
  size: {
    type: String as PropType<'small' | 'middle' | 'large' | undefined>,
  },
  loading: {
    type: [Boolean, Object] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false,
  },
  // // disabled: propTypes.looseBool,
  ghost: propTypes.looseBool,
  block: propTypes.looseBool,
  danger: propTypes.looseBool,
  icon: propTypes.VNodeChild,
  href: propTypes.string,
  target: propTypes.string,
  title: propTypes.string,
  // // onClick: {
  // //   type: Function
  // // }

  // extend
  color: { type: String, validator: (v) => ['error', 'warning', 'success', ''].includes(v) },
  // loading: { type: Boolean },
  disabled: { type: Boolean },
  /**
   * Text before icon.
   */
  preIcon: { type: String },
  preIconColor: { type: String },
  /**
   * Text after icon.
   */
  postIcon: { type: String },
  postIconColor: { type: String },
  /**
   * preIcon and postIcon icon size.
   * @default: 14
   */
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
  permission: { type: String },
  ifShow: { type: Boolean, default: true },
}

export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>
