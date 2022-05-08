import type { PropType } from 'vue'

import type { InputNumberProps } from 'ant-design-vue'
export interface InputNumberRangeProps {
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
    type: Array as PropType<InputNumberRangeProps['value']>,
    default: () => [],
  },
  disabled: {
    type: Boolean as PropType<InputNumberRangeProps['disabled']>,
    default: false,
  },
  minPlaceHolder: {
    type: String as PropType<InputNumberRangeProps['minPlaceHolder']>,
    default: '请输入数值',
  },
  maxPlaceHolder: {
    type: String as PropType<InputNumberRangeProps['maxPlaceHolder']>,
    default: '请输入数值',
  },
  size: {
    type: String as PropType<InputNumberRangeProps['size']>,
    default: 'default',
  },
  prefixCenter: {
    type: String as PropType<InputNumberRangeProps['prefixCenter']>,
    default: '~',
  },
  precision: {
    type: Number as PropType<InputNumberRangeProps['precision']>,
    default: 4,
  },
}

export const inputNumberRangeEmits = ['change', 'blur']

// export type InputNumberRangeProps = ExtractPropTypes<typeof inputNumberRangeProps>
