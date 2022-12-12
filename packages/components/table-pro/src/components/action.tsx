import { computed, defineComponent, ref, toRaw, unref } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { Button, Divider, Tooltip } from 'ant-design-vue'
import ModalButton from '@tav-ui/components/button-modal'
import Dropdown from '@tav-ui/components/dropdown'
import Icon from '@tav-ui/components/icon'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { isBoolean, isFunction, isString } from '@tav-ui/utils/is'
import {
  CamelCaseToCls,
  ComponentActionName,
  MAX_ACTION_NUMBER,
  buildTableActionId,
} from '../const'
import { useTableContext } from '../hooks/useTableContext'
import { useColumnActionAutoWidth } from '../hooks/useColumnAutoWidth'
import type { TooltipProps } from 'ant-design-vue'
import type { PropType, Ref } from 'vue'
import type { TableProActionItem } from '../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentActionName)

const props = {
  actions: {
    type: Array as PropType<TableProActionItem[]>,
    default: null,
  },
  dropDownActions: {
    type: Array as PropType<TableProActionItem[]>,
    default: null,
  },
  divider: {
    type: Boolean,
    default: true,
  },
  /** 是否在tablepro 外使用 */
  outside: {
    type: Boolean,
    default: false,
  },
  stopButtonPropagation: {
    type: Boolean,
    default: true,
  },
}

/**
 * @description 如果内容长度大于3，则修改为 xx.. 基于字体是12px的基础之下长度为32px。
 * @param actions
 * @param labelMaxLength
 * @returns
 */
export function limitActionLabel(actions: TableProActionItem[], labelMaxLength = 3) {
  return actions.map((action) => {
    const { label } = action
    if (label && label.length > labelMaxLength) {
      action.tooltip = label
      action.label = `${label.substring(0, 2)}..`
    }
    return action
  })
}

export default defineComponent({
  name: ComponentActionName,
  props,
  setup(props, { slots }) {
    let { tableRef, setCacheActionWidths } = useTableContext()
    if (!props.outside) tableRef = ref(null)
    const actionEl = ref(null)
    const id = buildTableActionId()

    // 获取全局注入的 permissions
    const Permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>

    // 根据 enabled 控制显隐
    function isEnabled(action: TableProActionItem): boolean {
      const enabled = action.enabled
      let isEnabled = true
      if (isBoolean(enabled)) {
        isEnabled = enabled
      }
      if (isFunction(enabled)) {
        isEnabled = enabled(action)
      }
      return isEnabled
    }

    // 根据 permissions 控制显隐
    function handlePermissions(Permissions) {
      return computed(() => {
        return (toRaw(props.actions) || []).filter((action) => {
          // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
          return action.permission
            ? unref(Permissions)[action.permission]?.ifShow && isEnabled(action)
            : isEnabled(action)
        })
      })
    }

    // 根据 MAX_ACTION_NUMBER 控制 action 列显示数，多余的改为省略号
    let restActions: TableProActionItem[] = []

    function getActions() {
      const permissonFilterActions = handlePermissions(Permissions)

      const Actions = computed(() => {
        const actions = unref(permissonFilterActions)
        if (actions.length <= MAX_ACTION_NUMBER) {
          restActions = []
          const handleActions = limitActionLabel(actions)

          const total = useColumnActionAutoWidth(unref(permissonFilterActions))
          setCacheActionWidths({ key: id, value: total })

          return handleActions
        } else {
          const _actions = actions.slice(0, MAX_ACTION_NUMBER - 1)
          restActions = actions.slice(MAX_ACTION_NUMBER - 1)
          const handleActions = limitActionLabel(_actions)

          const total = useColumnActionAutoWidth(unref(permissonFilterActions))
          setCacheActionWidths({ key: id, value: total })

          return handleActions
        }
      })

      return computed(() =>
        unref(Actions).map((action) => ({
          // type: 'link',
          // size: 'small',
          ...action,
        }))
      )
    }

    function createActions() {
      const Actions = getActions()

      if (unref(Actions).length) {
        return unref(Actions).map((action, index) => {
          const modalButton = () => (
            <ModalButton {...action} type="link" size="small">
              {{
                default: () => (
                  <>
                    {action.icon ? <Icon icon={action.icon} /> : null}
                    {action.label}
                  </>
                ),
              }}
            </ModalButton>
          )
          return (
            <>
              {action.tooltip ? (
                <Tooltip {...getTooltip(action.tooltip)}>
                  {/* {modalButton(action.tooltip as string)} */}
                  <Button {...action} type="link" size="small">
                    {action.icon ? <Icon icon={action.icon} /> : null}
                    {action.label}
                  </Button>
                </Tooltip>
              ) : (
                modalButton()
              )}
              {props.divider && index < unref(Actions).length - 1 ? (
                <Divider class={`${ComponentPrefixCls}-divider`} type={'vertical'}></Divider>
              ) : null}
            </>
          )
        })
      } else {
        return null
      }
    }

    function getDropdownList() {
      const DropdownActions = computed(() => [
        ...restActions,
        ...(toRaw(props.dropDownActions) || []),
      ])

      return computed(() =>
        unref(DropdownActions).map((action, index, list) => ({
          // type: 'link',
          // size: 'small',
          ...action,
          text: action.label,
          divider: index < list.length - 1 ? props.divider : false,
        }))
      )
    }

    function createDropdownList() {
      const DropdownList = getDropdownList()

      if (unref(DropdownList).length || props.dropDownActions?.length) {
        return (
          <Dropdown
            trigger={['hover']}
            dropMenuList={unref(DropdownList)}
            placement="bottomLeft"
            popconfirm
          >
            {{
              default: () =>
                !slots.more ? (
                  <Button type="link" size="small">
                    <MoreOutlined class="icon-more" />
                  </Button>
                ) : (
                  slots.more?.()
                ),
            }}
          </Dropdown>
        )
      } else {
        return null
      }
    }

    function getTooltip(data: string | TooltipProps): TooltipProps {
      return {
        getPopupContainer: () => unref(actionEl) || (unref(tableRef) as any)?.$el || document.body,
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data),
      }
    }

    async function onCellClick(e: MouseEvent) {
      if (!props.stopButtonPropagation) return
      const path = e.composedPath() as HTMLElement[]
      const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON'
      })
      isInButton && e.stopPropagation()
    }

    return () => {
      return (
        <div ref={actionEl} id={id} class={ComponentPrefixCls} onClick={onCellClick}>
          {createActions()}
          {createDropdownList()}
        </div>
      )
    }
  },
})
