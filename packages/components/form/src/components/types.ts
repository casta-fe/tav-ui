import dayjs from 'dayjs'

export interface ApiSelectOptionsItem {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioButtonGroupOptionsItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
}
export type RadioButtonGroupOptionItem = string | RadioButtonGroupOptionsItem

export const dateRangeRecord = {
  /** 今天 */
  day: { label: '今天', key: 'day', dateRange: [dayjs().startOf('day'), dayjs().endOf('day')] },
  /** 本周 */
  week: {
    label: '本周',
    key: 'week',
    dateRange: [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  /** 本月 */
  month: {
    label: '本月',
    key: 'month',
    dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
  },
  /** 本季度 */
  quarter: {
    label: '本季度',
    key: 'quarter',
    dateRange: [dayjs().startOf('quarter'), dayjs().endOf('quarter')],
  },
  /** 本年 */
  year: {
    label: '本年',
    key: 'year',
    dateRange: [dayjs().startOf('year'), dayjs().endOf('year')],
  },
  /** 上周 */
  lastWeek: {
    label: '上周',
    key: 'lastWeek',
    dateRange: [
      dayjs().subtract(1, 'week').startOf('week'),
      dayjs().subtract(1, 'week').endOf('week'),
    ],
  },
  /** 上月 */
  lastMonth: {
    label: '上月',
    key: 'lastMonth',
    dateRange: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
  /** 上季度 */
  lastQuarter: {
    label: '上季度',
    key: 'lastQuarter',
    dateRange: [
      dayjs().subtract(1, 'quarter').startOf('quarter'),
      dayjs().subtract(1, 'quarter').endOf('quarter'),
    ],
  },
  /** 上一年度 */
  lastYear: {
    label: '上一年度',
    key: 'lastYear',
    dateRange: [
      dayjs().subtract(1, 'year').startOf('year'),
      dayjs().subtract(1, 'year').endOf('year'),
    ],
  },

  /** 第一季度 */
  quarter_1: {
    label: '第一季度',
    key: 'quarter_1',
    dateRange: [dayjs().quarter(1).startOf('quarter'), dayjs().quarter(1).endOf('quarter')],
  },
  /** 第二季度 */
  quarter_2: {
    label: '第二季度',
    key: 'quarter_2',
    dateRange: [dayjs().quarter(2).startOf('quarter'), dayjs().quarter(2).endOf('quarter')],
  },
  /** 第三季度 */
  quarter_3: {
    label: '第三季度',
    key: 'quarter_3',
    dateRange: [dayjs().quarter(3).startOf('quarter'), dayjs().quarter(3).endOf('quarter')],
  },
  /** 第四季度 */
  quarter_4: {
    label: '第四季度',
    key: 'quarter_4',
    dateRange: [dayjs().quarter(4).startOf('quarter'), dayjs().quarter(4).endOf('quarter')],
  },
}

export type DateRangeRecordType = typeof dateRangeRecord
export type DateRangeKeyType = keyof DateRangeRecordType
export type DateRangeValueType = DateRangeRecordType[DateRangeKeyType]
