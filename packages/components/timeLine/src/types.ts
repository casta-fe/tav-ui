import type { PropType } from 'vue'
export interface TimeLinePropsType {
  list?: ListItemDefaultDataType[]
  useLoadingMore?: Boolean
}
export interface ListItemDefaultDataType {
  times?: string[]
  status?: 'success' | 'fail' | 'continue'
  title?: string
  tags?: TagPropsType[]
  description?: string[]
}
export interface TagPropsType {
  color?: string
  label?: string
  tooltip?: string
  [key: string]: any
}

export const timeLineListProps = {
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
export const timeLineListEmits = ['loadingMore']
export const tagProps = {
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
export const listItemProps = {
  itemData: {
    type: Object as PropType<ListItemDefaultDataType>,
    default: () => {
      return {
        status: '',
        times: [],
        title: '',
        tags: [],
        description: [],
      }
    },
  },
}
