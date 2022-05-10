<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ '密度' }}</span>
    </template>

    <Dropdown
      placement="bottomCenter"
      :trigger="['click']"
      :get-popup-container="getPopupContainer"
    >
      <ColumnHeightOutlined />
      <template #overlay>
        <Menu v-model:selectedKeys="selectedKeysRef" selectable @click="handleTitleClick">
          <MenuItem key="default">
            <span>{{ '默认' }}</span>
          </MenuItem>
          <MenuItem key="middle">
            <span>{{ '中等' }}</span>
          </MenuItem>
          <MenuItem key="small">
            <span>{{ '紧凑' }}</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </Tooltip>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Dropdown, Menu, Tooltip } from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { getPopupContainer } from '@tav-ui/utils/basic';
import { useTableContext } from '../../hooks/useTableContext';
import type { SizeType } from '../../types/table';

export default defineComponent({
  name: 'SizeSetting',
  components: {
    ColumnHeightOutlined,
    Tooltip,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
  },
  setup() {
    const table = useTableContext();

    const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

    function handleTitleClick({ key }: { key: SizeType }) {
      selectedKeysRef.value = [key];
      table.setProps({
        size: key,
      });
    }

    return {
      handleTitleClick,
      selectedKeysRef,
      getPopupContainer,
    };
  },
});
</script>
