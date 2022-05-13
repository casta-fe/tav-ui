import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'
export interface Axis {
  x: number
  y: number
}
export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
export interface ContextMenuItem {
  label: string
  icon?: string
  disabled?: boolean
  handler?: Fn
  divider?: boolean
  children?: ContextMenuItem[]
}
export interface ContextMenuOptions {
  event: MouseEvent
  icon?: string
  styles?: any
  items?: ContextMenuItem[]
}
export interface ItemContentProps {
  showIcon: boolean | undefined
  item: ContextMenuItem
  handler: Fn
}

export const contextMenuProps = {
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
      return [
        {
          label: '',
        },
      ]
    },
  },
  event: {
    type: Object as PropType<MouseEvent>,
  },
}

export type ContextMenuProps = ExtractPropTypes<typeof contextMenuProps>
