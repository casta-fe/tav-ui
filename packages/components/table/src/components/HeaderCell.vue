<template>
  <EditTableHeaderCell v-if="getIsEdit">
    {{ getTitle }}
  </EditTableHeaderCell>
  <span v-else>{{ getTitle }}</span>
  <BasicHelp v-if="getHelpMessage" :text="getHelpMessage" :class="`${prefixCls}__help`" />
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import BasicHelp from '../../../basic-help';
import EditTableHeaderCell from './EditTableHeaderIcon.vue';
import type { BasicColumn } from '../types/table';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'TableHeaderCell',
  components: {
    EditTableHeaderCell,
    BasicHelp,
  },
  props: {
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => undefined,
    },
  },
  setup(props) {
    const prefixCls = 'ta-basic-table-header-cell';

    const getIsEdit = computed(() => !!props.column?.edit);
    const getTitle = computed(() => props.column?.customTitle);
    const getHelpMessage = computed(() => props.column?.helpMessage);

    return { prefixCls, getIsEdit, getTitle, getHelpMessage };
  },
});
</script>
