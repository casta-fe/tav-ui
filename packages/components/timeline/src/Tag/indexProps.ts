import type { PropType } from 'vue'
import type { TagPropsType } from '../types'
export const TagProps = {
  label: {
    type: String as PropType<TagPropsType['label']>,
    default: '',
  },
  tooltip: {
    type: String as PropType<TagPropsType['tooltip']>,
    default: '',
  },
  color: {
    type: String as PropType<TagPropsType['color']>,
    default: '',
  },
}
