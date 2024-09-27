import { defineComponent, reactive } from 'vue'
import {
  Badge,
  // Checkbox,
  Empty,
  Popover,
  Tooltip,
  // List,
  // ListItem,
  // CheckboxGroup,
} from 'ant-design-vue'
import TaButton from '@tav-ui/components/button'
import TaScrollbar from '@tav-ui/components/scrollbar'
import { isObject } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import {
  CamelCaseToCls,
  ComponentCustomActionName as _ComponentCustomActionName,
} from '../../../const'
import { useTableContext } from '../../../hooks/useTableContext'
import type { PropType, Ref, Slots } from 'vue'
import type { TableProInstance } from '../../../types'
import type { TableProCustomActionConfig } from '../../../typings'

const ComponentCustomActionName = `${_ComponentCustomActionName}SettingsCheckboxCache`
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
  getPopupContainer: {
    type: Function as PropType<(...args: any[]) => any>,
    default: () => document.body,
  },
}

export default defineComponent({
  name: ComponentCustomActionName,
  props,
  setup(props) {
    const state = reactive<{
      loading: boolean
      items: Record<string, any>[]
      selectValues: Record<string, any>[]
    }>({
      loading: false,
      /** 列表数据 */
      items: [],
      selectValues: [],
    })

    const getPermission = (data: any) => (isObject(data) ? data?.permission : undefined)
    const {
      checkboxCaches,
      isCheckboxCacheEnabled,
      checkboxCacheList: items,
      deleteCheckboxCache,
      deleteAllCheckboxCache,
    } = useTableContext()

    // const indeterminate = computed(
    //   () => !!state.selectValues.length && state.selectValues.length < unref(items).length
    // )
    // const allChecked = computed(
    //   () => !!state.selectValues.length && state.selectValues.length === unref(items).length
    // )
    // const checked = computed(
    //   () => (item: any) => !!state.selectValues.find((selectValue) => selectValue.id === item.id)
    // )

    // function handleCheckboxCacheCheckAllChange(e: any) {
    //   state.selectValues = e.target.checked ? [...unref(items)] : []
    // }

    async function handleCheckboxCacheClearAll() {
      state.loading = true
      state.selectValues = []
      await deleteAllCheckboxCache({
        deleteByPage: false,
      })
      state.loading = false
    }

    // function handleCheckboxCacheSelect(item: any, e: any) {
    //   const checked = e.target?.checked
    //   if (checked) {
    //     state.selectValues.push(item)
    //   } else {
    //     state.selectValues = state.selectValues.filter((selectValue) => selectValue.id !== item.id)
    //   }
    // }

    async function handleCheckboxCacheClear(item: any) {
      state.loading = true
      state.selectValues = state.selectValues.filter((selectValue) => selectValue.id !== item.id)
      await deleteCheckboxCache(item)
      state.loading = false
    }

    async function handleCheckboxCacheClick(e: Event) {
      if (isObject(props.config?.checkboxCache) && props.config?.checkboxCache.handleAction) {
        props.config?.checkboxCache.handleAction(e)
      }
    }

    return () => {
      return props.config?.checkboxCache && isCheckboxCacheEnabled.value ? (
        <Tooltip placement="bottomLeft" title={tavI18n('Tav.tablePro.setting.7')}>
          <Popover
            placement="bottomLeft"
            trigger="click"
            overlayClassName={`${ComponentPrefixCls}-popver`}
            getPopupContainer={props.getPopupContainer}
          >
            {{
              title: () => (
                <div class={`${ComponentPrefixCls}-popver-title`}>
                  {Object.keys(checkboxCaches.value).length > 0 ? (
                    <>
                      {/* <Checkbox
                    indeterminate={indeterminate.value}
                    checked={allChecked.value}
                    onChange={handleCheckboxCacheCheckAllChange}
                  >
                    {tavI18n('Tav.common.selectAllText')}
                  </Checkbox> */}
                      <span>{`${items.value.length} ${tavI18n('Tav.tablePro.message.5')}`}</span>
                      <div class={`${ComponentPrefixCls}-popver-title-btns`}>
                        <TaButton
                          class={`${ComponentPrefixCls}-popver-title-btn checkbox-cache-clear-all`}
                          type="link"
                          onClick={handleCheckboxCacheClearAll}
                        >
                          {tavI18n('Tav.common.clearAll')}
                        </TaButton>
                      </div>
                    </>
                  ) : null}
                </div>
              ),
              content: () => (
                <TaScrollbar>
                  {Object.keys(checkboxCaches.value).length > 0 ? (
                    Object.keys(checkboxCaches.value).map((currentPage) => {
                      return checkboxCaches.value[currentPage] &&
                        checkboxCaches.value[currentPage].length > 0 ? (
                        <div style="display: flex; flex-direction: column;">
                          <div
                            class="ant-select-item ant-select-item-group"
                            style={{
                              fontSize: '14px',
                            }}
                          >
                            {`第 ${currentPage} 页`}
                          </div>
                          {checkboxCaches.value[currentPage].map((cache) => {
                            return (
                              <div
                                class={`${ComponentPrefixCls}-popver-content-item ant-select-item ant-select-item-option ant-select-item-option-grouped`}
                                style={{
                                  paddingLeft: '12px',
                                }}
                              >
                                {/* <Checkbox
                                      checked={checked.value(cache)}
                                      onChange={(e: Event) => handleCheckboxCacheSelect(cache, e)}
                                    > */}
                                <div
                                  class={`${ComponentPrefixCls}-popver-content-item ant-select-item-option-content`}
                                >
                                  <span
                                    // @ts-ignore
                                    style={{
                                      flex: 1,
                                      display: 'inline-block',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: 'calc(100% - 24px)',
                                    }}
                                  >
                                    {cache.fullName}
                                  </span>
                                  <TaButton
                                    class={`${ComponentPrefixCls}-popver-btn checkbox-cache-clear`}
                                    type="text"
                                    preIcon={'material-symbols:delete-forever-outline'}
                                    iconSize={20}
                                    onClick={() => handleCheckboxCacheClear(cache)}
                                  />
                                </div>
                                {/* </Checkbox> */}
                              </div>
                            )
                          })}
                        </div>
                      ) : null
                    })
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: 0,
                      }}
                    />
                  )}
                </TaScrollbar>
              ),
              default: () => (
                <TaButton
                  class={`${ComponentPrefixCls}-popver-btn checkbox-cache`}
                  type="text"
                  preIcon={'ant-design:check-circle-outlined'}
                  iconSize={20}
                  onClick={handleCheckboxCacheClick}
                  permission={getPermission(props.config?.checkboxCache)}
                >
                  {items.value.length > 0 ? (
                    <Badge
                      count={items.value.length}
                      numberStyle={{ backgroundColor: '#52c41a' }}
                      overflowCount={99}
                    />
                  ) : null}
                </TaButton>
              ),
            }}
          </Popover>
        </Tooltip>
      ) : null
    }
  },
})
