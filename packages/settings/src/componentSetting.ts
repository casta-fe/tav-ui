// Used to configure the general configuration of some components without modifying the components

import type { SorterResult } from '@tav-ui/components/table/src/types/table'
type Recordable<T = any> = Record<string, T>
export default {
  // basic-table setting
  table: {
    exportLimit: 10000,
    // Form interface request general configuration
    // support xxx.xxx.xxx
    fetchSetting: {
      // The field name of the current page passed to the background
      // pageField: "page",
      pageField: 'currentPage',
      // The number field name of each page displayed in the background
      sizeField: 'pageSize',
      // Field name of the form data returned by the interface
      // listField: "items",
      listField: 'result',
      // Total number of tables returned by the interface field name
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
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
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
