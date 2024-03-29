import type { ExtractPropTypes, PropType } from 'vue'

export interface ButtonGroupItem {
  value: string | number
  label: string
  url?: string
  number?: number | null | undefined
  badge?: true | number | null | undefined
  disabled?: boolean
  permission?: string
  loading?: boolean
}

export const buttonGroupProps = {
  active: {
    type: [Number, String],
    required: true,
  },
  islink: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Array as PropType<ButtonGroupItem[]>,
    default: () => [] as ButtonGroupItem[],
  },
}

export declare type ButtonGroupProps = ExtractPropTypes<typeof buttonGroupProps>
