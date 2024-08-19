import { type ExtractPropTypes, type PropType, type VNode, defineComponent } from 'vue'
import { isString } from '@tav-ui/utils'
import { type FileActionUploadApiResponseRecord } from '../../typings'
import { type FileCardListItem } from '../types'

export const fileListItemProps = {
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
  // emits: ["metaItemClick"],
  setup(props) {
    function createItemVNode(row: FileActionUploadApiResponseRecord, render: FileCardListItem) {
      let vnode: VNode | VNode[] | string | null = null

      if (render.slots && render.slots.default) {
        if (isString(render.slots.default)) {
          vnode = render.slots.default
        } else {
          vnode = render.slots.default({ row })
        }
      } else {
        if (render.field) {
          vnode = (row as any)[render.field] ?? null
        }
      }

      return vnode
    }

    function createItems() {
      const traverse = (
        renders: FileCardListItem[],
        row: FileActionUploadApiResponseRecord,
        items: VNode[] = []
      ) => {
        for (let i = 0; i < renders.length; i++) {
          const render = renders[i]

          items[i] = (
            <div class={`${props.className}-${render.field}`}>
              {render.title ? <>{render.title}: </> : null}
              {createItemVNode(row, render)}
            </div>
          )

          if (render.children && render.children.length > 0) {
            items[i].children = traverse(render.children, row)
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
