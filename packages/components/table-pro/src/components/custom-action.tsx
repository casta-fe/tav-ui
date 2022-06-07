import { defineComponent, reactive, unref } from 'vue'
import Button from '@tav-ui/components/button'
import { isObject } from '@tav-ui/utils/is'
import { CamelCaseToCls, ComponentCustomActionName } from '../const'
import { useTableContext } from '../hooks/useTableContext'
import type { PropType, Ref, Slots } from 'vue'
import type { TableProInstance } from '../types'
import type { TableProCustomActionConfig } from '../typings'

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
  setup(props) {
    const { tableEmitter } = useTableContext()

    const state = reactive({
      filter: {},
    })

    tableEmitter.on('table-pro:filter-form-submit', ({ filter = {} }) => {
      state.filter = filter
    })

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
        >
          新增
        </Button>
      ) : null

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
        >
          删除
        </Button>
      ) : null

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
        >
          导入
        </Button>
      ) : null

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
        >
          导出
        </Button>
      ) : null

    const handleRefresh = (e: Event) => {
      if (isObject(props.config?.refresh) && props.config?.refresh.handleAction)
        props.config?.refresh.handleAction(e)
      // query 保留query状态刷新数据
      // reload 清空状态回到第一页
      unref(props.tableRef)?.commitProxy('query')
    }

    const refreshButton = () =>
      props.config?.refresh ? (
        <Button
          class={`${ComponentPrefixCls}-btn refresh`}
          type="default"
          preIcon={'ant-design:redo-outlined'}
          onClick={handleRefresh}
        />
      ) : null

    return () => {
      return props.config?.enabled ? (
        <div class={ComponentPrefixCls}>
          {addButton()}
          {deleteButton()}
          {props.tableSlots?.customAction?.()}
          {importButton()}
          {exportButton()}
          {refreshButton()}
        </div>
      ) : null
    }
  },
})
