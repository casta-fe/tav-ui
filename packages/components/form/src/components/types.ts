import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { tavI18n } from '@tav-ui/locales'
dayjs.extend(quarterOfYear)
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

export const getDateRangeRecord = () => {
  return {
    /** 今天 */
    day: {
      label: tavI18n('Tav.time.8'),
      key: 'day',
      dateRange: [dayjs().startOf('day'), dayjs().endOf('day')],
    },
    /** 本周 */
    week: {
      label: tavI18n('Tav.time.9'),
      key: 'week',
      dateRange: [dayjs().startOf('week'), dayjs().endOf('week')],
    },
    /** 本月 */
    month: {
      label: tavI18n('Tav.time.10'),
      key: 'month',
      dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
    },
    /** 本季度 */
    quarter: {
      label: tavI18n('Tav.time.11'),
      key: 'quarter',
      dateRange: [dayjs().startOf('quarter'), dayjs().endOf('quarter')],
    },
    /** 本年 */
    year: {
      label: tavI18n('Tav.time.12'),
      key: 'year',
      dateRange: [dayjs().startOf('year'), dayjs().endOf('year')],
    },
    /** 上周 */
    lastWeek: {
      label: tavI18n('Tav.time.13'),
      key: 'lastWeek',
      dateRange: [
        dayjs().subtract(1, 'week').startOf('week'),
        dayjs().subtract(1, 'week').endOf('week'),
      ],
    },
    /** 上月 */
    lastMonth: {
      label: tavI18n('Tav.time.14'),
      key: 'lastMonth',
      dateRange: [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
      ],
    },
    /** 上季度 */
    lastQuarter: {
      label: tavI18n('Tav.time.15'),
      key: 'lastQuarter',
      dateRange: [
        dayjs().subtract(1, 'quarter').startOf('quarter'),
        dayjs().subtract(1, 'quarter').endOf('quarter'),
      ],
    },
    /** 上一年度 */
    lastYear: {
      label: tavI18n('Tav.time.16'),
      key: 'lastYear',
      dateRange: [
        dayjs().subtract(1, 'year').startOf('year'),
        dayjs().subtract(1, 'year').endOf('year'),
      ],
    },

    /** 第一季度 */
    quarter_1: {
      label: tavI18n('Tav.time.17'),
      key: 'quarter_1',
      dateRange: [dayjs().quarter(1).startOf('quarter'), dayjs().quarter(1).endOf('quarter')],
    },
    /** 第二季度 */
    quarter_2: {
      label: tavI18n('Tav.time.18'),
      key: 'quarter_2',
      dateRange: [dayjs().quarter(2).startOf('quarter'), dayjs().quarter(2).endOf('quarter')],
    },
    /** 第三季度 */
    quarter_3: {
      label: tavI18n('Tav.time.19'),
      key: 'quarter_3',
      dateRange: [dayjs().quarter(3).startOf('quarter'), dayjs().quarter(3).endOf('quarter')],
    },
    /** 第四季度 */
    quarter_4: {
      label: tavI18n('Tav.time.20'),
      key: 'quarter_4',
      dateRange: [dayjs().quarter(4).startOf('quarter'), dayjs().quarter(4).endOf('quarter')],
    },
  }
}
