import VXETable from 'vxe-table'
import VXETablePluginAntd from './components/vxe-table-plugin-antd'
// import VXETablePluginAntd from 'vxe-table-plugin-antd'
// import 'vxe-table-plugin-antd/dist/style.css'
import type { VXETableSetupOptions } from 'vxe-table'
// import 'vxe-table/lib/style.css'
import 'xe-utils'
import type { App } from 'vue'

export function setupVxeTable(app: App) {
  // VXETable 全局配置
  const VXETableGlobalSettings = {
    // size: null, // 全局尺寸
    zIndex: 999, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
    // version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
    // table: {
    //   showHeader: true,
    //   keepSource: false,
    //   showOverflow: null,
    //   showHeaderOverflow: null,
    //   showFooterOverflow: null,
    //   size: null,
    //   autoResize: false,
    //   stripe: false,
    //   border: false,
    //   round: false,
    //   emptyText: '暂无数据',
    //   rowConfig: {
    //     keyField: '_X_ROW_KEY' // 行数据的唯一主键字段名
    //   },
    //   radioConfig: {
    //     trigger: 'default'
    //   },
    //   checkboxConfig: {
    //     strict: false,
    //     highlight: false,
    //     range: false,
    //     trigger: 'default'
    //   },
    //   sortConfig: {
    //     remote: false,
    //     trigger: 'default',
    //     orders: ['asc', 'desc', null],
    //     sortMethod: null
    //   },
    //   filterConfig: {
    //     remote: false,
    //     filterMethod: null
    //   },
    //   expandConfig: {
    //     trigger: 'default',
    //     showIcon: true
    //   },
    //   treeConfig: {
    //     rowField: 'id',
    //     parentField: 'parentId',
    //     children: 'children',
    //     hasChild: 'hasChild',
    //     mapChildren: '_X_ROW_CHILD',
    //     indent: 20,
    //     showIcon: true
    //   },
    //   tooltipConfig: {
    //     enterable: true
    //   },
    //   menuConfig: {
    //     visibleMethod () {}
    //   },
    //   editConfig: {
    //     mode: 'cell',
    //     showAsterisk: true
    //   },
    //   importConfig: {
    //     modes: ['insert', 'covering']
    //   },
    //   exportConfig: {
    //     modes: ['current', 'selected']
    //   },
    //   customConfig: {
    //    storage: false
    //   },
    //   scrollX: {
    //     gt: 60
    //   },
    //   scrollY: {
    //     gt: 100
    //   }
    // },
    // grid: {
    //   size: null,
    //   zoomConfig: {
    //     escRestore: true
    //   },
    //   pagerConfig: {
    //     perfect: false
    //   },
    //   toolbarConfig: {
    //     perfect: false
    //   },
    //   proxyConfig: {
    //     autoLoad: true,
    //     message: true,
    //     props: {
    //       list: null, // 用于列表，读取响应数据
    //       result: 'result', // 用于分页，读取响应数据
    //       total: 'page.total' // 用于分页，读取总条数
    //     }
    //     beforeItem: null,
    //     beforeColumn: null,
    //     beforeQuery: null,
    //     afterQuery: null,
    //     beforeDelete: null,
    //     afterDelete: null,
    //     beforeSave: null,
    //     afterSave: null
    //   }
    // },
    // pager: {
    //   size: null,
    //   autoHidden: false,
    //   perfect: true,
    //   pageSize: 10,
    //   pagerCount: 7,
    //   pageSizes: [10, 15, 20, 50, 100],
    //   layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
    // },
    // form: {
    //   preventSubmit: false
    //   size: null,
    //   colon: false,
    //   validConfig: {
    //     autoPos: true
    //   },
    //   tooltipConfig: {
    //     enterable: true
    //   },
    //   titleAsterisk: true
    // },
    // input: {
    //   size: null,
    //   transfer: false
    //   parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
    //   labelFormat: '',
    //   valueFormat: '',
    //   startDay: 1,
    //   digits: 2,
    //   controls: true
    // },
    // textarea: {
    //   size: null
    //   autosize: {
    //     minRows: 1,
    //     maxRows: 10
    //   }
    // },
    // select: {
    //   size: null,
    //   transfer: false,
    //   optionConfig: {
    //     keyField: '_X_OPTION_KEY' // 选项数据的唯一主键字段名
    //   },
    //   multiCharOverflow: 8
    // },
    // toolbar: {
    //   size: null,
    //   import: {
    //     mode: 'covering'
    //   },
    //   export: {
    //     types: ['csv', 'html', 'xml', 'txt']
    //   },
    //   custom: {
    //     isFooter: true
    //   },
    //   buttons: [],
    //   tools: []
    // },
    // button: {
    //   size: null,
    //   transfer: false
    // },
    // radio: {
    //   size: null
    // },
    // checkbox: {
    //   size: null
    // },
    // switch: {
    //   size: null
    // },
    // modal: {
    //   // size: null,
    //   minWidth: 340,
    //   minHeight: 200,
    //   lockView: true,
    //   mask: true,
    //   duration: 3000,
    //   marginSize: 0,
    //   dblclickZoom: true,
    //   showTitleOverflow: true
    //   storage: false
    // },
    // list: {
    //   scrollY: {
    //     gt: 100
    //   }
    // }
  }
  // 如果项目已有适合的图标，例如第三方图标库：font-awesome、inconfont，可通过配置替换并自行调整相关的样式即可
  const VXETableGlobalIcons = {
    //   // table
    //   TABLE_SORT_ASC: 'vxe-icon--caret-top',
    //   TABLE_SORT_DESC: 'vxe-icon--caret-bottom',
    //   TABLE_FILTER_NONE: 'vxe-icon--funnel',
    //   TABLE_FILTER_MATCH: 'vxe-icon--funnel',
    //   TABLE_EDIT: 'vxe-icon--edit-outline',
    //   TABLE_TREE_LOADED: 'vxe-icon--refresh roll',
    //   TABLE_TREE_OPEN: 'vxe-icon--caret-right rotate90',
    //   TABLE_TREE_CLOSE: 'vxe-icon--caret-right',
    //   TABLE_EXPAND_LOADED: 'vxe-icon--refresh roll',
    //   TABLE_EXPAND_OPEN: 'vxe-icon--arrow-right rotate90',
    //   TABLE_EXPAND_CLOSE: 'vxe-icon--arrow-right',
    //   // button
    //   BUTTON_DROPDOWN: 'vxe-icon--arrow-bottom',
    //   BUTTON_LOADING: 'vxe-icon--refresh roll',
    //   // select
    //   SELECT_OPEN: 'vxe-icon--caret-bottom rotate180',
    //   SELECT_CLOSE: 'vxe-icon--caret-bottom',
    //   // pager
    //   PAGER_JUMP_PREV: 'vxe-icon--d-arrow-left',
    //   PAGER_JUMP_NEXT: 'vxe-icon--d-arrow-right',
    //   PAGER_PREV_PAGE: 'vxe-icon--arrow-left',
    //   PAGER_NEXT_PAGE: 'vxe-icon--arrow-right',
    //   PAGER_JUMP_MORE: 'vxe-icon--more',
    //   // input
    //   INPUT_CLEAR: 'vxe-icon--close',
    //   INPUT_PWD: 'vxe-icon--eye-slash',
    //   INPUT_SHOW_PWD: 'vxe-icon--eye',
    //   INPUT_PREV_NUM: 'vxe-icon--caret-top',
    //   INPUT_NEXT_NUM: 'vxe-icon--caret-bottom',
    //   INPUT_DATE: 'vxe-icon--calendar',
    //   INPUT_SEARCH: 'vxe-icon--search',
    //   // modal
    //   MODAL_ZOOM_IN: 'vxe-icon--square',
    //   MODAL_ZOOM_OUT: 'vxe-icon--zoomout',
    //   MODAL_CLOSE: 'vxe-icon--close',
    //   MODAL_INFO: 'vxe-icon--info',
    //   MODAL_SUCCESS: 'vxe-icon--success',
    //   MODAL_WARNING: 'vxe-icon--warning',
    //   MODAL_ERROR: 'vxe-icon--error',
    //   MODAL_QUESTION: 'vxe-icon--question',
    //   MODAL_LOADING: 'vxe-icon--refresh roll',
    //   // toolbar
    //   TOOLBAR_TOOLS_REFRESH: 'vxe-icon--refresh',
    //   TOOLBAR_TOOLS_REFRESH_LOADING: 'vxe-icon--refresh roll',
    //   TOOLBAR_TOOLS_IMPORT: 'vxe-icon--upload',
    //   TOOLBAR_TOOLS_EXPORT: 'vxe-icon--download',
    //   TOOLBAR_TOOLS_ZOOM_IN: 'vxe-icon--zoomin',
    //   TOOLBAR_TOOLS_ZOOM_OUT: 'vxe-icon--zoomout',
    //   TOOLBAR_TOOLS_CUSTOM: 'vxe-icon--menu',
    //   // form
    //   FORM_PREFIX: 'vxe-icon--info',
    //   FORM_SUFFIX: 'vxe-icon--info',
    //   FORM_FOLDING: 'vxe-icon--arrow-top rotate180',
    //   FORM_UNFOLDING: 'vxe-icon--arrow-top'
    // }
  }

  const setupOptions: VXETableSetupOptions = Object.assign(VXETableGlobalSettings, {
    icon: VXETableGlobalIcons,
  })

  VXETable.interceptor.add('event.clearActived', function (this: any, params: any) {
    console.log(this, params)
  })

  // 注册插件
  VXETable.use(VXETablePluginAntd)

  // 注册自定义组件
  // registerAllComponent()

  // 执行注册方法
  // VXETable.setup(setupOptions)
  app.use(VXETable, setupOptions)
}
