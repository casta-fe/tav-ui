<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <a-button v-bind="action" type="link" size="small">
          <Icon v-if="action.icon" :icon="action.icon" :class="{ 'mr-1': !!action.label }" />
          <template v-if="action.label">{{ action.label }}</template>
        </a-button>
        <!-- <PopConfirmButton v-bind="action">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmButton> -->
      </Tooltip>
      <!-- <PopConfirmButton v-else v-bind="action">
        <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
        <template v-if="action.label">{{ action.label }}</template>
      </PopConfirmButton> -->
      <ModalButton v-else v-bind="action">
        <Icon v-if="action.icon" :icon="action.icon" :class="{ 'mr-1': !!action.label }" />
        <template v-if="action.label">{{ action.label }}</template>
      </ModalButton>
      <Divider
        v-if="divider && index < getActions.length - 1"
        type="vertical"
        class="action-divider"
      />
    </template>
    <Dropdown
      v-if="DropdownActions.length || (dropDownActions && getDropdownList.length > 0)"
      :trigger="['hover']"
      :drop-menu-list="getDropdownList"
      placement="bottomCenter"
      popconfirm
    >
      <slot name="more" />
      <a-button v-if="!$slots.more" type="link" size="small">
        <MoreOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, toRaw, unref } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { Button, Divider, Tooltip } from 'ant-design-vue'
import ModalButton from '@tav-ui/components/button-modal'
import Dropdown from '@tav-ui/components/dropdown'
import Icon from '@tav-ui/components/icon'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
// import { usePermission } from "@tav-ui/hooks/web/usePermission";
import { isBoolean, isFunction, isString } from '@tav-ui/utils/is'
import { propTypes } from '@tav-ui/utils/propTypes'
import { ACTION_COLUMN_FLAG, MAX_ACTION_NUMBER } from '../const'
import { useTableContext } from '../hooks/useTableContext'
import { limitActionLabel, useColumnActionAutoWidth } from '../hooks/useColumnAutoWidth'
import type { TooltipProps } from 'ant-design-vue'
import type { PropType, Ref } from 'vue'
import type { TableActionType } from '../types/table'
import type { ActionItem } from '../types/tableAction'

export default defineComponent({
  name: 'TableAction',
  components: {
    Icon,
    Divider,
    Dropdown,
    MoreOutlined,
    Tooltip,
    ModalButton,
    AButton: Button,
  },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    divider: propTypes.bool.def(true),
    outside: propTypes.bool,
    stopButtonPropagation: propTypes.bool.def(true),
  },
  setup(props) {
    const prefixCls = 'ta-basic-table-action'
    let table: any = {}
    if (!props.outside) {
      table = useTableContext()
    }

    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow

      let isIfShow = true

      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action)
      }
      return isIfShow
    }

    // permisson filter
    const Permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>
    const getPermissonFilterActions = computed(() => {
      return (toRaw(props.actions) || []).filter((action) => {
        // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
        return action.permission
          ? unref(Permissions)[action.permission]?.ifShow && isIfShow(action)
          : isIfShow(action)
      })
    })

    let restActions: ActionItem[] = []
    const Actions = computed(() => {
      // let actions = toRaw(props.actions) || []
      // actions = actions.filter((action) => isIfShow(action))
      const actions = getPermissonFilterActions.value
      if (actions.length <= MAX_ACTION_NUMBER) {
        restActions = []
        const handleActions = limitActionLabel(actions)

        const total = useColumnActionAutoWidth(unref(getPermissonFilterActions))
        table.setCacheActionWidths!(total)

        return handleActions
      } else {
        const _actions = actions.slice(0, MAX_ACTION_NUMBER - 1)
        restActions = actions.slice(MAX_ACTION_NUMBER - 1)
        const handleActions = limitActionLabel(_actions)

        const total = useColumnActionAutoWidth(unref(getPermissonFilterActions))
        table.setCacheActionWidths!(total)

        return handleActions
      }
    })
    const DropdownActions = computed(() => {
      // const actions = toRaw(props.dropDownActions) || []
      const actions = [...restActions, ...(toRaw(props.dropDownActions) || [])]
      return actions
    })

    // const Permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>
    const getActions = computed(() => {
      return (
        Actions.value
          // // .filter((action) => {
          // //   return hasPermission(action.auth) && isIfShow(action);
          // // })
          // .filter((action) => {
          //   // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
          //   return isNullOrUnDef(action.permission)
          //     ? isIfShow(action)
          //     : unref(Permissions)[action.permission]?.ifShow && isIfShow(action)
          // })
          .map((action) => {
            return {
              type: 'link',
              size: 'small',
              ...action,
            }
          })
      )
    })

    const getDropdownList = computed(() => {
      return (
        DropdownActions.value
          // // .filter(action => hasPermission(action.auth) && isIfShow(action))
          // .filter((action) => {
          //   // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
          //   return action.permission
          //     ? unref(Permissions)[action.permission]?.ifShow ?? isIfShow(action)
          //     : isIfShow(action)
          // })
          .map((action, index, list) => {
            const { label } = action
            // const { label, popConfirm } = action;
            return {
              type: 'link',
              size: 'small',
              ...action,
              // onConfirm: popConfirm?.confirm,
              // onCancel: popConfirm?.cancel,
              text: label,
              divider: index < list.length - 1 ? props.divider : false,
            }
          })
      )
    })

    const getAlign = computed(() => {
      const columns = (table as TableActionType)?.getColumns?.() || []
      const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG)
      return actionColumn?.align ?? 'left'
    })

    function getTooltip(data: string | TooltipProps): TooltipProps {
      return {
        getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
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

    return {
      prefixCls,
      getActions,
      getDropdownList,
      getAlign,
      onCellClick,
      getTooltip,
      DropdownActions,
    }
  },
})
</script>
