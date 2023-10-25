import { computed, defineComponent, ref, unref } from 'vue'
import { Tooltip } from 'ant-design-vue'
import Button from '@tav-ui/components/button'
import { isObject } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import {
  CamelCaseToCls,
  ComponentCustomActionName as _ComponentCustomActionName,
} from '../../../const'
import { useTableContext } from '../../../hooks/useTableContext'
import ColumnSetting from './column'
import type { PropType, Ref, Slots } from 'vue'
import type { TableProInstance } from '../../../types'
import type { CustomActionSettingColumn, TableProCustomActionConfig } from '../../../typings'

const ComponentCustomActionName = `${_ComponentCustomActionName}Settings`
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
  setup(props, { expose }) {
    const { tablePropsRef } = useTableContext()
    const columnRef = ref<CustomActionSettingColumn | null>(null)
    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

    // 刷新按钮配置
    const handleRefresh = (e: Event) => {
      if (isObject(props.config?.refresh) && props.config?.refresh.handleAction)
        props.config?.refresh.handleAction(e)
      // query 保留query状态刷新数据
      // reload 清空状态回到第一页
      unref(props.tableRef)?.commitProxy('query')
    }

    const hasTreeConfig = computed(() => {
      const treeConfig = unref(tablePropsRef).treeConfig

      if (!JSON.stringify(treeConfig)) {
        return false
      } else {
        return true
      }
    })

    const refreshButton = () =>
      props.config?.refresh ? (
        <Tooltip placement="bottom" title={tavI18n('Tav.common.redo')}>
          <Button
            class={`${ComponentPrefixCls}-btn refresh`}
            type="text"
            preIcon={'ant-design:redo-outlined'}
            iconSize={20}
            onClick={handleRefresh}
            permission={getPermission(props.config?.refresh)}
          />
        </Tooltip>
      ) : null

    expose({
      refreshRef: null,
      columnRef,
    })

    return () => {
      const isSettingsShow = props.config?.refresh || props.config?.column
      return isSettingsShow ? (
        <div class={ComponentPrefixCls}>
          {refreshButton()}
          {!unref(hasTreeConfig) ? (
            <ColumnSetting
              ref={columnRef}
              config={props.config}
              tableRef={props.tableRef}
              tableSlots={props.tableSlots}
            />
          ) : null}
        </div>
      ) : null
    }
  },
})
