<template>
  <div class="ta-basic-table-custom-action">
    <Button
      v-if="visible?.isAddVisible"
      class="ml-4"
      type="primary"
      pre-icon="ant-design:plus-circle-outlined"
      @click="addOpenModal"
    >
      {{ tavI18n('Tav.common.addText') }}
    </Button>
    <Button
      v-if="visible?.isDeleteVisible"
      class="ml-4"
      type="primary"
      pre-icon="ant-design:delete-outlined"
      @click="delOpenModal"
    >
      {{ tavI18n('Tav.common.delText') }}
    </Button>
    <slot />
    <!-- <Button v-if="props.visible?.isImportVisible" class="ml-4" type="primary" preIcon="ant-design:import-outlined">导入</Button> -->
    <Button
      v-if="visible?.isExportVisible"
      class="ml-4"
      type="primary"
      pre-icon="ant-design:export-outlined"
      @click="exportOpenModal"
    >
      {{ tavI18n('Tav.common.exportText') }}
    </Button>
    <!-- <ExpExcelModal @register="expModalRegister" @success="exportHandler" /> -->
    <Button
      v-if="visible?.isRefreshVisible"
      class="ml-4 refresh-btn"
      pre-icon="ant-design:redo-outlined"
      @click="refreshHandler"
    />
  </div>
</template>

<script lang="ts">
// import { useMessage } from '@tav-ui/hooks/web/useMessage';
import { defineComponent, inject, reactive } from 'vue'
import { TaButton as Button } from '@tav-ui/components/button'
import { tavI18n } from '@tav-ui/locales'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { PropType } from 'vue'
// import componentSetting from '@tav-ui/settings/src/componentSetting';
// import { ExpExcelModal, ExportModalResult, jsonToSheetXlsx } from "@casta-fe-playground/components/Excel";
// import { useModal } from "@casta-fe-playground/components/Modal";
import type { TableActionType } from '../types/table'

export default defineComponent({
  name: 'TableCustomAction',
  components: { Button },
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
  setup(props) {
    const tableEmitter = inject('tableEmitter') as Emitter

    // const {
    //   table: {
    //     fetchSetting: { listField },
    //   },
    // } = componentSetting;

    // const { createConfirm } = useMessage();

    const state = reactive({
      filter: {},
    })

    tableEmitter.on('table:filter-submit', ({ filter = {} }) => {
      state.filter = filter
    })

    const addOpenModal = () => {
      props.handlers?.addHandle()
    }

    const delOpenModal = () => {
      props.handlers?.deleteHandle()
      // createConfirm({
      //   iconType: "warning",
      //   title: "确定删除吗？",
      //   content: "数据删除后不可恢复 🙅‍♂️",
      //   onOk() {
      //     console.log("delete");
      //   }
      // });
    }

    const exportOpenModal = () => {
      props.handlers?.exportHandle()
    }

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
      })
    }
    return {
      tavI18n,
      addOpenModal,
      delOpenModal,
      exportOpenModal,
      refreshHandler,
    }
  },
})
</script>
