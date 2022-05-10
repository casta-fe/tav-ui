<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ '全屏' }}</span>
    </template>
    <FullscreenOutlined v-if="!isFullscreen" @click="toggle" />
    <FullscreenExitOutlined v-else @click="toggle" />
  </Tooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { useFullscreen } from '@vueuse/core';
import { useTableContext } from '../../hooks/useTableContext';

export default defineComponent({
  name: 'FullScreenSetting',
  components: {
    FullscreenExitOutlined,
    FullscreenOutlined,
    Tooltip,
  },

  setup() {
    const table = useTableContext();
    const { toggle, isFullscreen } = useFullscreen(table.wrapRef);

    return {
      toggle,
      isFullscreen,
    };
  },
});
</script>
