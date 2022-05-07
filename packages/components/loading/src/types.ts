import type { ExtractPropTypes } from 'vue'

export enum SizeEnum {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large',
}
export const loadingProps = {
  tip: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: SizeEnum.LARGE,
    validator: (v: SizeEnum): boolean => {
      return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v)
    },
  },
  absolute: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
  },
  theme: {
    type: String,
  },
}
export type LoadingProps = ExtractPropTypes<typeof loadingProps>

export interface LoadingCreateProps {
  tip: string
  size: SizeEnum
  absolute: boolean
  loading: boolean
  background: string
  theme: 'dark' | 'light'
}
