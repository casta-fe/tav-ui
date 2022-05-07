import type { PropType } from 'vue'
import type { TimeLinePropsType } from './types'

export const TimeLineListProps = {
  list: {
    type: Array as PropType<TimeLinePropsType['list']>,
    default: () => [],
  },
  useLoadingMore: {
    type: Boolean as PropType<TimeLinePropsType['useLoadingMore']>,
    default: true,
  },
  renderListItem: {
    type: Function || null,
    default: null,
  },
}
