import { defineComponent, reactive, ref, unref } from 'vue'
import Button from '@tav-ui/components/button'
import { isObject } from '@tav-ui/utils/is'
import { CamelCaseToCls, ComponentCustomActionName } from '../../const'
import { useTableContext } from '../../hooks/useTableContext'
import Settings from './settings'
import type { ComputedRef, PropType, Ref, Slots } from 'vue'
import type { TableProInstance } from '../../types'
import type { CustomActionSetting, TableProCustomActionConfig } from '../../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentCustomActionName)

const props = {
  config: {
    type: Object as PropType<TableProCustomActionConfig>,
  },
  tableRef: {
    type: Object as PropType<Ref<TableProInstance | null>>,
  },
  tableSlots: {
    type: Object as PropType<Slots>,
  },
}

export default defineComponent({
  name: ComponentCustomActionName,
  props,
  emits: ['triggerStatistical'],
  setup(props, { emit, expose }) {
    const settingsRef = ref<CustomActionSetting | null>(null)
    const actionRef = ref<ComputedRef | null>(null)
    const { tableEmitter } = useTableContext()

    const state = reactive({
      filter: {},
    })

    tableEmitter.on('table-pro:filter-form-submit', ({ filter = {} }) => {
      state.filter = filter
    })

    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

    // 统计按钮配置
    const handleStatistical = (e: Event) => {
      emit('triggerStatistical')
      if (isObject(props.config?.statistical) && props.config?.statistical.handleAction)
        props.config?.statistical.handleAction(e)
    }
    const statisticalButton = () =>
      props.config?.statistical ? (
        <Button
          class={`${ComponentPrefixCls}-btn statistical`}
          type="primary"
          preIcon={'ant-design:calculator-outlined'}
          onClick={handleStatistical}
          permission={getPermission(props.config?.statistical)}
        >
          统计
        </Button>
      ) : null

    // 新增按钮配置
    const handleAdd = (e: Event) => {
      if (isObject(props.config?.add) && props.config?.add.handleAction)
        props.config?.add.handleAction(e)
    }

    const addButton = () =>
      props.config?.add ? (
        <Button
          class={`${ComponentPrefixCls}-btn add`}
          type="primary"
          preIcon={'ant-design:plus-circle-outlined'}
          onClick={handleAdd}
          permission={getPermission(props.config?.add)}
        >
          新增
        </Button>
      ) : null

    // 删除按钮配置
    const handleDelete = (e: Event) => {
      if (isObject(props.config?.delete) && props.config?.delete.handleAction)
        props.config?.delete.handleAction(e)
    }

    const deleteButton = () =>
      props.config?.delete ? (
        <Button
          class={`${ComponentPrefixCls}-btn delete`}
          type="primary"
          preIcon={'ant-design:delete-outlined'}
          onClick={handleDelete}
          permission={getPermission(props.config?.delete)}
        >
          删除
        </Button>
      ) : null

    // 导入按钮配置
    const handleImport = (e: Event) => {
      if (isObject(props.config?.import) && props.config?.import.handleAction)
        props.config?.import.handleAction(e)
    }

    const importButton = () =>
      props.config?.import ? (
        <Button
          class={`${ComponentPrefixCls}-btn import`}
          type="primary"
          preIcon={'ant-design:import-outlined'}
          onClick={handleImport}
          permission={getPermission(props.config?.import)}
        >
          导入
        </Button>
      ) : null

    // 导出按钮配置
    const handleExport = (e: Event) => {
      if (isObject(props.config?.export) && props.config?.export.handleAction)
        props.config?.export.handleAction(e)
    }

    const exportButton = () =>
      props.config?.export ? (
        <Button
          class={`${ComponentPrefixCls}-btn export`}
          type="primary"
          preIcon={'ant-design:export-outlined'}
          onClick={handleExport}
          permission={getPermission(props.config?.export)}
        >
          导出
        </Button>
      ) : null

    // 刷新按钮配置
    const handleRefresh = (e: Event) => {
      if (isObject(props.config?.refresh) && props.config?.refresh.handleAction)
        props.config?.refresh.handleAction(e)
      // query 保留query状态刷新数据
      // reload 清空状态回到第一页
      unref(props.tableRef)?.commitProxy('query')
    }

    expose({
      addRef: null,
      deleteRef: null,
      importRef: null,
      exportRef: null,
      settingsRef,
      actionRef,
    })

    return () => {
      return props.config?.enabled ? (
        <div class={ComponentPrefixCls} ref={actionRef}>
          {statisticalButton()}
          {addButton()}
          {deleteButton()}
          {props.tableSlots?.customAction?.()}
          {importButton()}
          {exportButton()}
          <Settings
            ref={settingsRef}
            config={props.config}
            tableRef={props.tableRef}
            tableSlots={props.tableSlots}
          />
        </div>
      ) : null
    }
  },
})
