import { type ExtractPropTypes, type PropType, type VNode, defineComponent } from 'vue'
import { type FileActionUploadApiResponseRecord } from '../../typings'
import { type FileCardListItem } from '../types'
import ListItemContent from './ListItemContent'

export const fileListItemProps = {
  editConfig: {
    type: Object,
  },
  row: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    required: true,
  },
  renders: {
    type: Object as PropType<FileCardListItem[]>,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
}

export type FileListItemProps = ExtractPropTypes<typeof fileListItemProps>

export default defineComponent({
  name: 'TaFileListItem',
  props: fileListItemProps,
  setup(props) {
    function createItems() {
      const traverse = (
        renders: FileCardListItem[],
        row: FileActionUploadApiResponseRecord,
        items: VNode[] = []
      ) => {
        for (let i = 0; i < renders.length; i++) {
          const render = renders[i]

          if (render.children && render.children.length > 0) {
            items[i] = (
              <div class={`${props.className}-${render.field}`}>
                <>{render.title ? <>{render.title}: </> : null}</>
              </div>
            )
            items[i].children = traverse(render.children, row)
          } else {
            items[i] = (
              <ListItemContent
                editConfig={props.editConfig}
                row={row}
                render={render}
                className={props.className}
              />
            )
          }
        }

        return items
      }

      return traverse(props.renders!, props.row!)
    }

    return () => {
      return <li class={`${props.className} ant-list-item`}>{createItems()}</li>
    }
  },
})
