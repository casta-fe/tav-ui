import {
  DEFAULT_ALIGN,
  DEFAULT_LINE_HEIGTH,
  ETableProEmits,
  FETCH_SETTING,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  ROW_KEY,
  // buildTableId,
} from './const'
import type { TableProExtendApis } from './hooks/useExtendInstance'
import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type {
  VxeColumnPropTypes,
  VxeGridEventProps,
  VxeGridInstance,
  VxeGridPropTypes,
  VxeTableDefines,
  VxeTableEventProps,
  VxeTablePropTypes,
} from 'vxe-table'
import type { FetchSetting } from './const'
import type {
  PagerConfig,
  TableProApi,
  TableProCustomActionConfig,
  TableProFilterFormConfig,
} from './typings'

/** column 类型 */
export type TableProColumn = VxeTableDefines.ColumnOptions & {
  /** 使用customrender后template插槽失效，如果想使用template插槽，请使用slot-default */
  // customRender 在运行时不会用到，传进来后用vxetable提供的cellrender接收
  customRender?: (params: VxeColumnPropTypes.DefaultSlotParams) => JSX.Element | VNode | string
  children?: TableProColumn[]
}
export type TableProColumnInfo = VxeTableDefines.ColumnInfo

/** table 实例 */
export type TableProInstance = VxeGridInstance
/** 扩展后的 table 实例 */
export interface ITableProInstance {
  instance: TableProInstance & TableProExtendApis
}
/** table 支持的事件类型 */
export type TableProEvent = VxeTableEventProps & VxeGridEventProps
/** table 支持的事件名称 */
export type TableProEmits = keyof typeof ETableProEmits
export type TableProGridEmit = (event: TableProEmits, ...args: any[]) => void
const _tableProEmits: string[] = []
for (const k in ETableProEmits) {
  _tableProEmits.push(k)
}
export const tableProEmits = _tableProEmits as TableProEmits[]
/** table props */
export const tableProProps = {
  //:==================================================: 全局设置 :==================================================://
  /**
   * 表格大小 https://vxetable.cn/#/table/base/size
   */
  size: {
    type: [String, null] as PropType<VxeTablePropTypes.Size>,
    default: 'small',
  },
  /** 唯一标识（被某些特定的功能所依赖） */
  id: {
    type: String as PropType<VxeTablePropTypes.ID>,
    // default: buildTableId(),
  },
  /**
   * 表格高度（默认为铺满网页）https://vxetable.cn/#/table/base/autoHeight
   * 当前默认值为 'auto' 随父级高度变化（必须开启autoresize，当前默认开启）
   * 1. 如果要随父级高度变化，此处必须设置为 'auto'。然后在外层包一个带有指定高度的父容器, 跟随父级走的话高度会跳动
   * 2. 不追随父级变化，此处可以直接设置 500。即高度为 500px
   * 3. 当高度设置为数字后还有固定表头的作用 https://vxetable.cn/#/table/base/height
   * 4. 默认铺满全屏
   */
  height: {
    type: [String, Number] as PropType<VxeTablePropTypes.Height>,
    // default: '100%',
    default: 'auto',
  },
  /** 表格最大高度（超出自动出现 y轴 滚动条） */
  maxHeight: {
    type: [String, Number] as PropType<VxeTablePropTypes.MaxHeight>,
  },
  /**
   * 表格数据（数据为响应式，在使用时建议每次变化直接赋值，与 loadData 行为一致，更新数据是不会重置状态）
   * 1. 参考 https://vxetable.cn/#/grid/api
   * 2. replace 'dataSource'
   */
  data: {
    type: Array as PropType<any[]>,
  },
  /**
   * 表格自动调整
   * 开启虚拟滚动后必须指定行高，想用动态行高则需关闭虚拟滚动
   */
  resizable: {
    type: Boolean as PropType<VxeTablePropTypes.Resizable>,
    default: true,
  },
  /** 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式） */
  stripe: {
    type: Boolean as PropType<VxeTablePropTypes.Stripe>,
    default: false,
  },
  /** 是否为圆角边框 */
  round: {
    type: Boolean as PropType<VxeTablePropTypes.Round>,
    default: true,
  },
  /** 是否带有边框 */
  border: {
    type: [String, Boolean] as PropType<VxeTablePropTypes.Border>,
    default: 'inner',
  },
  /** 表格是否显示加载中 */
  loading: {
    type: Boolean as PropType<VxeTablePropTypes.Loading>,
    default: false,
  },
  /** 所有列的对齐方式 */
  align: {
    type: [String, null] as PropType<VxeTablePropTypes.Align>,
    default: DEFAULT_ALIGN,
  },
  /** 表头的对齐方式 */
  headerAlign: {
    type: [String, null] as PropType<VxeTablePropTypes.Align>,
    default: DEFAULT_ALIGN,
  },
  /** 表尾的对齐方式 */
  footerAlign: {
    type: [String, null] as PropType<VxeTablePropTypes.Align>,
    default: DEFAULT_ALIGN,
  },
  /** 是否显示表头 */
  showHeader: {
    type: Boolean as PropType<VxeTablePropTypes.ShowHeader>,
    default: true,
  },
  /** 是否显示表尾 */
  showFooter: {
    type: Boolean as PropType<VxeTablePropTypes.ShowFooter>,
  },
  /** 是否高亮当前行 */
  highlightCurrentRow: {
    type: Boolean as PropType<VxeTablePropTypes.HighlightCurrentRow>,
    default: false,
  },
  /** hover 时高亮行 */
  highlightHoverRow: {
    type: Boolean as PropType<VxeTablePropTypes.HighlightHoverRow>,
    default: true,
  },
  /** 是否高亮当前列 */
  highlightCurrentColumn: {
    type: Boolean as PropType<VxeTablePropTypes.HighlightCurrentColumn>,
    default: false,
  },
  /** hover 时高亮列 */
  highlightHoverColumn: {
    type: Boolean as PropType<VxeTablePropTypes.HighlightHoverColumn>,
    default: true,
  },
  /** 高亮单元格 */
  highlightCell: {
    type: Boolean as PropType<VxeTablePropTypes.HighlightCell>,
    default: false,
  },
  /** 表尾的数据获取方法，返回一个二维数组 */
  footerMethod: {
    type: Function as PropType<VxeTablePropTypes.FooterMethod>,
  },
  /** 给行附加 className */
  rowClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.RowClassName>,
  },
  /** 给单元格附加 className */
  cellClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.CellClassName>,
  },
  /** 给表头的行附加 className */
  headerRowClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.HeaderRowClassName>,
  },
  /** 给表头的单元格附加 className */
  headerCellClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.HeaderCellClassName>,
  },
  /** 给表尾的行附加 className */
  footerRowClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.FooterRowClassName>,
  },
  /** 给表尾的单元格附加 className */
  footerCellClassName: {
    type: [String, Function] as PropType<VxeTablePropTypes.FooterCellClassName>,
  },
  /** 给单元格附加样式 */
  cellStyle: {
    type: Object as PropType<VxeTablePropTypes.CellStyle>,
  },
  /** 给表头单元格附加样式 */
  headerCellStyle: {
    type: Object as PropType<VxeTablePropTypes.HeaderCellStyle>,
  },
  /** 给表尾单元格附加样式 */
  footerCellStyle: {
    type: Object as PropType<VxeTablePropTypes.FooterCellStyle>,
  },
  /** 给行附加样式 */
  rowStyle: {
    type: Object as PropType<VxeTablePropTypes.RowStyle>,
  },
  /** 给表头行附加样式 */
  headerRowStyle: {
    type: Object as PropType<VxeTablePropTypes.HeaderRowStyle>,
  },
  /** 给表头行附加样式 */
  footerRowStyle: {
    type: Object as PropType<VxeTablePropTypes.FooterRowStyle>,
  },
  /** 临时合并指定的单元格 (不能用于展开行，不建议用于固定列、树形结构) */
  mergeCells: {
    type: Array as PropType<VxeTablePropTypes.MergeCells>,
  },
  /** 临时合并表尾 (不能用于展开行，不建议用于固定列、树形结构) */
  mergeFooterItems: {
    type: Array as PropType<VxeTablePropTypes.MergeFooterItems>,
  },
  /** 自定义合并函数，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构) */
  spanMethod: {
    type: Function as PropType<VxeTablePropTypes.SpanMethod>,
  },
  /** 表尾合并行或列，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构) */
  footerSpanMethod: {
    type: Function as PropType<VxeTablePropTypes.FooterSpanMethod>,
  },
  /** 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度） */
  showOverflow: {
    type: [String, Boolean, null] as PropType<VxeTablePropTypes.ShowOverflow>,
    // default: 'ellipsis',
    default: true,
  },
  /** 设置表头所有内容过长时显示为省略号 */
  showHeaderOverflow: {
    type: [String, Boolean, null] as PropType<VxeTablePropTypes.ShowHeaderOverflow>,
    // default: 'ellipsis',
    default: true,
  },
  /** 设置表尾所有内容过长时显示为省略号 */
  showFooterOverflow: {
    type: [String, Boolean, null] as PropType<VxeTablePropTypes.ShowFooterOverflow>,
    // default: 'ellipsis',
    default: true,
  },
  /** 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量） */
  keepSource: {
    type: Boolean as PropType<VxeTablePropTypes.KeepSource>,
    default: false,
  },
  /** 自动监听父元素的变化去重新计算表格（对于父元素可能存在动态变化、显示隐藏的容器中、列宽异常等场景中的可能会用到） */
  autoResize: {
    type: Boolean as PropType<VxeTablePropTypes.AutoResize>,
    default: true,
  },
  /** 自动跟随某个属性的变化去重新计算表格，和手动调用 recalculate 方法是一样的效果（对于通过某个属性来控制显示/隐藏切换时可能会用到） */
  syncResize: {
    type: [String, Number, Boolean] as PropType<VxeTablePropTypes.SyncResize>,
  },
  /** 横向虚拟滚动配置（不支持展开行） */
  scrollX: {
    type: Object as PropType<VxeTablePropTypes.ScrollX>,
    default: () => ({
      enabled: true,
      gt: 30,
      /** 设置过大会出现空白间隙，设置为0会实时渲染但是会卡顿 */
      oSize: 0,
    }),
  },
  /** 纵向虚拟滚动配置（不支持展开行） */
  scrollY: {
    type: Object as PropType<VxeTablePropTypes.ScrollY>,
    default: () => ({
      enabled: true,
      mode: 'default',
      gt: 50,
      /** 设置过大会出现空白间隙，设置为0会实时渲染但是会卡顿 */
      oSize: 0,
      scrollToTopOnChange: true,
    }),
  },
  //:==================================================: 全局设置 :==================================================://

  //:==================================================: 局部配置 :==================================================://
  /**
   * 列配置信息（详情查看：https://vxetable.cn/#/grid/api）
   * 1. useKey 代替原有的全局属性 columnKey，是否需要为每一列的 VNode 设置 key 属性（非特殊情况下不需要使用）
   */
  columnConfig: {
    type: Object as PropType<VxeTablePropTypes.ColumnConfig>,
    default: () => ({
      resizable: true,
    }),
  },
  /**
   * 行配置信息（详情查看：https://vxetable.cn/#/grid/api）
   * 1. useKey 代替原有的全局属性 rowKey，是否需要为每一列的 VNode 设置 key 属性（非特殊情况下不需要使用）
   * 2. keyField 代替原有的全局属性 rowId，自定义行数据唯一主键的字段名（默认自动生成），默认值为 _X_ROW_KEY
   */
  rowConfig: {
    type: Object as PropType<VxeTablePropTypes.RowConfig>,
    default: () => ({
      keyField: ROW_KEY,
      height: DEFAULT_LINE_HEIGTH,
    }),
  },
  /**
   * 自定义列配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  customConfig: {
    type: Object as PropType<VxeTablePropTypes.CustomConfig>,
  },
  /**
   * 列宽拖动配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  resizableConfig: {
    type: Object as PropType<VxeTablePropTypes.ResizableConfig>,
  },
  /**
   * 序号配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  seqConfig: {
    type: Object as PropType<VxeTablePropTypes.SeqConfig>,
  },
  /**
   * 排序配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  sortConfig: {
    type: Object as PropType<VxeTablePropTypes.SortConfig>,
  },
  /**
   * 筛选配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  filterConfig: {
    type: Object as PropType<VxeTablePropTypes.FilterConfig>,
  },
  /**
   * 单选框配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  radioConfig: {
    type: Object as PropType<VxeTablePropTypes.RadioConfig & { enabled: boolean }>,
    default: () => ({
      enabled: false,
      highlight: true,
    }),
  },
  /**
   * 复选框配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  checkboxConfig: {
    type: Object as PropType<VxeTablePropTypes.CheckboxConfig & { enabled: boolean }>,
    default: () => ({
      range: true,
      enabled: true,
      highlight: true,
    }),
  },
  /**
   * tooltip 配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  tooltipConfig: {
    type: Object as PropType<VxeTablePropTypes.TooltipConfig>,
    default: () => ({
      theme: 'dark',
    }),
  },
  /**
   * 导出配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  exportConfig: {
    type: Object as PropType<VxeTablePropTypes.ExportConfig>,
  },
  /**
   * 导入配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  importConfig: {
    type: Object as PropType<VxeTablePropTypes.ImportConfig>,
  },
  /**
   * 打印配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  printConfig: {
    type: Object as PropType<VxeTablePropTypes.PrintConfig>,
  },
  //:==================================================: 需付费，使用时请查看文档 :==================================================://
  /**
   * 鼠标配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 部分属性需购买 pro 才能支持
   */
  mouseConfig: {
    type: Object as PropType<VxeTablePropTypes.MouseConfig>,
  },
  /**
   * 区域选取配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 全部属性需购买 pro 才能支持
   */
  areaConfig: {
    type: Object as PropType<VxeTablePropTypes.AreaConfig>,
  },
  /**
   * 查找/替换配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 全部属性需购买 pro 才能支持
   */
  fnrConfig: {
    type: Object as PropType<VxeTablePropTypes.FNRConfig>,
  },
  /**
   * 按键配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 部分属性需购买 pro 才能支持
   */
  keyboardConfig: {
    type: Object as PropType<VxeTablePropTypes.KeyboardConfig>,
  },
  /**
   * 复制/粘贴配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 全部属性需购买 pro 才能支持
   */
  clipConfig: {
    type: Object as PropType<VxeTablePropTypes.ClipConfig>,
  },
  /**  表格筛选组件modal类名  */
  filterModalClassName: {
    type: String,
  },
  //:==================================================: 需付费，使用时请查看文档 :==================================================://
  /**
   * 展开行配置项（不支持虚拟滚动）（详情查看：https://vxetable.cn/#/grid/api）
   */
  expandConfig: {
    type: Object as PropType<VxeTablePropTypes.ExpandConfig>,
  },
  /**
   * 树形结构配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  treeConfig: {
    type: Object as PropType<VxeTablePropTypes.TreeConfig>,
  },
  /**
   * 快捷菜单配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  menuConfig: {
    type: Object as PropType<VxeTablePropTypes.MenuConfig>,
  },
  /**
   * 可编辑配置项（详情查看：https://vxetable.cn/#/grid/api）
   */
  editConfig: {
    type: Object as PropType<VxeTablePropTypes.EditConfig>,
  },
  /**
   * 校验配置项（详情查看：https://vxetable.cn/#/grid/api）
   * 1. autoPos 是否自动定位到校验不通过的单元格
   */
  validConfig: {
    type: Object as PropType<VxeTablePropTypes.ValidConfig>,
  },
  /** 校验规则配置项（详情查看：https://vxetable.cn/#/grid/api） */
  editRules: {
    type: Object as PropType<VxeTablePropTypes.EditRules>,
  },
  /** 空数据时显示的内容（详情查看：https://vxetable.cn/#/grid/api） */
  emptyText: {
    type: String as PropType<VxeTablePropTypes.EmptyText>,
  },
  /**
   * 空内容渲染配置项（详情查看：https://vxetable.cn/#/grid/api），empty-render 的优先级大于 empty-text
   * 1. name: 渲染器名称
   */
  emptyRender: {
    type: Object as PropType<VxeTablePropTypes.EmptyRender>,
  },
  /** 列配置（详情查看：https://vxetable.cn/#/grid/api） */
  columns: {
    type: Object as PropType<VxeGridPropTypes.Columns>,
  },
  /** 分页配置项（详情查看：https://vxetable.cn/#/grid/api） */
  pagerConfig: {
    type: Object as PropType<PagerConfig>,
    default: () => ({
      size: 'mini',
      layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total'],
      pageSize: PAGE_SIZE,
      pageSizes: PAGE_SIZE_OPTIONS.map((size) => Number(size)),
      controller: 'backend',
    }),
  },
  /**
   * 数据代理（详情查看：https://vxetable.cn/#/table/grid/proxy）
   * 1. 通过配置 proxy-config 参数，默认直接读取结果，响应结果应该为数组
   * 2. 可以通过 props 修改默认值，由 pager-config 代理数据转换，只需要配置好数据源即可；非常简单就可以渲染一个表格，从重复写冗余的代码中解放出来
   * 3. 接收一个 Promise
   */
  proxyConfig: {
    type: Object as PropType<VxeGridPropTypes.ProxyConfig>,
  },
  /** 工具栏配置（详情查看：https://vxetable.cn/#/grid/api） */
  toolbarConfig: {
    type: Object as PropType<VxeGridPropTypes.ToolbarConfig>,
  },
  /** 表单配置项（详情查看：https://vxetable.cn/#/grid/api） */
  formConfig: {
    type: Object as PropType<VxeGridPropTypes.FormConfig>,
  },
  /** 缩放配置项（详情查看：https://vxetable.cn/#/grid/api） */
  zoomConfig: {
    type: Object as PropType<VxeGridPropTypes.ZoomConfig>,
  },
  //:==================================================: 局部配置 :==================================================://

  //:==================================================: 扩展配置 :==================================================://
  /** 控制 filterform & customaction 整体显示与隐藏 */
  showOperations: {
    type: Boolean,
    default: true,
  },
  /** 表格过滤表单 filterform 配置 */
  filterFormConfig: {
    type: Object as PropType<TableProFilterFormConfig>,
    default: () => ({
      enabled: true,
    }),
  },
  /** 自定义按钮 customaction 配置 */
  customActionConfig: {
    type: Object as PropType<TableProCustomActionConfig>,
    default: () => ({
      enabled: true,
    }),
  },
  /** 异步数据接口 */
  api: {
    type: Function as PropType<TableProApi<Promise<any>>>,
  },
  /** 异步数据接口请求前函数 */
  beforeApi: {
    type: Function as PropType<TableProApi<any>>,
  },
  /** 异步数据接口请求后函数 */
  afterApi: {
    type: Function as PropType<(...arg: any[]) => any>,
  },
  /** 异步数据接口配置 */
  apiSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING
    },
  },
  /** 表格数据是否立即加载 */
  immediate: {
    type: Boolean,
    default: true,
  },
  /** 当数据源被更改时，自动将横向滚动条滚动到顶部，自动将横向滚动条滚动到左侧 */
  scrollToRawPos: {
    type: Boolean,
    default: true,
  },
  /** 给table填充颜色，将table和filterform区分开 */
  fillInner: {
    type: Boolean,
    default: true,
  },
  /** 覆盖tooltip */
  showTooltip: {
    type: Boolean,
    default: true,
  },
  /** 是否使用固定行高 */
  fixedLineHeight: {
    type: Boolean,
    default: true,
  },
  //:==================================================: 扩展配置 :==================================================://
}
/** table props 类型 */
export type TableProProps = ExtractPropTypes<typeof tableProProps>
