<template>
  <div class="ta-basic-table-custom-action">
    <Button
      v-if="visible?.isAddVisible"
      class="mr-4"
      type="primary"
      pre-icon="ant-design:plus-circle-outlined"
      @click="addOpenModal"
    >
      新增
    </Button>
    <Button
      v-if="visible?.isDeleteVisible"
      class="mr-4"
      type="primary"
      pre-icon="ant-design:delete-outlined"
      @click="delOpenModal"
    >
      删除
    </Button>
    <slot />
    <!-- <Button v-if="props.visible?.isImportVisible" class="mr-4" type="primary" preIcon="ant-design:import-outlined">导入</Button> -->
    <Button
      v-if="visible?.isExportVisible"
      class="mr-4"
      type="primary"
      pre-icon="ant-design:export-outlined"
      @click="exportOpenModal"
    >
      导出
    </Button>
    <!-- <ExpExcelModal @register="expModalRegister" @success="exportHandler" /> -->
    <Button
      v-if="visible?.isRefreshVisible"
      class="mr-4 refresh-btn"
      pre-icon="ant-design:redo-outlined"
      @click="refreshHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useMessage } from '../../../useMessage';
import { inject, reactive } from 'vue';
import Button from '../../../button';
import type { Emitter } from '@tav-ui/utils/mitt';
import type { PropType } from 'vue';
// import componentSetting from '@tav-ui/settings/src/componentSetting';
// import { ExpExcelModal, ExportModalResult, jsonToSheetXlsx } from "@casta-fe-playground/components/Excel";
// import { useModal } from "@casta-fe-playground/components/Modal";
import type { TableActionType } from '../types/table';
export default defineComponent({
  components: {
    Button,
  },
  props: {
    visible: {
      type: Object as PropType<Record<string, any>>,
      default: () => undefined,
    },
    handlers: {
      type: Object as PropType<Record<string, any>>,
      default: () => undefined,
    },
    tableAction: {
      type: Object as PropType<TableActionType>,
      default: () => undefined,
    },
  },
  name: 'TaBasicTableCustomAction',
  emits: ['tableEmitter'],
  setup(props, { emit }) {
    // const {
    //   table: {
    //     fetchSetting: { listField },
    //   },
    // } = componentSetting;

    // const { createConfirm } = useMessage();
    const tableEmitter = inject('tableEmitter') as Emitter;
    const state = reactive({
      filter: {},
    });

    tableEmitter.on('table:filter-submit', ({ filter = {} }) => {
      state.filter = filter;
    });

    const addOpenModal = () => {
      props.handlers?.addHandle();
    };

    const delOpenModal = () => {
      props.handlers?.deleteHandle();
      // createConfirm({
      //   iconType: "warning",
      //   title: "确定删除吗？",
      //   content: "数据删除后不可恢复 🙅‍♂️",
      //   onOk() {
      //     console.log("delete");
      //   }
      // });
    };

    const exportOpenModal = () => {
      props.handlers?.exportHandle();
    };

    // const tableData = computed(() => {
    //   return props.tableAction?.getRawDataSource
    //     ? props.tableAction?.getRawDataSource()[listField]
    //     : [];
    // });
    // const exportHandler = ({ filename, bookType }: ExportModalResult) => {
    //   // 默认Object.keys(data[0])作为header
    //   jsonToSheetXlsx({
    //     data: tableData.value,
    //     filename,
    //     write2excelOpts: {
    //       bookType
    //     }
    //   });
    // };
    // const [expModalRegister, { openModal: expOpenModal }] = useModal();

    const refreshHandler = () => {
      props.tableAction?.reload({
        searchInfo: {
          filter: state.filter,
        },
      });
    };
    return {
      addOpenModal,
      refreshHandler,
      exportOpenModal,
      delOpenModal,
    };
  },
});
</script>
