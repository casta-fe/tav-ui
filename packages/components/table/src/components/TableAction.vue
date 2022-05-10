<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <ModalButton v-bind="action">
          <Icon v-if="action.icon" :icon="action.icon" :class="{ 'mr-1': !!action.label }" />
          <template v-if="action.label">{{ action.label }}</template>
        </ModalButton>
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
import { computed, defineComponent, toRaw, unref } from 'vue';
import { Button, Divider, Tooltip } from 'ant-design-vue';
import { MoreOutlined } from '@ant-design/icons-vue';
// import { usePermission } from "@tav-ui/hooks/web/usePermission";
import { isBoolean, isFunction, isString } from '@tav-ui/utils/is';
import { propTypes } from '@tav-ui/utils/propTypes';
import Dropdown from '../../../dropdown';
import Icon from '../../../icon';
import ModalButton from '../../../button-modal';
import { ACTION_COLUMN_FLAG, MAX_ACTION_NUMBER } from '../const';
import { useTableContext } from '../hooks/useTableContext';
import type { ActionItem } from '../types/tableAction';
import type { TableActionType } from '../types/table';
import type { PropType } from 'vue';
import type { TooltipProps } from 'ant-design-vue';

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
    const prefixCls = 'ta-basic-table-action';
    let table: Partial<TableActionType> = {};
    if (!props.outside) {
      table = useTableContext();
    }

    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow;

      let isIfShow = true;

      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    }

    let restActions: ActionItem[] = [];
    const Actions = computed(() => {
      let actions = toRaw(props.actions) || [];
      actions = actions.filter((action) => isIfShow(action));
      if (actions.length <= MAX_ACTION_NUMBER) {
        return actions;
      } else {
        const _actions = actions.slice(0, MAX_ACTION_NUMBER - 1);
        restActions = actions.slice(MAX_ACTION_NUMBER - 1);
        return _actions;
      }
    });
    const DropdownActions = computed(() => {
      // const actions = toRaw(props.dropDownActions) || []
      const actions = [...restActions, ...(toRaw(props.dropDownActions) || [])];
      return actions;
    });

    // const { hasPermission, getPermissions } = usePermission();
    // const Permissions = getPermissions();
    const getActions = computed(() => {
      return (
        Actions.value
          // .filter((action) => {
          //   return hasPermission(action.auth) && isIfShow(action);
          // })
          .filter((action) => {
            // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
            // return isNullOrUnDef(action.permission)
            //   ? isIfShow(action)
            //   : unref(Permissions)[action.permission]?.ifShow && isIfShow(action);
            return isIfShow(action);
          })
          .map((action) => {
            return {
              type: 'link',
              size: 'small',
              ...action,
            };
          })
      );
    });

    const getDropdownList = computed(() => {
      return (
        DropdownActions.value
          // .filter(action => hasPermission(action.auth) && isIfShow(action))
          .filter((action) => {
            // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
            return action.permission
              ? unref(Permissions)[action.permission]?.ifShow ?? isIfShow(action)
              : isIfShow(action);
          })
          .map((action, index, list) => {
            const { label } = action;
            // const { label, popConfirm } = action;
            return {
              type: 'link',
              size: 'small',
              ...action,
              // onConfirm: popConfirm?.confirm,
              // onCancel: popConfirm?.cancel,
              text: label,
              divider: index < list.length - 1 ? props.divider : false,
            };
          })
      );
    });

    const getAlign = computed(() => {
      const columns = (table as TableActionType)?.getColumns?.() || [];
      const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
      return actionColumn?.align ?? 'left';
    });

    function getTooltip(data: string | TooltipProps): TooltipProps {
      return {
        getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data),
      };
    }

    async function onCellClick(e: MouseEvent) {
      if (!props.stopButtonPropagation) return;
      const path = e.composedPath() as HTMLElement[];
      const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON';
      });
      isInButton && e.stopPropagation();
    }

    return {
      prefixCls,
      getActions,
      getDropdownList,
      getAlign,
      onCellClick,
      getTooltip,
      DropdownActions,
    };
  },
});
</script>