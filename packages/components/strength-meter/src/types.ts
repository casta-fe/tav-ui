import { propTypes } from '@tav-ui/utils/propTypes'
import type { ExtractPropTypes } from 'vue'

export const strengthMeterProps = {
  value: propTypes.string,
  showInput: propTypes.bool.def(true),
  disabled: propTypes.bool,
}

export type StrengthMeterProps = ExtractPropTypes<typeof strengthMeterProps>
