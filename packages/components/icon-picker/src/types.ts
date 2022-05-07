import { propTypes } from '@tav-ui/utils/propTypes'
import type { ExtractPropTypes } from 'vue'

export const iconPickerProps = {
  value: propTypes.string,
  width: propTypes.string.def('100%'),
  pageSize: propTypes.number.def(140),
  copy: propTypes.bool.def(false),
  mode: propTypes.oneOf<('svg' | 'iconify')[]>(['svg', 'iconify']).def('iconify'),
}

export interface ChangeEvent extends Event {
  target: HTMLInputElement
}

export type IconPickerProps = ExtractPropTypes<typeof iconPickerProps>
