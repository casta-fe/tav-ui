import { propTypes } from '@tav-ui/utils/propTypes'
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import type { ExtractPropTypes, PropType } from 'vue'
import type {
  CheckKeys,
  ContextMenuItem,
  ContextMenuOptions,
  Keys,
  Recordable,
  ReplaceFields,
  TreeActionItem,
  TreeItem,
} from './types'

export const treeProps = {
  value: {
    type: [Object, Array] as PropType<Keys | CheckKeys>,
  },
  renderIcon: {
    type: Function as PropType<(params: Recordable) => string>,
  },

  helpMessage: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },

  title: propTypes.string,
  toolbar: propTypes.bool,
  search: propTypes.bool,
  searchValue: propTypes.string,
  checkStrictly: propTypes.bool,
  clickRowToExpand: propTypes.bool.def(true),
  checkable: propTypes.bool.def(false),
  defaultExpandLevel: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  defaultExpandAll: propTypes.bool.def(false),

  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },

  treeData: {
    type: Array as PropType<TreeDataItem[]>,
  },

  actionList: {
    type: Array as PropType<TreeActionItem[]>,
    default: () => [],
  },

  expandedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  selectedKeys: {
    type: Array as PropType<Keys>,
    default: () => [],
  },

  checkedKeys: {
    type: Array as PropType<CheckKeys>,
    default: () => [],
  },

  beforeRightClick: {
    type: Function as PropType<(...arg: any) => ContextMenuItem[] | ContextMenuOptions>,
    default: () => [],
  },

  rightMenuList: {
    type: Array as PropType<ContextMenuItem[]>,
    default: () => [],
  },
  // 自定义数据过滤判断方法(注: 不是整个过滤方法，而是内置过滤的判断方法，用于增强原本仅能通过title进行过滤的方式)
  filterFn: {
    type: Function as PropType<
      (searchValue: any, node: TreeItem, replaceFields: ReplaceFields) => boolean
    >,
    default: null,
  },
  // 高亮搜索值，仅高亮具体匹配值（通过title）值为true时使用默认色值，值为#xxx时使用此值替代且高亮开启
  highlight: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  // 搜索完成时自动展开结果
  expandOnSearch: propTypes.bool.def(false),
  // 搜索完成自动选中所有结果,当且仅当 checkable===true 时生效
  checkOnSearch: propTypes.bool.def(false),
  // 搜索完成自动select所有结果
  selectedOnSearch: propTypes.bool.def(false),
}

export type TreeProps = ExtractPropTypes<typeof treeProps>

export const treeNodeProps = {
  actionList: {
    type: Array as PropType<TreeActionItem[]>,
    default: () => [],
  },
  replaceFields: {
    type: Object as PropType<ReplaceFields>,
  },
  treeData: {
    type: Array as PropType<TreeDataItem[]>,
    default: () => [],
  },
}
export type TreeNodeProps = ExtractPropTypes<typeof treeNodeProps>
