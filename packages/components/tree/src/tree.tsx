import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRaw,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { Empty, Tree } from 'ant-design-vue'
import { difference, get, omit } from 'lodash-es'
import { useContextMenu } from '@tav-ui/hooks/web/useContextMenu'
import { filter, treeToList } from '@tav-ui/utils/helper/treeHelper'
import { extendSlots, getSlot } from '@tav-ui/utils/helper/tsxHelper'
import { isArray, isBoolean, isEmpty, isFunction } from '@tav-ui/utils/is'
import ScrollContainer from '@tav-ui/components/container-scroll'
import { treeProps } from './props'
import TreeHeader from './TreeHeader.vue'
import { TreeIcon } from './TreeIcon'
import { useTree } from './useTree'
import type {
  CheckEvent,
  CheckKeys,
  ContextMenuItem,
  Keys,
  Recordable,
  ReplaceFields,
  TreeActionType,
  TreeItem,
} from './types'
import type { CSSProperties } from 'vue'
// import { CreateContextOptions } from "@casta-fe-playground/components/ContextMenu";
type contextMenuOptions = {
  event: any
  items?: ContextMenuItem[]
}
interface State {
  expandedKeys: Keys
  selectedKeys: Keys
  checkedKeys: CheckKeys
  checkStrictly: boolean
}
export default defineComponent({
  name: 'TaTree',
  inheritAttrs: false,
  props: treeProps,
  emits: [
    'update:expandedKeys',
    'update:selectedKeys',
    'update:value',
    'change',
    'check',
    'update:searchValue',
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const state = reactive<State>({
      checkStrictly: props.checkStrictly,
      expandedKeys: props.expandedKeys || [],
      selectedKeys: props.selectedKeys || [],
      checkedKeys: props.checkedKeys || [],
    })

    const searchState = reactive({
      startSearch: false,
      searchText: '',
      searchData: [] as TreeItem[],
    })

    const treeDataRef = ref<TreeItem[]>([])

    const [createContextMenu] = useContextMenu()
    const prefixCls = 'ta-basic-tree'

    const getReplaceFields = computed((): Required<ReplaceFields> => {
      const { replaceFields } = props
      return {
        children: 'children',
        title: 'title',
        key: 'key',
        ...(replaceFields as object),
      }
    })

    const getBindValues = computed(() => {
      const propsData = {
        blockNode: true,
        ...attrs,
        ...props,
        expandedKeys: state.expandedKeys,
        selectedKeys: state.selectedKeys,
        checkedKeys: state.checkedKeys,
        checkStrictly: state.checkStrictly,
        replaceFields: unref(getReplaceFields),
        'onUpdate:expandedKeys': (v: Keys) => {
          state.expandedKeys = v
          emit('update:expandedKeys', v)
        },
        'onUpdate:selectedKeys': (v: Keys) => {
          state.selectedKeys = v
          emit('update:selectedKeys', v)
        },
        onCheck: (v: CheckKeys, e: CheckEvent) => {
          let currentValue = toRaw(state.checkedKeys) as Keys
          if (isArray(currentValue) && searchState.startSearch) {
            const { key } = unref(getReplaceFields)
            currentValue = difference(currentValue, getChildrenKeys(e.node.$attrs.node[key]))
            if (e.checked && Array.isArray(currentValue)) {
              currentValue.push(e.node.$attrs.node[key] as string)
            }
            state.checkedKeys = currentValue
          } else {
            state.checkedKeys = v
          }

          const rawVal = toRaw(state.checkedKeys)
          emit('update:value', rawVal)
          emit('check', rawVal, e)
        },
        onRightClick: handleRightClick,
      }
      return omit(propsData, 'treeData', 'class')
    })

    const getTreeData = computed((): TreeItem[] =>
      searchState.startSearch ? searchState.searchData : unref(treeDataRef)
    )

    const getNotFound = computed((): boolean => {
      return !getTreeData.value || getTreeData.value.length === 0
    })

    const {
      deleteNodeByKey,
      insertNodeByKey,
      insertNodesByKey,
      filterByLevel,
      updateNodeByKey,
      getAllKeys,
      getChildrenKeys,
      getEnabledKeys,
    } = useTree(treeDataRef, getReplaceFields)

    function getIcon(params: Recordable, icon?: string) {
      if (!icon) {
        if (props.renderIcon && isFunction(props.renderIcon)) {
          return props.renderIcon(params)
        }
      }
      return icon
    }

    async function handleRightClick({ event, node }: Recordable) {
      const { rightMenuList, beforeRightClick } = props
      const contextMenuOptions: contextMenuOptions = { event, items: [] }

      if (beforeRightClick && isFunction(beforeRightClick)) {
        const result = await beforeRightClick(node, event)
        if (Array.isArray(result)) {
          contextMenuOptions.items = result
        } else {
          Object.assign(contextMenuOptions, result)
        }
      } else {
        contextMenuOptions['items'] = rightMenuList
      }
      if (!contextMenuOptions.items?.length) return
      createContextMenu(contextMenuOptions)
    }

    function setExpandedKeys(keys: Keys) {
      state.expandedKeys = keys
    }

    function getExpandedKeys() {
      return state.expandedKeys
    }
    function setSelectedKeys(keys: Keys) {
      state.selectedKeys = keys
    }

    function getSelectedKeys() {
      return state.selectedKeys
    }

    function setCheckedKeys(keys: CheckKeys) {
      state.checkedKeys = keys
    }

    function getCheckedKeys() {
      return state.checkedKeys
    }

    function checkAll(checkAll: boolean) {
      state.checkedKeys = checkAll ? getEnabledKeys() : ([] as Keys)
    }

    function expandAll(expandAll: boolean) {
      state.expandedKeys = expandAll ? getAllKeys() : ([] as Keys)
    }

    function onStrictlyChange(strictly: boolean) {
      state.checkStrictly = strictly
    }

    watch(
      () => props.searchValue,
      (val) => {
        if (val !== searchState.searchText) {
          searchState.searchText = val
        }
      },
      {
        immediate: true,
      }
    )

    watch(
      () => props.treeData,
      (val) => {
        if (val) {
          handleSearch(searchState.searchText)
        }
      }
    )

    function handleSearch(searchValue: string) {
      if (searchValue !== searchState.searchText) searchState.searchText = searchValue
      emit('update:searchValue', searchValue)
      if (!searchValue) {
        searchState.startSearch = false
        return false
      }
      const { filterFn, checkable, expandOnSearch, checkOnSearch, selectedOnSearch } = unref(props)
      searchState.startSearch = true
      const { title: titleField, key: keyField } = unref(getReplaceFields)

      const matchedKeys: string[] = []
      searchState.searchData = filter(
        unref(treeDataRef),
        (node) => {
          let result = false
          if (filterFn) {
            result = filterFn(searchValue, node, unref(getReplaceFields))
          } else {
            const fields: string[] = node[titleField]
            if (Array.isArray(fields)) {
              result = fields.includes(searchValue)
            } else {
              result = false
            }
          }
          // const result = filterFn
          //   ? filterFn(searchValue, node, unref(getReplaceFields))
          //   : node[titleField]?node[titleField].includes(searchValue) : false;
          if (result) {
            matchedKeys.push(node[keyField])
          }
          return result
        },
        unref(getReplaceFields)
      )

      if (expandOnSearch) {
        const expandKeys = treeToList(searchState.searchData).map((val) => {
          return val[keyField]
        })
        if (expandKeys && expandKeys.length) {
          setExpandedKeys(expandKeys)
        }
      }

      if (checkOnSearch && checkable && matchedKeys.length) {
        setCheckedKeys(matchedKeys)
      }

      if (selectedOnSearch && matchedKeys.length) {
        setSelectedKeys(matchedKeys)
      }
    }

    function handleClickNode(key: string, children: TreeItem[]) {
      if (!props.clickRowToExpand || !children || children.length === 0) return
      if (!state.expandedKeys.includes(key)) {
        setExpandedKeys([...state.expandedKeys, key])
      } else {
        const keys = [...state.expandedKeys]
        const index = keys.findIndex((item) => item === key)
        if (index !== -1) {
          keys.splice(index, 1)
        }
        setExpandedKeys(keys)
      }
    }

    watchEffect(() => {
      treeDataRef.value = props.treeData as TreeItem[]
    })

    onMounted(() => {
      const level = parseInt(props.defaultExpandLevel.toString())
      if (level > 0) {
        state.expandedKeys = filterByLevel(level)
      } else if (props.defaultExpandAll) {
        expandAll(true)
      }
    })

    watchEffect(() => {
      state.expandedKeys = props.expandedKeys
    })

    watchEffect(() => {
      state.selectedKeys = props.selectedKeys
    })

    watchEffect(() => {
      state.checkedKeys = props.checkedKeys
    })

    watch(
      () => props.value,
      () => {
        state.checkedKeys = toRaw(props.value || [])
      }
    )

    watch(
      () => state.checkedKeys,
      () => {
        const v = toRaw(state.checkedKeys)
        emit('update:value', v)
        emit('change', v)
      }
    )

    // watchEffect(() => {
    //   console.log('======================');
    //   console.log(props.value);
    //   console.log('======================');
    //   if (props.value) {
    //     state.checkedKeys = props.value;
    //   }
    // });

    watchEffect(() => {
      state.checkStrictly = props.checkStrictly
    })

    const instance: TreeActionType = {
      setExpandedKeys,
      getExpandedKeys,
      setSelectedKeys,
      getSelectedKeys,
      setCheckedKeys,
      getCheckedKeys,
      insertNodeByKey,
      insertNodesByKey,
      deleteNodeByKey,
      updateNodeByKey,
      checkAll,
      expandAll,
      filterByLevel: (level: number) => {
        state.expandedKeys = filterByLevel(level)
      },
      setSearchValue: (value: string) => {
        handleSearch(value)
      },
      getSearchValue: () => {
        return searchState.searchText
      },
    }

    expose(instance)

    function renderAction(node: TreeItem) {
      const { actionList } = props
      if (!actionList || actionList.length === 0) return
      return actionList.map((item, index) => {
        let nodeShow = true
        if (isFunction(item.show)) {
          nodeShow = item.show?.(node)
        } else if (isBoolean(item.show)) {
          nodeShow = item.show
        }

        if (!nodeShow) return null

        return (
          <span key={index} class={`${prefixCls}__action`}>
            {item.render(node)}
          </span>
        )
      })
    }

    function renderTreeNode({ data, level }: { data: TreeItem[] | undefined; level: number }) {
      if (!data) {
        return null
      }
      const searchText = searchState.searchText
      const { highlight } = unref(props)
      return data.map((item) => {
        const {
          title: titleField,
          key: keyField,
          children: childrenField,
        } = unref(getReplaceFields)

        const propsData = omit(item, 'title')
        const icon = getIcon({ ...item, level }, item.icon)
        const children = get(item, childrenField) || []
        const title = get(item, titleField)

        const searchIdx = searchText ? title.indexOf(searchText) : -1
        const isHighlight =
          searchState.startSearch && !isEmpty(searchText) && highlight && searchIdx !== -1
        const highlightStyle = `color: ${isBoolean(highlight) ? '#f50' : highlight}`

        const titleDom = isHighlight ? (
          <span class={unref(getBindValues)?.blockNode ? `${prefixCls}__content` : ''}>
            <span>{title.substr(0, searchIdx)}</span>
            <span style={highlightStyle}>{searchText}</span>
            <span>{title.substr(searchIdx + (searchText as string).length)}</span>
          </span>
        ) : (
          title
        )

        return (
          <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
            {{
              title: () => (
                <span
                  class={`${prefixCls}-title pl-2`}
                  onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
                >
                  {item.slots?.title ? (
                    getSlot(slots, item.slots?.title, item)
                  ) : (
                    <>
                      {icon && TreeIcon({ icon })}
                      {titleDom}
                      {/*{get(item, titleField)}*/}
                      <span class={`${prefixCls}__actions`}>
                        {renderAction({ ...item, level })}
                      </span>
                    </>
                  )}
                </span>
              ),
              default: () => renderTreeNode({ data: children, level: level + 1 }),
            }}
          </Tree.TreeNode>
        )
      })
    }
    return () => {
      const { title, helpMessage, toolbar, search, checkable } = props
      const showTitle = title || toolbar || search || slots.headerTitle
      const scrollStyle: CSSProperties = { height: 'calc(100% - 38px)' }
      return (
        <div class={[prefixCls, 'h-full', attrs.class]}>
          {showTitle && (
            <TreeHeader
              checkable={checkable}
              checkAll={checkAll}
              expandAll={expandAll}
              title={title}
              search={search}
              toolbar={toolbar}
              helpMessage={helpMessage}
              onStrictlyChange={onStrictlyChange}
              onSearch={handleSearch}
              searchText={searchState.searchText}
            >
              {extendSlots(slots)}
            </TreeHeader>
          )}
          <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
            <Tree {...unref(getBindValues)} showIcon={false}>
              {{
                // switcherIcon: () => <DownOutlined />,
                default: () => renderTreeNode({ data: unref(getTreeData), level: 1 }),
                ...extendSlots(slots),
              }}
            </Tree>
          </ScrollContainer>

          <Empty v-show={unref(getNotFound)} image={Empty.PRESENTED_IMAGE_SIMPLE} class="!mt-4" />
        </div>
      )
    }
  },
})
