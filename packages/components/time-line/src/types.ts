import type { ExtractPropTypes, PropType } from 'vue'
export interface TimeLinePropsType {
  list?: ListItemDefaultDataType[]
  useLoadingMore?: boolean
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

export const timeLineProps = {
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
export type TimeLineProps = ExtractPropTypes<typeof timeLineProps>
export const timeLineListEmits = ['loadingMore']
export const timeLineTagProps = {
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
export type TimeLineTagProps = ExtractPropTypes<typeof timeLineTagProps>
export const timeLineItemProps = {
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
export type TimeLineItemProps = ExtractPropTypes<typeof timeLineItemProps>
