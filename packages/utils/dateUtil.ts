/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return moment(date).format(format)
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return date ? moment(date).format(format) : ''
}

export const dateUtil = moment

export function getMomentFormatString(date, valueFormat = DATE_TIME_FORMAT) {
  // 通过defaultvalue传入的是moment对象要把原本的值取出来
  if (date._isAMomentObject)
    return date.format(valueFormat)

  if (typeof date === 'string' && !(date.includes('T') || date.includes('Z'))) {
    // 通过组件选择出来的是处理好的string
    return date
  }
  else {
    // 通过 defaultvalue 设置time，直接通过validate获得的是iso时间，需要moment转回字符串
    return formatToDate(date, valueFormat)
  }
}
