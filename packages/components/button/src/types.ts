import type { ExtractPropTypes, PropType } from 'vue'

export const buttonProps = {
  color: { type: String, validator: (v) => ['error', 'warning', 'success', ''].includes(v) },
  loading: { type: Boolean },
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
