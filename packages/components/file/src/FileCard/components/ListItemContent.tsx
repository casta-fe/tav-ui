import { type ExtractPropTypes, type PropType, type VNode, defineComponent, ref } from 'vue'
import { isString } from '@tav-ui/utils'
import clickOutside from '@tav-ui/directives/src/clickOutside'
import { type FileActionUploadApiResponseRecord } from '../../typings'
import { type FileCardListItem } from '../types'

export const fileListItemContentProps = {
  editConfig: {
    type: Object,
  },
  row: {
    type: Object as PropType<FileActionUploadApiResponseRecord>,
    required: true,
  },
  render: {
    type: Object as PropType<FileCardListItem>,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
}

export type FileListItemContentProps = ExtractPropTypes<typeof fileListItemContentProps>

export default defineComponent({
  name: 'TaFileListItemContent',
  directives: {
    clickOutside,
  },
  props: fileListItemContentProps,
  setup(props) {
    const isEdit = ref(false)

    function createItemContentVNode(
      row: FileActionUploadApiResponseRecord,
      render: FileCardListItem
    ) {
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

    function createItemContentEditVNode(
      row: FileActionUploadApiResponseRecord,
      render: FileCardListItem
    ) {
      let vnode: VNode | VNode[] | string | null = null
      if (render.slots && render.slots.edit) {
        if (isString(render.slots.edit)) {
          vnode = render.slots.edit
        } else {
          vnode = render.slots.edit({ row })
        }
      } else {
        if (render.field) {
          vnode = (row as any)[render.field] ?? null
        }
      }
      return vnode
    }

    function handleItemContentClick() {
      const render = props.render!
      const editConfig = props.editConfig

      if (!render.editRender) return

      if (render.editRender && render.editRender.enabled) {
        if (editConfig?.trigger === 'click') {
          if (editConfig?.beforeEditMethod) {
            if (editConfig?.beforeEditMethod?.({ row: props.row! })) {
              isEdit.value = true
            } else {
              isEdit.value = false
            }
          }
          isEdit.value = true
        }
      }
    }

    function handleItemContentEditKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (isEdit.value) isEdit.value = false
      }
    }

    function handleClickOutside() {
      isEdit.value = false
    }

    return () => {
      return isEdit.value ? (
        <div
          class={`${props.className}-${props.render!.field}-wrapper`}
          v-click-outside={handleClickOutside}
        >
          <div
            class={`${props.className}-${props.render!.field} ${props.className}-${
              props.render!.field
            }--editting`}
            onKeydown={handleItemContentEditKeydown}
          >
            <>{createItemContentEditVNode(props.row!, props.render!)}</>
          </div>
        </div>
      ) : (
        <div class={`${props.className}-${props.render!.field}`} onClick={handleItemContentClick}>
          <>
            {props.render!.title ? <>{props.render!.title}: </> : null}
            {createItemContentVNode(props.row!, props.render!)}
          </>
        </div>
      )
    }
  },
})
