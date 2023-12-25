import { defineComponent, reactive, unref, watchEffect } from 'vue'
import { OrderedListOutlined, PushpinFilled } from '@ant-design/icons-vue'
import { Checkbox, Popover, Tooltip, Tree, TreeNode } from 'ant-design-vue'
import { cloneDeep, flatten } from 'lodash-es'
import TaButton from '@tav-ui/components/button'
import TaScrollbar from '@tav-ui/components/scrollbar'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { getPopupContainer } from '@tav-ui/utils/basic'
import { isFunction, isObject } from '@tav-ui/utils/is'
import { warn } from '@tav-ui/utils/log'
import { tavI18n } from '@tav-ui/locales'
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
  visible: boolean
  checkAll: boolean
  indeterminate: boolean
  columnOptions: ColumnOption[]
  columnOptionsCheckedList: string[]
  cacheColumnOptions: ColumnOption[]
  cacheColumnOptionsCheckedList: string[]
  columnOptionsHalfCheckedList: string[]
  cacheColumnOptionsHalfCheckedList: string[]
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
      /** popver 显示或隐藏 */
      visible: false,
      /** 全选控制 */
      checkAll: false,
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
      /** 缓存半选中数据结构的列数据 */
      columnOptionsHalfCheckedList: [],
      /** 缓存半选中树节点key */
      cacheColumnOptionsHalfCheckedList: [],
    })
    /** 避免未刷新页面重新渲染tree */
    let isPopverInit = false

    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

    const { columnApiOptions, tablePropsRef, tableEmitter } = useTableContext()
    if (!columnApiOptions)
      warn(
        '请在业务中的 TaConfigProvider 组件，其属性 components 中配置 TaTablePro 所需数据。开启 column 后所需数据为 userInfo, columnsGetApi, columnsSetApi'
      )
    const { createMessage } = useMessage()

    watchEffect(() => {
      const isColumnOpen = tablePropsRef.value.customActionConfig.column
      const columns = tablePropsRef.value.columns
      if (isColumnOpen && columns && columns.length && !state.isInit) {
        init(columns)
      }
    })

    /** 将treedataitem所需数据添加进column */
    function handleColumnOptionDefault(columns: TableProColumn[]): ColumnOption[] {
      const traverse = (columns: TableProColumn[]) => {
        return columns.map((column: TableProColumn) => {
          if (column.children && column.children.length) {
            let visible = column.visible
            if (column.visible === undefined) {
              visible = COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT.visible
            }
            return {
              ...COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT,
              ...column,
              visible,
              children: traverse(column.children),
            }
          } else {
            let visible = column.visible
            if (column.visible === undefined) {
              visible = COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT.visible
            }
            return { ...COLUMN_SETTING_TREE_DATA_ITEM_DEFAULT, ...column, visible }
          }
        })
      }

      return traverse(columns)
    }

    /** 使用tableid+filed的方式做唯一标识，方便持久化 */
    function getColumnId(column: ColumnOption) {
      const tableIdUUID = unref(columnApiOptions)?.getTableId()
      return `${tableIdUUID}_${column.field || column.type}`
    }

    /** 将默认disabled的列过滤 */
    function filterDefaultInvisibleColumn(columns: ColumnOption[]) {
      return columns.filter((column) => !column.disabled)
    }

    /** 获取默认选中列 */
    function getDefaultCheckedList(options: ColumnOption[]) {
      return flatten(
        options.map((option) => {
          if (option.children && option.children.length) {
            if (option.disabled || option.fixed) {
              return [option.key, ...getDefaultCheckedList(option.children)]
            } else {
              return null
            }
          } else {
            if (option.disabled || option.fixed) {
              return option.key
            } else {
              return null
            }
          }
        })
      ).filter(Boolean)
    }

    /** 获取选中列 */
    function getCheckedList(options: ColumnOption[]) {
      return flatten(
        options
          .map((option) => {
            if (option.children && option.children.length) {
              if (option.visible) {
                return [option.key, ...getCheckedList(option.children)]
              } else {
                return [...getCheckedList(option.children)]
              }
            } else {
              if (option.visible) {
                return option.key
              } else {
                return null
              }
            }
          })
          .filter(Boolean)
      )
    }

    /**
     * 获取扁平化的 option 用来判断全选与半选
     * @param options
     * @returns
     */
    function getFlattenOptions(options: ColumnOption[]) {
      return flatten(
        options.map((option) => {
          if (option.children && option.children.length) {
            return [option.key, ...getFlattenOptions(option.children)]
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
      // const currentId = pid ? `${pid}-${id}` : id
      const currentId = id
      const currentFixed = parentColumn ? parentColumn.fixed : fixed
      // 修改select的title
      if (visible && !_disabled && SELECT_COMPONENTS.includes(type!)) {
        column.title = tavI18n('Tav.tablePro.columns.2')
      }
      // 将选中、操作列、传入的固定列设置为disable
      let disabled = false
      if (
        // visible &&
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
    async function useColumSetOptions(
      columns: ColumnOption[],
      checkedList: string[],
      halfCheckedList: string[]
    ) {
      // 因为当前已经排好序了，所以只需要处理列是否展示即可
      const filteredColumns = handleColumnSetOptionsTraverse(columns as any, [
        ...checkedList,
        ...halfCheckedList,
      ])

      await props.tableRef?.value?.loadColumn(filteredColumns)
      await props.tableRef?.value?.refreshScroll()
      await props.tableRef?.value?.recalculate()
      tableEmitter.emit('table-pro:column-covered')

      return filteredColumns
    }

    /** 初始化组件所需数据 */
    function init(columns: ColumnOption[]) {
      const columnOptions = handleColumnOptionDefault(columns)
      const options = useColumGetOptions(columnOptions)
      const checkedList = getCheckedList(options)

      if (!state.columnOptions.length) {
        state.columnOptions = [...options]
        state.cacheColumnOptions = [...options]
        state.cacheColumnOptionsCheckedList = checkedList
      }

      state.columnOptionsCheckedList = checkedList
      state.isInit = true

      if (checkedList.length === getFlattenOptions(options).length) {
        state.checkAll = true
        state.indeterminate = false
      } else {
        state.checkAll = false
        state.indeterminate = true
      }
    }

    /** popver 弹出处理 */
    function handleColumnVisibleChange() {
      if (isPopverInit || !state.isInit) return
      isPopverInit = true
    }

    /** 全选处理 */
    async function handleColumnCheckAllChange(e) {
      const checkList = getFlattenOptions(state.columnOptions)
      if (e.target.checked) {
        state.columnOptionsCheckedList = checkList
        state.checkAll = true
        state.indeterminate = false
      } else {
        state.columnOptionsCheckedList = getDefaultCheckedList(state.columnOptions)
        state.checkAll = false
        state.indeterminate = true
      }

      const columnOptions = state.columnOptions.map((column) => {
        const handle = (_column) => {
          let visible = true
          if (_column.key && state.columnOptionsCheckedList.includes(_column.key)) {
            visible = true
          } else {
            visible = false
          }
          return {
            ..._column,
            visible,
          }
        }

        if (column.children && column.children.length) {
          const current = handle(column)
          const children = column.children.map((childColumn) => handle(childColumn))
          return {
            ...current,
            children,
          }
        } else {
          return handle(column)
        }
      })
      state.columnOptions = [...columnOptions]
      // await useColumSetOptions(
      //   state.columnOptions as any,
      //   state.columnOptionsCheckedList,
      //   state.columnOptionsHalfCheckedList
      // )
    }

    /** 重置处理 */
    async function handleColumnReset() {
      state.columnOptionsCheckedList = [...state.cacheColumnOptionsCheckedList]
      state.columnOptionsHalfCheckedList = []
      state.columnOptions = [...state.cacheColumnOptions]
      if (state.columnOptionsCheckedList.length === getFlattenOptions(state.columnOptions).length) {
        state.checkAll = true
        state.indeterminate = false
      } else {
        state.checkAll = false
        state.indeterminate = true
      }

      // await useColumSetOptions(
      //   state.columnOptions as any,
      //   state.columnOptionsCheckedList,
      //   state.columnOptionsHalfCheckedList
      // )
    }

    /** 确定处理 */
    async function handleColumnSubmit() {
      await useColumSetOptions(
        state.columnOptions as any,
        state.columnOptionsCheckedList,
        state.columnOptionsHalfCheckedList
      )

      const { api, params } = unref(columnApiOptions)!.getColumnApiInfo(
        {
          options: state.columnOptions,
          checkedList: state.columnOptionsCheckedList,
          halfCheckedList: state.columnOptionsHalfCheckedList,
        },
        'set'
      )
      if (api) {
        const { success } = await api(params)
        // state.visible = false
        if (success) {
          createMessage.success(tavI18n('Tav.tablePro.message.1'))
        } else {
          createMessage.warning(tavI18n('Tav.tablePro.message.2'))
        }
      }
    }

    /**
     * 排序处理
     * drop 拖入，drag 拖出
     * @param info
     * @returns
     */
    async function handleColumnOptionsSort(info: DropEvent) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data: ColumnOption[], key: string, callback: any) => {
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
        createMessage.warning(tavI18n('Tav.tablePro.message.3'))
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
          createMessage.warning(tavI18n('Tav.tablePro.message.3'))
          return
        }
      } else {
        // 如果drop节点为fixed节点，那么不允许拖入
        if (dropObj.fixed) {
          createMessage.warning(tavI18n('Tav.tablePro.message.3'))
          return
        }
      }

      if (!info.dropToGap) {
        createMessage.warning(tavI18n('Tav.tablePro.message.4'))
        return
      }

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
      state.columnOptions = [...data]

      // await useColumSetOptions(
      //   state.columnOptions as any,
      //   state.columnOptionsCheckedList,
      //   state.columnOptionsHalfCheckedList
      // )
    }

    /** 列选择处理 */
    async function handleColumnOptionsChange(changedCheckedList: string[], e) {
      state.columnOptionsCheckedList = [...changedCheckedList]
      const halfList = e.halfCheckedKeys
      state.columnOptionsHalfCheckedList = [...halfList]
      if (changedCheckedList.length === getFlattenOptions(state.columnOptions).length) {
        state.checkAll = true
        state.indeterminate = false
      } else {
        state.checkAll = false
        state.indeterminate = true
      }

      const columnOptions = state.columnOptions.map((column) => {
        const handle = (_column) => {
          let visible = true
          if (_column.key && changedCheckedList.includes(_column.key)) {
            visible = true
          } else {
            visible = false
          }
          return {
            ..._column,
            visible,
          }
        }

        if (column.children && column.children.length) {
          const current = handle(column)
          const children = column.children.map((childColumn) => handle(childColumn))
          return {
            ...current,
            children,
          }
        } else {
          return handle(column)
        }
      })
      state.columnOptions = [...columnOptions]
      // await useColumSetOptions(
      //   state.columnOptions as any,
      //   state.columnOptionsCheckedList,
      //   state.columnOptionsHalfCheckedList
      // )
    }

    /** 应用从接口获得的持久化数据 */
    function coverColumnsSetting(
      columns: ColumnOption[],
      checkedList: string[],
      halfCheckedList: string[]
    ) {
      if (columns.length) {
        state.columnOptions = [...columns]
        state.cacheColumnOptions = [...columns]
      }

      if (checkedList.length) {
        state.columnOptionsCheckedList = [...checkedList]
        state.cacheColumnOptionsCheckedList = [...checkedList]
      }

      if (halfCheckedList.length) {
        state.columnOptionsHalfCheckedList = [...halfCheckedList]
        // state.cacheColumnOptionsHalfCheckedList = [...halfCheckedList]
      }

      if (state.columnOptionsCheckedList.length === getFlattenOptions(state.columnOptions).length) {
        state.checkAll = true
        state.indeterminate = false
      } else {
        state.checkAll = false
        state.indeterminate = true
      }

      useColumSetOptions(
        state.columnOptions as any,
        state.columnOptionsCheckedList,
        state.columnOptionsHalfCheckedList
      )
    }

    function handleColumnClick(e: Event) {
      // state.visible = true
      handleColumnVisibleChange()
      if (isObject(props.config?.column) && props.config?.column.handleAction)
        props.config?.column.handleAction(e)
    }

    expose({
      coverColumnsSetting,
      handleColumnClick,
    })

    function createTreeNode(option: ColumnOption, defaultSolt: any) {
      return (
        <TreeNode key={option.key} disabled={option.disabled} class="column-popver-tree-option">
          {{
            title: () => (
              <>
                <span>{option.title}</span>
                {option.fixed ? (
                  <Tooltip placement="top" title={tavI18n('Tav.tablePro.setting.2')}>
                    <PushpinFilled />
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title={tavI18n('Tav.tablePro.setting.3')}>
                    <OrderedListOutlined />
                  </Tooltip>
                )}
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
        <Tooltip placement="bottomLeft" title={tavI18n('Tav.tablePro.setting.1')}>
          <Popover
            placement="bottomLeft"
            trigger="click"
            // visible={state.visible}
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
                    {tavI18n('Tav.common.selectAllText')}
                  </Checkbox>
                  <div class={`column-popver-title-btns`}>
                    <TaButton
                      class={`column-popver-title-btn reset`}
                      type="link"
                      onClick={handleColumnReset}
                    >
                      {tavI18n('Tav.common.resetText')}
                    </TaButton>
                    <TaButton
                      class={`column-popver-title-btn submit`}
                      type="link"
                      onClick={handleColumnSubmit}
                    >
                      {tavI18n('Tav.common.okText')}
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
                  preIcon={'material-symbols:lists-rounded'}
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
