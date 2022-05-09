<template>
  <div class="flex px-2 py-1.5 items-center basic-tree-header">
    <slot v-if="$slots.headerTitle" name="headerTitle" />
    <BasicTitle v-if="!$slots.headerTitle && title" :help-message="helpMessage">
      {{ title }}
    </BasicTitle>
    <div
      v-if="search || toolbar"
      class="flex flex-1 justify-self-stretch items-center cursor-pointer"
    >
      <div v-if="search" :class="getInputSearchCls">
        <InputSearch v-model:value="searchValue" placeholder="搜索" size="small" allow-clear />
      </div>
      <Dropdown v-if="toolbar" @click.prevent>
        <Icon icon="ion:ellipsis-vertical" />
        <template #overlay>
          <Menu @click="handleMenuClick">
            <template v-for="item in toolbarList" :key="item.value">
              <MenuItem v-bind="{ key: item.value }">
                {{ item.label }}
              </MenuItem>
              <MenuDivider v-if="item.divider" />
            </template>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { Dropdown, Input, Menu } from 'ant-design-vue';
import { propTypes } from '@tav-ui/utils/propTypes';
import { useDebounceFn } from '@vueuse/core';
import BasicTitle from '../../basic-title/src/basic-title.vue';

import Icon from '../../icon/src/icon.vue';
import type { PropType } from 'vue';

enum ToolbarEnum {
  SELECT_ALL,
  UN_SELECT_ALL,
  EXPAND_ALL,
  UN_EXPAND_ALL,
  CHECK_STRICTLY,
  CHECK_UN_STRICTLY,
}

interface MenuInfo {
  key: ToolbarEnum;
}
export default defineComponent({
  name: 'BasicTreeHeader',
  components: {
    BasicTitle,
    Icon,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
    MenuDivider: Menu.Divider,
    InputSearch: Input.Search,
  },
  props: {
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    title: propTypes.string,
    toolbar: propTypes.bool,
    checkable: propTypes.bool,
    search: propTypes.bool,
    checkAll: propTypes.func,
    expandAll: propTypes.func,
    searchText: propTypes.string,
    onStrictlyChange: propTypes.func,
  },
  emits: ['strictly-change', 'search'],
  setup(props, { emit, slots }) {
    const searchValue = ref('');

    const getInputSearchCls = computed(() => {
      const titleExists = slots.headerTitle || props.title;
      return [
        'mr-1',
        'w-full',
        // titleExists ? 'w-2/3' : 'w-full',
        {
          ['ml-5']: titleExists,
        },
      ];
    });

    const toolbarList = computed(() => {
      const { checkable } = props;
      const defaultToolbarList = [
        { label: '展开全部', value: ToolbarEnum.EXPAND_ALL },
        {
          label: '折叠全部',
          value: ToolbarEnum.UN_EXPAND_ALL,
          divider: checkable,
        },
      ];

      return checkable
        ? [
            { label: '选择全部', value: ToolbarEnum.SELECT_ALL },
            {
              label: '取消选择',
              value: ToolbarEnum.UN_SELECT_ALL,
              divider: checkable,
            },
            ...defaultToolbarList,
            { label: '层级关联', value: ToolbarEnum.CHECK_STRICTLY },
            { label: '层级独立', value: ToolbarEnum.CHECK_UN_STRICTLY },
          ]
        : defaultToolbarList;
    });

    function handleMenuClick(e: MenuInfo) {
      const { key } = e;
      switch (key) {
        case ToolbarEnum.SELECT_ALL:
          props.checkAll?.(true);
          break;
        case ToolbarEnum.UN_SELECT_ALL:
          props.checkAll?.(false);
          break;
        case ToolbarEnum.EXPAND_ALL:
          props.expandAll?.(true);
          break;
        case ToolbarEnum.UN_EXPAND_ALL:
          props.expandAll?.(false);
          break;
        case ToolbarEnum.CHECK_STRICTLY:
          emit('strictly-change', false);
          break;
        case ToolbarEnum.CHECK_UN_STRICTLY:
          emit('strictly-change', true);
          break;
      }
    }

    function emitChange(value?: string): void {
      emit('search', value);
    }
    const debounceEmitChange = useDebounceFn(emitChange, 200);

    watch(
      () => searchValue.value,
      (v) => {
        debounceEmitChange(v);
      }
    );
    watch(
      () => props.searchText,
      (v) => {
        if (v !== searchValue.value) {
          searchValue.value = v;
        }
      }
    );
    // function handleSearch(e: ChangeEvent): void {
    //   debounceEmitChange(e.target.value);
    // }

    return { toolbarList, handleMenuClick, searchValue, getInputSearchCls };
  },
});
</script>
