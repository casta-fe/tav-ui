<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" :get-popup-container="getTableContainer" />
    <SizeSetting v-if="getSetting.size" :get-popup-container="getTableContainer" />
    <!-- <ColumnSetting
      v-if="getSetting.setting"
      @columns-change="handleColumnChange"
      :getPopupContainer="getTableContainer"
    /> -->
    <FullScreenSetting v-if="getSetting.fullScreen" :get-popup-container="getTableContainer" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, unref } from 'vue'
import { useTableContext } from '../../hooks/useTableContext'
import SizeSetting from './SizeSetting.vue'
import RedoSetting from './RedoSetting.vue'
import FullScreenSetting from './FullScreenSetting.vue'
import type { PropType } from 'vue'
import type { ColumnChangeParam, TableSetting } from '../../types/table'
// import ColumnSetting from "./ColumnSetting.vue";

export default defineComponent({
  name: 'TableSetting',
  components: {
    // ColumnSetting,
    SizeSetting,
    RedoSetting,
    FullScreenSetting,
  },
  props: {
    setting: {
      type: Object as PropType<TableSetting>,
      default: () => ({}),
    },
  },
  emits: ['columns-change'],
  setup(props, { emit }) {
    const table = useTableContext()

    const getSetting = computed((): TableSetting => {
      return {
        redo: true,
        size: true,
        setting: true,
        fullScreen: false,
        ...props.setting,
      }
    })

    function handleColumnChange(data: ColumnChangeParam[]) {
      emit('columns-change', data)
    }

    function getTableContainer() {
      return table ? unref(table.wrapRef) : document.body
    }

    return { getSetting, handleColumnChange, getTableContainer }
  },
})
</script>
