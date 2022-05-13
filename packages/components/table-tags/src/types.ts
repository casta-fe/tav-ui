import type { ExtractPropTypes, PropType } from 'vue'

export const tableTagsProps = {
  tags: {
    type: [String, Array],
    default: () => [] as Tags,
  },
  maxNum: {
    type: Number,
    default: 3,
  },
  noShort: Boolean,
}

export type TableTagsProps = ExtractPropTypes<typeof tableTagsProps>
export interface TagItem {
  type: string
  text: string
}
export type Tags = TagItem[]
