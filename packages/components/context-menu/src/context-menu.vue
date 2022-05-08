<script lang="tsx">
import type { CSSProperties, FunctionalComponent, PropType } from 'vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, unref } from 'vue'
import { Divider, Menu } from 'ant-design-vue'
import Icon from '../../icon/src/icon.vue'
import type { Axis, ContextMenuItem, ItemContentProps } from './types'
const prefixCls = 'context-menu'
const contextMenuProps = {
  width: { type: Number, default: 156 },
  customEvent: { type: Object as PropType<Event>, default: null },
  styles: { type: Object as PropType<CSSProperties> },
  showIcon: { type: Boolean, default: true },
  axis: {
    // The position of the right mouse button click
    type: Object as PropType<Axis>,
    default() {
      return { x: 0, y: 0 }
    },
  },
  items: {
    // The most important list, if not, will not be displayed
    type: Array as PropType<ContextMenuItem[]>,
    default() {
      return [{
        label: '',
      }]
    },
  },
}

const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
  const { item } = props
  return (
      <span
        style="display: inline-block; width: 100%; "
        class="px-4"
        onClick={props.handler.bind(null, item)}
      >
        {props.showIcon && item.icon && <Icon class="mr-2" icon={item.icon} />}
        <span>{item.label}</span>
      </span>
  )
}

export default defineComponent({
  name: 'TaContextMenu',
  props: contextMenuProps,
  setup(props) {
    const wrapRef = ref(null)
    const showRef = ref(false)

    const getStyle = computed((): CSSProperties => {
      const { axis, items, styles, width } = props
      const { x, y } = axis || { x: 0, y: 0 }
      const menuHeight = (items || []).length * 40
      const menuWidth = width
      const body = document.body

      const left = body.clientWidth < x + menuWidth ? x - menuWidth : x
      const top = body.clientHeight < y + menuHeight ? y - menuHeight : y
      return {
        ...(styles as object),
        width: `${width}px`,
        left: `${left + 1}px`,
        top: `${top + 1}px`,
      }
    })

    onMounted(() => {
      nextTick(() => (showRef.value = true))
    })

    onUnmounted(() => {
      const el = unref(wrapRef)
      el && document.body.removeChild(el)
    })

    function handleAction(item: ContextMenuItem, e: MouseEvent) {
      const { handler, disabled } = item
      if (disabled)
        return

      showRef.value = false
      e?.stopPropagation()
      e?.preventDefault()
      handler?.()
    }

    function renderMenuItem(items: ContextMenuItem[]) {
      return items.map((item) => {
        const { disabled, label, children, divider = false } = item

        const contentProps = {
          item,
          handler: handleAction,
          showIcon: props.showIcon,
        }

        if (!children || children.length === 0) {
          return (
              <>
                <Menu.Item disabled={disabled} class={`${prefixCls}__item`} key={label}>
                  <ItemContent {...contentProps} />
                </Menu.Item>
                {divider ? <Divider key={`d-${label}`} /> : null}
              </>
          )
        }
        if (!unref(showRef))
          return null

        return (
            <Menu.SubMenu key={label} disabled={disabled} popupClassName={`${prefixCls}__popup`}>
              {{
                title: () => <ItemContent {...contentProps} />,
                default: () => renderMenuItem(children),
              }}
            </Menu.SubMenu>
        )
      })
    }
    return () => {
      if (!unref(showRef))
        return null

      const { items } = props
      return (
          <Menu
            inlineIndent={12}
            mode="vertical"
            class={prefixCls}
            ref={wrapRef}
            style={unref(getStyle)}
          >
            {renderMenuItem(items)}
          </Menu>
      )
    }
  },
})
</script>
