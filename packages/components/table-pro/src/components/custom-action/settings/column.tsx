import { defineComponent, reactive, unref, watchEffect } from 'vue'
import { PushpinFilled } from '@ant-design/icons-vue'
import { Checkbox, Popover, Tooltip, Tree, TreeNode } from 'ant-design-vue'
import { cloneDeep, flatten } from 'lodash-es'
import TaButton from '@tav-ui/components/button'
import TaScrollbar from '@tav-ui/components/scrollbar'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { getPopupContainer } from '@tav-ui/utils/basic'
import { isFunction, isObject } from '@tav-ui/utils/is'
import { warn } from '@tav-ui/utils/log'
import {
  ACTION_COLUMNS,
  COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT,
  CamelCaseToCls,
  SELECT_COMPONENTS,
  ComponentCustomActionName as _ComponentCustomActionName,
} from '../../../const'
import { useTableContext } from '../../../hooks/useTableContext'
import type { DropEvent, TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import type { PropType, Ref, Slots } from 'vue'
import type { TableProColumn, TableProInstance } from '../../../types'
import type {
  CustomActionSettingColumnOption as ColumnOption,
  TableProCustomActionConfig,
} from '../../../typings'

interface IState {
  isInit: boolean
  checkAll: boolean
  indeterminate: boolean
  columnOptions: ColumnOption[]
  columnOptionsCheckedList: string[]
  cacheColumnOptions: ColumnOption[]
  cacheColumnOptionsCheckedList: string[]
}

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
  getPopupContainer: {
    type: Function as PropType<(...args: any[]) => any>,
    default: () => document.body,
  },
}

/**
 * 需要注意的是，treedata 即 columnOptions 控制的是展示以及展示顺序
 * 某一条不展示通过 columnOptionsCheckedList 来控制
 */
export default defineComponent({
  name: ComponentCustomActionName,
  props,
  setup(props, { expose }) {
    const state = reactive<IState>({
      /** 判断table数据是否加载完毕 */
      isInit: false,
      /** 全选控制 */
      checkAll: true,
      /** 全选样式控制 */
      indeterminate: false,
      /** 包含树节点数据结构的列数据 */
      columnOptions: [],
      /** 包含树节点数据结构的选中列数据 */
      columnOptionsCheckedList: [],
      /** 缓存包含树节点数据结构的列数据 */
      cacheColumnOptions: [],
      /** 缓存选中树节点key */
      cacheColumnOptionsCheckedList: [],
    })
    /** 避免未刷新页面重新渲染tree */
    let isPopverInit = false

    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

    const { columnApiOptions, tablePropsRef } = useTableContext()
    if (!columnApiOptions)
      warn(
        '请在业务中的 TaConfigProvider 组件，其属性 components 中配置 TaTablePro 所需数据。开启 column 后所需数据为 userInfo, columnsGetApi, columnsSetApi'
      )

    const { createMessage } = useMessage()

    watchEffect(() => {
      const columns = tablePropsRef.value.columns
      if (columns && columns.length && !state.isInit) {
        init(columns)
      }
    })

    /** 将treedataitem所需数据添加进column */
    function handleColumnOptionDefault(columns: TableProColumn[]): ColumnOption[] {
      const traverse = (columns: TableProColumn[]) => {
        return columns.map((column: TableProColumn) => {
          if (column.children && column.children.length) {
            return {
              ...COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT,
              ...column,
              children: traverse(column.children),
            }
          } else {
            return { ...COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT, ...column }
          }
        })
      }

      return traverse(columns)
    }

    /** 使用tableid+filed的方式做唯一标识，方便持久化 */
    function getColumnId(column: ColumnOption) {
      const tableIdUUID = unref(columnApiOptions)!.getTableId()
      return `${tableIdUUID}_${column.field || column.type}`
    }

    /** 将默认不显示的列过滤 */
    function filterDefaultInvisibleColumn(columns: ColumnOption[]) {
      return columns.filter((column) => column.visible && !column.disabled)
    }

    /** 获取选中列 */
    // function getCheckedList(options: TreeDataItem[]) {
    function getCheckedList(options: ColumnOption[]) {
      return flatten(
        options.map((option) => {
          if (option.children && option.children.length) {
            return [option.key, ...getCheckedList(option.children)]
          } else {
            return option.key
          }
        })
      )
    }

    /** 在获取时将列数据转为树节点所需数据 */
    function handleColumnGetOption(column: ColumnOption, pid: string, parentColumn?: ColumnOption) {
      const { type, field, fixed, disabled: _disabled, visible } = column
      const id = getColumnId(column)
      const currentId = pid ? `${pid}-${id}` : id
      const currentFixed = parentColumn ? parentColumn.fixed : fixed
      // 修改select的title
      if (visible && !_disabled && SELECT_COMPONENTS.includes(type!)) {
        column.title = '选中'
      }
      // 将选中、操作列、传入的固定列设置为disable
      let disabled = false
      if (
        visible &&
        !disabled &&
        ((type && SELECT_COMPONENTS.includes(type!)) ||
          (field && ACTION_COLUMNS.includes(field!)) ||
          !!currentFixed)
      ) {
        disabled = true
      }
      const option: ColumnOption = {
        ...column,
        title: column.title,
        key: currentId,
        disabled,
      }
      return option
    }

    /** 在获取时遍历列数据 */
    function handleColumnGetOptionsTraverse(
      columns: ColumnOption[],
      pid = '',
      parentColumn?: ColumnOption
    ) {
      return columns.map((column) => {
        if (column.children && column.children.length) {
          const current = handleColumnGetOption(column, pid, parentColumn)
          const children = handleColumnGetOptionsTraverse(
            column.children,
            getColumnId(column),
            current
          )
          return { ...current, children }
        } else {
          return handleColumnGetOption(column, pid, parentColumn)
        }
      })
    }

    /** 通过columns来创建checkboxgroup所需数据 */
    function useColumGetOptions(columns: ColumnOption[]) {
      const filteredColumns = filterDefaultInvisibleColumn(columns)
      return handleColumnGetOptionsTraverse(filteredColumns, '')
    }

    /** 在设置时遍历列数据，筛选出选中数组 */
    function handleColumnSetOptionsTraverse(columns: ColumnOption[], checkedList: string[]) {
      return columns
        .map((column) => {
          if (column.children && column.children.length) {
            if (!checkedList.includes(column.key as string)) {
              return null
            } else {
              return {
                ...column,
                children: handleColumnSetOptionsTraverse(column.children, checkedList),
              }
            }
          } else {
            if (!checkedList.includes(column.key as string)) {
              return null
            } else {
              return column
            }
          }
        })
        .filter(Boolean)
    }

    /** 将改动后的options还原为column应用到table中 */
    async function useColumSetOptions(columns: ColumnOption[], checkedList: string[]) {
      // 因为当前已经排好序了，所以只需要处理列是否展示即可
      const filteredColumns = handleColumnSetOptionsTraverse(columns as any, checkedList)

      await props.tableRef?.value?.loadColumn(filteredColumns)
      await props.tableRef?.value?.refreshScroll()
      await props.tableRef?.value?.recalculate()

      return filteredColumns
    }

    /** 初始化组件所需数据 */
    function init(columns: ColumnOption[]) {
      const columnOptions = handleColumnOptionDefault(columns)
      const options = useColumGetOptions(columnOptions)
      const checkedList = getCheckedList(options)

      if (!state.columnOptions.length) {
        state.columnOptions = options
        state.cacheColumnOptions = options
        state.cacheColumnOptionsCheckedList = checkedList
      }

      state.columnOptionsCheckedList = checkedList
      state.isInit = true
    }

    /** popver 弹出处理 */
    function handleColumnVisibleChange() {
      if (isPopverInit || !state.isInit) return
      isPopverInit = true
    }

    /** 全选处理 */
    function handleColumnCheckAllChange(e) {
      const checkList = getCheckedList(state.cacheColumnOptions)
      if (e.target.checked) {
        state.columnOptionsCheckedList = checkList
      } else {
        state.columnOptionsCheckedList = []
      }
    }

    /** 重置处理 */
    function handleColumnReset() {
      state.columnOptionsCheckedList = [...state.cacheColumnOptionsCheckedList]
      state.checkAll = true
      state.indeterminate = false
      state.columnOptions = [...state.cacheColumnOptions]
      // await useColumSetOptions(state.columnOptions as any, state.columnOptionsCheckedList)
    }

    /** 确定处理 */
    async function handleColumnSubmit() {
      const filteredColumnOptions = await useColumSetOptions(
        state.columnOptions as any,
        state.columnOptionsCheckedList
      )

      const { api, params } = unref(columnApiOptions)!.getColumnApiInfo(
        { options: state.columnOptions, checkedList: state.columnOptionsCheckedList },
        'set'
      )
      if (api) {
        await api(params)
      }
    }

    /**
     * 排序处理
     * drop 拖入，drag 拖出
     * @param info
     * @returns
     */
    function handleColumnOptionsSort(info: DropEvent) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data: TreeDataItem[], key: string, callback: any) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = cloneDeep(state.columnOptions)

      // 找到drag节点
      let dragObj: TreeDataItem = {
        value: '',
        key: '',
      }
      loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeDataItem[]) => {
        arr.splice(index, 1)
        dragObj = item
      })

      // 找到drop节点
      let dropObj: TreeDataItem = {
        value: '',
        key: '',
      }
      loop(data, dropKey, (item: TreeDataItem) => {
        dropObj = item
      })

      // drop 节点为固定列，不允许
      if (dropObj.fixed) {
        createMessage.warning('不允许拖入固定列')
        return
      }

      if (dropKey.includes('-')) {
        // 如果drop节点的父节点为fixed节点，那么不允许拖入children中
        const dropParentKey = dropKey.split('-')[0]
        let dropParentObj: TreeDataItem = {
          value: '',
          key: '',
        }
        loop(data, dropParentKey, (item: TreeDataItem) => {
          dropParentObj = item
        })
        if (dropParentObj.fixed) {
          createMessage.warning('不允许拖入固定列')
          return
        }
      } else {
        // 如果drop节点为fixed节点，那么不允许拖入
        if (dropObj.fixed) {
          createMessage.warning('不允许拖入固定列')
          return
        }
      }

      // Find dragObject
      // let dragObj: TreeDataItem = {
      //   value: '',
      //   key: '',
      // }
      // loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeDataItem[]) => {
      //   arr.splice(index, 1)
      //   dragObj = item
      // })

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: TreeDataItem) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item: TreeDataItem) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar: TreeDataItem[] = []
        let i = 0
        loop(data, dropKey, (item: TreeDataItem, index: number, arr: TreeDataItem[]) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      state.columnOptions = data
    }

    /** 列选择处理 */
    function handleColumnOptionsChange(changedCheckedList: string[]) {
      state.columnOptionsCheckedList = [...changedCheckedList]

      const checkedList = getCheckedList(state.cacheColumnOptions)
      if (changedCheckedList.length === checkedList.length) {
        state.indeterminate = false
        state.checkAll = true
      } else {
        state.indeterminate = true
        state.checkAll = false
      }
    }

    /** 应用从接口获得的持久化数据 */
    function coverColumnsSetting(columns: ColumnOption[], checkedList: string[]) {
      state.columnOptions = [...columns]
      state.cacheColumnOptions = [...columns]
      state.columnOptionsCheckedList = [...checkedList]
      state.cacheColumnOptionsCheckedList = [...checkedList]

      useColumSetOptions(state.columnOptions as any, state.columnOptionsCheckedList)
    }

    function handleColumnClick(e: Event) {
      if (isObject(props.config?.column) && props.config?.column.handleAction)
        props.config?.column.handleAction(e)
    }

    expose({
      coverColumnsSetting,
    })

    function createTreeNode(option: ColumnOption, defaultSolt: any) {
      return (
        <TreeNode key={option.key} disabled={option.disabled} class="column-popver-tree-option">
          {{
            title: () => (
              <>
                <span>{option.title}</span>
                {option.fixed ? (
                  <Tooltip placement="top" title="固定列">
                    <PushpinFilled />
                  </Tooltip>
                ) : null}
              </>
            ),
            default: () => (isFunction(defaultSolt) ? defaultSolt(option.children) : defaultSolt),
          }}
        </TreeNode>
      )
    }

    function createTreeNodes(columns: ColumnOption[]) {
      return columns.map((option) => {
        if (option.children && option.children.length) {
          return createTreeNode(option, createTreeNodes)
        } else {
          return createTreeNode(option, null)
        }
      })
    }

    return () => {
      return props.config?.column && unref(columnApiOptions) ? (
        <Tooltip placement="bottomLeft" title="列设置">
          <Popover
            placement="bottomLeft"
            trigger="click"
            onVisibleChange={handleColumnVisibleChange}
            overlayClassName={`column-popver`}
            getPopupContainer={getPopupContainer}
          >
            {{
              title: () => (
                <div class={`column-popver-title`}>
                  <Checkbox
                    indeterminate={state.indeterminate}
                    checked={state.checkAll}
                    onChange={handleColumnCheckAllChange}
                  >
                    全选
                  </Checkbox>
                  <div class={`column-popver-title-btns`}>
                    <TaButton
                      class={`column-popver-title-btn reset`}
                      type="link"
                      onClick={handleColumnReset}
                    >
                      {'重置'}
                    </TaButton>
                    <TaButton
                      class={`column-popver-title-btn submit`}
                      type="link"
                      onClick={handleColumnSubmit}
                    >
                      {'确定'}
                    </TaButton>
                  </div>
                </div>
              ),
              content: () => (
                <TaScrollbar>
                  <Tree
                    defaultCheckedKeys={state.cacheColumnOptionsCheckedList}
                    checkedKeys={state.columnOptionsCheckedList}
                    defaultExpandedKeys={state.cacheColumnOptionsCheckedList}
                    checkable
                    draggable
                    // @ts-ignore
                    onDrop={handleColumnOptionsSort}
                    onCheck={handleColumnOptionsChange}
                  >
                    {createTreeNodes(state.columnOptions)}
                  </Tree>
                </TaScrollbar>
              ),
              default: () => (
                <TaButton
                  class={`${ComponentPrefixCls}-btn column`}
                  type="text"
                  preIcon={'ant-design:appstore-outlined'}
                  iconSize={20}
                  onClick={handleColumnClick}
                  permission={getPermission(props.config?.column)}
                />
              ),
            }}
          </Popover>
        </Tooltip>
      ) : null
    }
  },
})
