import { type PropType, type Ref, computed, defineComponent, toRaw, unref } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { Button, Divider } from 'ant-design-vue'
import ModalButton from '@tav-ui/components/button-modal'
import Dropdown from '@tav-ui/components/dropdown'
import Icon from '@tav-ui/components/icon'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { isBoolean, isFunction, isUnDef } from '@tav-ui/utils/is'
import { MAX_ACTION_NUMBER } from '@tav-ui/components/table-pro/src/const'
import { ns } from '../../consts'
import { createId } from '../../utils'
import { type FileCardListItemAction } from '../types'

const props = {
  actions: {
    type: Array as PropType<FileCardListItemAction[]>,
    default: null,
  },
  dropDownActions: {
    type: Array as PropType<FileCardListItemAction[]>,
    default: null,
  },
  divider: {
    type: Boolean,
    default: true,
  },
  limit: { type: Number },
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
export function limitActionLabel(actions: FileCardListItemAction[], labelMaxLength: number) {
  return actions.map((action) => {
    const max = action.limit || labelMaxLength
    const { label, blankLabel } = action
    // 备份下，防止修改了label后 重新渲染时候将tooltips显示不全的问题
    if (!blankLabel) {
      action.blankLabel = label
    }
    if (label && label.length > max) {
      action.tooltip = blankLabel || label
      action.label = `${label.substring(0, max - 1)}..`
    }
    return action
  })
}

export default defineComponent({
  name: 'TaFileListItemAction',
  props,
  setup(props, { slots }) {
    const DEFAULT_FILELISTITEMACTION_CLASSNAME = ns.b('card-list-item-action')
    const DEFAULT_FILELISTITEMACTION_ID = createId(DEFAULT_FILELISTITEMACTION_CLASSNAME)

    // 获取全局注入的 permissions
    const Permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>
    const ActionLabelLimit =
      unref(useGlobalConfig('components'))?.TaTablePro?.actionLabelLimit || MAX_ACTION_NUMBER

    // 根据 enabled 控制显隐
    function isEnabled(action: FileCardListItemAction): boolean {
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

    // 根据 ifShow 控制显隐
    function isIfShow(action: FileCardListItemAction): boolean {
      const enabled = action.ifShow
      let isEnabled = true
      if (isBoolean(enabled)) {
        isEnabled = enabled
      }
      return isEnabled
    }

    // 根据 permissions 控制显隐
    function handlePermissions(Permissions: any) {
      return computed(() => {
        return (toRaw(props.actions) || []).filter((action) => {
          // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
          const PermissionFlag = isUnDef(action.permission)
            ? true
            : unref(Permissions)[action.permission || '']?.ifShow
          const PermisionCodeFlag = isUnDef(action.permissionCode)
            ? true
            : action.permissionCode === 1
          return PermissionFlag && PermisionCodeFlag && isEnabled(action) && isIfShow(action)
        })
      })
    }

    // 根据 MAX_ACTION_NUMBER 控制 action 列显示数，多余的改为省略号
    let restActions: FileCardListItemAction[] = []

    function getActions() {
      const permissonFilterActions = handlePermissions(Permissions)

      const Actions = computed(() => {
        const actions = unref(permissonFilterActions)
        if (actions.length <= ActionLabelLimit) {
          restActions = []
          return actions
        } else {
          const _actions = actions.slice(0, ActionLabelLimit - 1)
          restActions = actions.slice(ActionLabelLimit - 1)
          return _actions
        }
      })

      return computed(() =>
        unref(Actions).map((action) => ({
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
              {modalButton()}
              {props.divider && index < unref(Actions).length - 1 ? (
                <Divider
                  class={`${DEFAULT_FILELISTITEMACTION_CLASSNAME}-divider`}
                  type={'vertical'}
                />
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
          ...action,
          text: action.blankLabel || action.label,
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

    async function handleActionClick(e: MouseEvent) {
      if (!props.stopButtonPropagation) return
      const path = e.composedPath() as HTMLElement[]
      const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON'
      })
      isInButton && e.stopPropagation()
    }

    return () => {
      return (
        <div
          id={DEFAULT_FILELISTITEMACTION_ID}
          class={DEFAULT_FILELISTITEMACTION_CLASSNAME}
          onClick={handleActionClick}
        >
          {createActions()}
          {createDropdownList()}
        </div>
      )
    }
  },
})
