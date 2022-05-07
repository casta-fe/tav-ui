import type { ExtractPropTypes, PropType } from 'vue'

export interface ButtonItem {
  value: string | number;
  label: string;
  url?: string;
  number?: number | null | undefined;
  disabled?: boolean;
  permission?: string;
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
    type: Array as PropType<ButtonItem[]>,
    default: () => [] as ButtonItem[],
  },
}

export declare type ButtonGroupProps = ExtractPropTypes<typeof buttonGroupProps>
