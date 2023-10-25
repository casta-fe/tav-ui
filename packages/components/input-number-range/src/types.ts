import { tavI18n } from '@tav-ui/locales'
import type { ExtractPropTypes, PropType } from 'vue'
import type { InputNumberProps } from 'ant-design-vue'
export interface IInputNumberRangeProps {
  value: Array<number>
  disabled?: InputNumberProps['disabled']
  minPlaceHolder?: InputNumberProps['placeholder']
  maxPlaceHolder?: InputNumberProps['placeholder']
  size?: 'small' | 'large' | 'default' | undefined
  prefixCenter?: string | number | undefined
  precision?: InputNumberProps['precision']
}
export const inputNumberRangeProps = {
  value: {
    type: Array as PropType<IInputNumberRangeProps['value']>,
    default: () => [],
  },
  disabled: {
    type: Boolean as PropType<IInputNumberRangeProps['disabled']>,
    default: false,
  },
  minPlaceHolder: {
    type: String as PropType<IInputNumberRangeProps['minPlaceHolder']>,
    default: tavI18n('Tav.form.inputRange.3'),
  },
  maxPlaceHolder: {
    type: String as PropType<IInputNumberRangeProps['maxPlaceHolder']>,
    default: tavI18n('Tav.form.inputRange.3'),
  },
  size: {
    type: String as PropType<IInputNumberRangeProps['size']>,
    default: 'default',
  },
  prefixCenter: {
    type: String as PropType<IInputNumberRangeProps['prefixCenter']>,
    default: '~',
  },
  precision: {
    type: Number as PropType<IInputNumberRangeProps['precision']>,
    default: 4,
  },
}

export const inputNumberRangeEmits = ['change', 'blur']

export type InputNumberRangeProps = ExtractPropTypes<typeof inputNumberRangeProps>
