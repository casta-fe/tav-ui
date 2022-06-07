import { propTypes } from '@tav-ui/utils/propTypes'
import type { ExtractPropTypes, PropType } from 'vue'

const tuple = <T extends string[]>(...args: T) => args
export interface DropdownMenu {
  onClick?: (...arg: any[]) => any
  to?: string
  icon?: string
  event?: string | number
  text?: string
  disabled?: boolean
  divider?: boolean
  [key: string]: any
}

export const dropdownProps = {
  // antdv dropwdown props
  // trigger: {
  //   type: [Array, String] as PropType<
  //     ('click' | 'hover' | 'contextmenu')[] | 'click' | 'hover' | 'contextmenu'
  //   >,
  //   default: 'hover',
  // },
  overlay: propTypes.any,
  visible: propTypes.looseBool,
  disabled: propTypes.looseBool,
  align: propTypes.object,
  getPopupContainer: propTypes.func,
  prefixCls: propTypes.string,
  transitionName: propTypes.string,
  placement: propTypes.oneOf(
    tuple('topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight')
  ),
  overlayClassName: propTypes.string,
  overlayStyle: propTypes.style,
  forceRender: propTypes.looseBool,
  mouseEnterDelay: propTypes.number,
  mouseLeaveDelay: propTypes.number,
  openClassName: propTypes.string,
  minOverlayWidthMatchTrigger: propTypes.looseBool,

  // extend
  popconfirm: Boolean,
  /**
   * the trigger mode which executes the drop-down action
   * @default ['hover']
   * @type string[]
   */
  trigger: {
    type: [Array, String] as PropType<
      ('click' | 'hover' | 'contextmenu')[] | 'click' | 'hover' | 'contextmenu'
    >,
    default: () => {
      return ['contextmenu']
    },
  },
  dropMenuList: {
    type: Array as PropType<DropdownMenu[]>,
    default: () => [],
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
}

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>
