// Used to configure the general configuration of some components without modifying the components
import type { SorterResult } from '@tav-ui/components/table/src/types/table'

export default {
  // basic-table setting
  table: {
    exportLimit: 10000,
    // Form interface request general configuration
    // support xxx.xxx.xxx
    fetchSetting: {
      // pageField: "page",
      // 请求接口当前页数
      pageField: 'currentPage',
      // 每页显示多少条
      sizeField: 'pageSize',
      // listField: "items",
      // 请求结果列表字段  支持 a.b.c
      listField: 'result',
      // 请求结果总数字段  支持 a.b.c
      totalField: 'total',
    },
    // Number of pages that can be selected
    pageSizeOptions: ['30', '50', '100'],
    // Default display quantity on one page
    defaultPageSize: 50,
    // Default Size
    defaultSize: 'small',
    // Custom general sort function
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field: sort, order } = sortInfo

      const sotrStrategies = {
        ascend: () => {
          return {
            sort,
            dir: 'asc',
          }
        },
        descend: () => {
          return {
            sort,
            dir: 'desc',
          }
        },
        undefined: () => {
          return {
            sort: '',
            dir: '',
          }
        },
      }

      return !order ? sotrStrategies.undefined() : sotrStrategies[order]()
    },
    // Custom general filter function
    defaultFilterFn: (data: Partial<Record<string, string[]>>) => {
      return data
    },
  },
  // scrollbar setting
  scrollbar: {
    // Whether to use native scroll bar
    // After opening, the menu, modal, drawer will change the pop-up scroll bar to native
    native: false,
  },
}
