import type { ExtractPropTypes } from 'vue'

export interface ButtonItem {
  value: string | number;
  label: string;
  url?: string;
  number?: number | null | undefined;
  disabled?: boolean;
  permission?: string;
}

export const buttonModalProps = {
  isInDropDown: {
    type: Boolean,
    default: false,
  }
}

export declare type ButtonModalProps = Partial<ExtractPropTypes<typeof buttonModalProps>>
