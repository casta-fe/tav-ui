import { propTypes } from '@tav-ui/utils/propTypes'
import type { ExtractPropTypes } from 'vue'

export const timeProps = {
  value: propTypes.oneOfType([propTypes.number, propTypes.instanceOf(Date), propTypes.string])
    .isRequired,
  step: propTypes.number.def(60),
  mode: propTypes.oneOf(['date', 'datetime', 'relative']).def('relative'),
}

export type TimeProps = ExtractPropTypes<typeof timeProps>
