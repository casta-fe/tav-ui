import type { PropType } from 'vue'
import type { ListItemDefaultDataType } from '../types'
export const ListItemProps = {
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
